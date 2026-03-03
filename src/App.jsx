import { useState } from "react";
import "./index.css";

const GAS_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD || 3);
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT || 5);

// 預先載入 100 個 DiceBear Seed
const SEEDS = Array.from({ length: 100 }, (_, i) => `master-${i}`);

function App() {
  const [gameStatus, setGameStatus] = useState("IDLE"); // IDLE, LOADING, QUIZ, RESULT
  const [userId, setUserId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState(null);

  // 靜態資源預載入 (DiceBear)
  const getAvatarUrl = (seed) =>
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`;

  const startQuiz = async () => {
    if (!userId.trim()) return alert("請輸入 ID！");
    setGameStatus("LOADING");
    try {
      const resp = await fetch(`${GAS_URL}?count=${QUESTION_COUNT}`);
      const data = await resp.json();
      setQuestions(data);
      setUserAnswers([]);
      setCurrentIndex(0);
      setGameStatus("QUIZ");
    } catch (err) {
      console.error(err);
      alert("無法取得題目，請確認 GAS_URL 是否正確");
      setGameStatus("IDLE");
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = [
      ...userAnswers,
      { questionId: questions[currentIndex].id, chosen: option },
    ];
    setUserAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitResults(newAnswers);
    }
  };

  const submitResults = async (finalAnswers) => {
    setGameStatus("LOADING");
    try {
      const payload = JSON.stringify({ id: userId, answers: finalAnswers });
      const resp = await fetch(
        `${GAS_URL}?action=submit&payload=${encodeURIComponent(payload)}`
      );
      const data = await resp.json();

      setResults(data);
      setGameStatus("RESULT");
    } catch (err) {
      console.error(err);
      setResults({ score: "?", isPassed: false });
      setGameStatus("RESULT");
    }
  };

  if (gameStatus === "LOADING") {
    return (
      <div className="pixel-box scanlines">
        <h2 className="pixel-title">LOADING...</h2>
      </div>
    );
  }

  if (gameStatus === "IDLE") {
    return (
      <div className="pixel-box scanlines">
        <h1 className="pixel-title">PIXEL QUIZ</h1>
        <div style={{ textAlign: "center" }}>
          <p>輸入你的 ID 以開始遊戲</p>
          <input
            className="pixel-input"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="PLAYER ID..."
          />
          <button className="pixel-button" onClick={startQuiz}>
            START MISSION
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === "QUIZ") {
    const q = questions[currentIndex];
    const masterSeed = SEEDS[currentIndex % SEEDS.length];

    return (
      <div className="pixel-box scanlines">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            marginBottom: "10px",
          }}
        >
          <span>ID: {userId}</span>
          <span>
            STAGE: {currentIndex + 1}/{questions.length}
          </span>
        </div>

        <div className="game-master-container">
          <img
            src={getAvatarUrl(masterSeed)}
            alt="Master"
            className="game-master-img"
          />
        </div>

        <p
          style={{ textAlign: "center", minHeight: "60px", lineHeight: "1.5" }}
        >
          {q.question}
        </p>

        <div style={{ display: "grid", gap: "10px" }}>
          {Object.entries(q.options).map(([key, val]) => (
            <button
              key={key}
              className="pixel-button"
              onClick={() => handleAnswer(key)}
            >
              {key}: {val}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (gameStatus === "RESULT") {
    return (
      <div className="pixel-box scanlines" style={{ textAlign: "center" }}>
        <h1 className="pixel-title">
          {results?.isPassed ? "MISSION CLEAR" : "GAME OVER"}
        </h1>
        <p style={{ fontSize: "20px", margin: "20px 0" }}>
          SCORE: {results?.score} / {questions.length}
        </p>
        <p>
          {results?.isPassed
            ? "你成功獲得了通關認證！"
            : "很遺憾，沒能通過門檻..."}
        </p>
        <p style={{ fontSize: "10px", marginTop: "10px", color: "#888" }}>
          結果已記錄至系統
        </p>
        <div style={{ marginTop: "20px" }}>
          <button
            className="pixel-button"
            onClick={() => setGameStatus("IDLE")}
          >
            BACK TO START
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;

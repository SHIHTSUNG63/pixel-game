/**
 * Google Apps Script for Pixel Art Quiz Game
 * 
 * 部署說明：
 * 1. 在 Google Sheet 中點擊「擴充功能」 > 「Apps Script」
 * 2. 貼入此代碼
 * 3. 部署為「網頁應用程式」，並設定為「任何人」都可以存取 (即使沒有 Google 帳戶)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const QUESTION_SHEET_NAME = "題目";
const RESPONSE_SHEET_NAME = "回答";

/**
 * 處理 GET 請求：獲取題目
 * 參數：count (題目數量)
 */
function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // 處理提交請求 (透過 GET 繞過 CORS POST 限制)
  if (e.parameter.action === "submit") {
    const payload = JSON.parse(e.parameter.payload);
    return jsonResponse(processSubmission(ss, payload));
  }

  const sheet = ss.getSheetByName(QUESTION_SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // 移除標題
  
  // 題目欄位索引：題號(0), 題目(1), A(2), B(3), C(4), D(5), 解答(6)
  const questionCount = parseInt(e.parameter.count || 10);
  
  // 隨機選取 N 題
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, questionCount);
  
  const result = selected.map(row => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    }
  }));
  
  return jsonResponse(result);
}

/**
 * 處理 POST 請求：提交答案並記錄成績
 * Payload: { id: "USER_ID", answers: [{ questionId: 1, chosen: "A" }, ...] }
 */
function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const payload = JSON.parse(e.postData.contents);
  return jsonResponse(processSubmission(ss, payload));
}

/**
 * 核心處理邏輯：計算分數並記錄
 */
function processSubmission(ss, payload) {
  const userId = payload.id;
  const userAnswers = payload.answers;
  
  const qSheet = ss.getSheetByName(QUESTION_SHEET_NAME);
  const rSheet = ss.getSheetByName(RESPONSE_SHEET_NAME);
  
  // 獲取正確答案映射
  const qData = qSheet.getDataRange().getValues();
  qData.shift(); // 移除標題
  const answerMap = {};
  qData.forEach(row => {
    answerMap[row[0]] = row[6]; // row[0] 是題號, row[6] 是解答
  });
  
  // 計算分數
  let correctCount = 0;
  userAnswers.forEach(ans => {
    if (String(answerMap[ans.questionId]) === String(ans.chosen)) {
      correctCount++;
    }
  });
  
  const score = correctCount;
  // 從試算表隱藏設定或固定傳入抓取門檻
  const passThreshold = 3; 
  const isPassed = score >= passThreshold;
  
  // 處理「回答」工作表
  const rData = rSheet.getDataRange().getValues();
  rData.shift(); // 移除標題
  
  let userRowIndex = -1;
  const rRawData = rSheet.getDataRange().getValues();
  for (let i = 1; i < rRawData.length; i++) {
    if (rRawData[i][0] == userId) {
      userRowIndex = i + 1;
      break;
    }
  }
  
  const now = new Date();
  if (userRowIndex === -1) {
    const firstPassScore = isPassed ? score : "";
    const attemptsToPass = isPassed ? 1 : 0;
    rSheet.appendRow([userId, 1, score, score, firstPassScore, attemptsToPass, now]);
  } else {
    const currentRow = rSheet.getRange(userRowIndex, 1, 1, 7).getValues()[0];
    const quizCount = currentRow[1] + 1;
    const totalScore = currentRow[2] + score;
    const highScore = Math.max(currentRow[3], score);
    let firstPassScore = currentRow[4];
    let attemptsToPass = currentRow[5];
    
    if (isPassed && !firstPassScore) {
      firstPassScore = score;
      attemptsToPass = quizCount;
    }
    
    rSheet.getRange(userRowIndex, 1, 1, 7).setValues([[
      userId, quizCount, totalScore, highScore, firstPassScore, attemptsToPass, now
    ]]);
  }
  
  return {
    id: userId,
    score: score,
    totalQuestions: userAnswers.length,
    isPassed: isPassed
  };
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

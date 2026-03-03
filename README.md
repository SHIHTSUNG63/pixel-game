# 👾 PIXEL QUIZ - 像素風闖關問答遊戲

這是一個採用 React Vite 開發，具備 2000 年代街機風格的網頁問答遊戲。後端完全整合 Google Sheets 與 Google Apps Script，方便管理題目與紀錄讀者成績。

## 🛠 開發與執行指令

### 選項 A：使用 Node.js (標準 React Vite)

請在專案根目錄開啟終端機 (Terminal) 並依序執行：

```bash
npm install
npm run dev
```

> [!WARNING]
> **Windows/PowerShell 常見錯誤**：
> 如果出現 `UnauthorizedAccess`，請改用 **Command Prompt (CMD)** 執行，或以系統管理員身分執行：
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 選項 B：極速免安裝模式 (Standalone) ⚡

如果您不想安裝 Node.js 或 `npm` 遇到困難，請直接使用此檔案：

1. 在資料夾中找到 `standalone.html`。
2. 按右鍵選擇「用瀏覽器開啟」。
3. 這是完全獨立的 HTML 檔案，包含所有樣式與邏輯，適合快速展示或環境受限時使用。
   - **快速存取**：[點此開啟 standalone.html](file:///d:/Github/pixel-game/standalone.html)

### 3. 編譯生產版本 (部署用)

若要將代碼打包成靜態檔案：

```bash
npm run build
```

---

## 🚀 快速開始設置

### 1. Google Sheets 設置 (重要)

請建立一個新的 Google 試算表，並設置以下兩個工作表 (Tabs)：

#### A. 工作表名稱：「題目」

| 題號 | 題目     | A     | B     | C     | D     | 解答 |
| :--- | :------- | :---- | :---- | :---- | :---- | :--- |
| 1    | 範例題目 | 選項1 | 選項2 | 選項3 | 選項4 | A    |

#### B. 工作表名稱：「回答」

請手動建立首列標題：
`ID`、`闖關次數`、`總分`、`最高分`、`第一次通關分數`、`花了幾次通關`、`最近遊玩時間`

---

### 3. Google Apps Script 部署

1. 在試算表中點擊 **「擴充功能」 > 「Apps Script」**。
2. 將專案中的 `gas_script.gs` 內容完整貼入。
3. 點擊右上角 **「部署」 > 「新部署」**。
4. 類型選擇 **「網頁應用程式」**：
   - 說明：Pixel Quiz Backend
   - 執行身分：**我 (Your Email)**
   - 誰有權限存取：**任何人 (Anyone)** (這點最重要)
5. 點擊「部署」，並授權存取。
6. **複製產生的「網頁應用程式 URL」**。

---

### 4. 環境變數配置

在專案根目錄建立或修改 `.env` 檔案：

```env
VITE_GOOGLE_APP_SCRIPT_URL=你的_GAS_網頁應用程式_URL
VITE_PASS_THRESHOLD=7
VITE_QUESTION_COUNT=10
```

---

## 🚀 自動部署 (GitHub Pages)

本專案已設定 GitHub Actions，當你推送程式碼到 `main` 分支時會自動部署。

### 1. 設定 GitHub Secrets

為了讓部署過程能正確讀取環境變數，請至 GitHub 儲存庫設定：

1. 進入 GitHub Repository 頁面。
2. 點擊 **Settings > Secrets and variables > Actions**。
3. 點擊 **New repository secret**，依序加入以下變數：
   - `VITE_GOOGLE_APP_SCRIPT_URL`: 你的 Google Apps Script URL。
   - `VITE_PASS_THRESHOLD`: 通關分數門檻 (例如 7)。
   - `VITE_QUESTION_COUNT`: 總題目量 (例如 10)。

### 2. 開啟 GitHub Pages

1. 進入 **Settings > Pages**。
2. 在 **Build and deployment > Source** 選擇 **Deploy from a branch**。
3. Branch 選擇 `gh-pages` 且資料夾為 `/ (root)`。
4. 儲存後，等待 Action 跑完即可看到你的遊戲網頁！

---

## 📚 測試題目庫：生成式 AI 基礎知識 (10 題)

請直接複製以下表格內容並貼上到你的「題目」工作表中：

| 題號 | 題目                                                   | A                 | B                        | C                          | D                   | 解答 |
| :--- | :----------------------------------------------------- | :---------------- | :----------------------- | :------------------------- | :------------------ | :--- |
| 1    | 下列哪一個模型主要用於「生成文本」？                   | Stable Diffusion  | GPT-4                    | Midjourney                 | YOLO                | B    |
| 2    | LLM 的全稱是什麼？                                     | Large Logic Model | Low Language Model       | Large Language Model       | Long Linking Model  | C    |
| 3    | 在生成式 AI 中，「Prompt」通常指的是什麼？             | 記憶體快取        | 提示詞或指令             | 電池電量                   | 網路延遲            | B    |
| 4    | 生成式 AI 產生錯誤但聽起來很合理的資訊，這種現象稱為？ | 雜訊 (Noise)      | 幻覺 (Hallucination)     | 遺忘 (Forgetting)          | 擾動 (Perturbation) | B    |
| 5    | Midjourney 主要用於生成什麼類型的內容？                | 文字              | 程式碼                   | 圖片                       | 音樂                | C    |
| 6    | 下列哪種技術是目前生成式 AI 的核心架構？               | Transformer       | Blockchain               | NFT                        | TCP/IP              | A    |
| 7    | 「多模態 (Multimodal)」模型是指什麼？                  | 支援多種語言      | 支援多個使用者           | 同時處理多種格式(如圖、文) | 支援多種顯示器      | C    |
| 8    | 生成式 AI 中的「Zero-shot learning」是指？             | 訓練時沒有資料    | 不提供範例直接讓模型執行 | 模型完全不學習             | 只有一次生成的機會  | B    |
| 9    | 下列哪一個不是生成式 AI 的應用場景？                   | 撰寫程式碼        | 自動生成週報             | 即時預測股市漲跌           | 圖像修復            | C    |
| 10   | 下列哪一個公司開發了 ChatGPT？                         | Google            | Meta                     | Apple                      | OpenAI              | D    |

---

## 🎨 技術細節

- **前端串接**：使用 `fetch` 搭配 `GET` 參數傳遞 (包含 `action=submit` 與 `payload`) 以繞過跨域限制。
- **視覺效果**：純 CSS 實作 CRT 掃描線與像素畫框效果。
- **動態關主**：使用 DiceBear API `pixel-art` 風格。

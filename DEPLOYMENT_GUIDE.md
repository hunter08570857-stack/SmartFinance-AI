
# SmartFinance AI 部署指南 (GitHub Pages + Firebase)

這份指南將協助您將此專案成功部署至 GitHub Pages，並正確串接 Firebase 與 Gemini AI。

## 第一階段：準備工作

1.  **Firebase 設定**:
    *   前往 [Firebase Console](https://console.firebase.google.com/)。
    *   點擊「新增專案」，輸入專案名稱。
    *   進入專案後，在「建置」選單中點擊 **Authentication**，啟用「電子郵件/密碼」登入方式。
    *   點擊 **Firestore Database**，點擊「建立資料庫」，選擇「以測試模式啟動」（稍後可修改規則）。
    *   在專案設定中，點擊「新增應用程式」(網頁圖示)，註冊後您會得到一段 `firebaseConfig` JSON 物件。

2.  **Google AI (Gemini) 設定**:
    *   前往 [Google AI Studio](https://aistudio.google.com/)。
    *   點擊「Get API Key」，生成一組 API Key。

## 第二階段：GitHub 設定

1.  **建立 Repository**:
    *   在 GitHub 上建立一個新的儲存庫。
    *   使用 AI Studio 的「Save to GitHub」功能將代碼推送至該儲存庫。

2.  **設定 GitHub Secrets (最重要的安全步驟)**:
    *   進入您 GitHub 儲存庫的 **Settings** -> **Secrets and variables** -> **Actions**。
    *   點擊 **New repository secret**，新增以下兩個資訊：
        *   `API_KEY`: 貼上您的 Gemini API Key。
        *   `FIREBASE_CONFIG`: 貼上您的 Firebase 設定 JSON 字串。格式應如下：
            ```json
            {"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
            ```

## 第三階段：自動化部署

1.  **觸發 Action**:
    *   每當您推送代碼至 `main` 分支時，GitHub Actions 會自動啟動（已為您寫好 `.github/workflows/deploy.yml`）。
    *   您可以在儲存庫的 **Actions** 分頁查看進度。

2.  **開啟 GitHub Pages**:
    *   部署完成後，進入 **Settings** -> **Pages**。
    *   在 **Build and deployment** 下的 **Source** 選擇 "GitHub Actions"。
    *   頁面上方會顯示您的網址 (例如：`https://username.github.io/repo-name/`)。

## 常見問題排查

*   **白色畫面**: 
    *   請確認 `vite.config.ts` 中的 `base` 是否設定為 `./`。
    *   確認 `index.html` 中的 script 路徑是否正確（必須是 `./index.tsx`）。
*   **Firebase 報錯**: 
    *   請確認 GitHub Secrets 中的 `FIREBASE_CONFIG` 是有效的 JSON 字串。
    *   確認 Firebase Auth 已啟用電子郵件登入。
*   **AI 無法運作**:
    *   確認 `API_KEY` 已正確注入。

如果您在 GitHub Actions 中看到編譯錯誤，通常是因為 TypeScript 嚴格檢查。本專案已包含嚴格型別定義與空值檢查，應可順利通過。

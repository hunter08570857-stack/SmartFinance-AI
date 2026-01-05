
import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
// Consolidate Firestore modular SDK imports to resolve "no exported member" errors
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfigStr = process.env.FIREBASE_CONFIG;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (firebaseConfigStr && firebaseConfigStr.trim() !== '') {
  try {
    // 預期 Secret 存入的是一段 JSON 字串
    const config = JSON.parse(firebaseConfigStr);
    if (config && config.apiKey) {
      let app: FirebaseApp;
      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("Firebase 連結成功：已進入正式模式。");
    }
  } catch (e) {
    console.error("Firebase 初始化失敗 (可能是 JSON 格式錯誤)，自動切換至展示模式：", e);
  }
} else {
  console.log("未偵測到 Firebase 配置，系統運行於展示模式。");
}

export { auth, db };

export const isFirebaseAvailable = (): boolean => {
  return auth !== null && db !== null;
};

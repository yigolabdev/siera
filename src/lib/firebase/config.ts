import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase 설정
// 실제 프로젝트 생성 후 Firebase Console에서 가져온 값으로 교체해야 합니다
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// Firebase 초기화
let app;
let auth;
let db;
let storage;
let isFirebaseInitialized = false;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseInitialized = true;
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Firebase 초기화 완료 Promise
export const waitForFirebase = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isFirebaseInitialized) {
      resolve();
    } else {
      // Firebase가 초기화될 때까지 최대 5초 대기
      const checkInterval = setInterval(() => {
        if (isFirebaseInitialized) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(); // 타임아웃 후에도 진행
      }, 5000);
    }
  });
};

export { app, auth, db, storage, isFirebaseInitialized };

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

try {
  console.log('🔥 Firebase 초기화 시작...');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log('✅ Firebase 초기화 완료!');
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error);
  throw error; // 초기화 실패 시 에러를 던져서 명확하게 함
}

// Firebase는 이미 동기적으로 초기화되었으므로 즉시 resolve
export const waitForFirebase = (): Promise<void> => {
  return Promise.resolve();
};

export { app, auth, db, storage };

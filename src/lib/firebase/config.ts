import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, memoryLocalCache, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const isDev = import.meta.env.DEV;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Firestore 오프라인 캐시 활성화 (IndexedDB 기반)
  // persistentSingleTabManager 사용 (모바일 호환성 향상)
  // - persistentMultipleTabManager는 BroadcastChannel API를 사용하는데
  //   일부 모바일 브라우저에서 IndexedDB 잠금/초기화 지연 문제를 일으킴
  // - persistentSingleTabManager는 더 단순하고 안정적인 IndexedDB 접근 제공
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager(undefined),
      }),
    });
    if (isDev) {
      console.log('Firebase 초기화 완료 (IndexedDB 오프라인 캐시 활성화)');
    }
  } catch (cacheError) {
    // IndexedDB를 사용할 수 없는 환경 (프라이빗 브라우징, 저장 공간 부족 등)
    // 메모리 캐시로 폴백
    console.warn('⚠️ IndexedDB 캐시 초기화 실패, 메모리 캐시로 폴백:', cacheError);
    db = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  }

  storage = getStorage(app);
} catch (error) {
  console.error('Firebase 초기화 실패:', error);
  throw error;
}

export const waitForFirebase = (): Promise<void> => Promise.resolve();

export { app, auth, db, storage };

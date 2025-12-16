import { STORAGE_KEYS } from '../constants';

/**
 * 로컬 스토리지 유틸리티
 */
export const storage = {
  /**
   * 데이터 저장
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error saving to localStorage: ${key}`, error);
    }
  },

  /**
   * 데이터 가져오기
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * 데이터 삭제
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * 모든 데이터 삭제
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  },
};

/**
 * 특정 키에 대한 타입 안전한 스토리지 헬퍼
 */
export const userStorage = {
  get: () => storage.get<any>(STORAGE_KEYS.USER),
  set: (user: any) => storage.set(STORAGE_KEYS.USER, user),
  remove: () => storage.remove(STORAGE_KEYS.USER),
};

export const savedEmailStorage = {
  get: () => storage.get<string>(STORAGE_KEYS.SAVED_EMAIL),
  set: (email: string) => storage.set(STORAGE_KEYS.SAVED_EMAIL, email),
  remove: () => storage.remove(STORAGE_KEYS.SAVED_EMAIL),
};


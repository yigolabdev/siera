import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import type { Executive } from '../types';  // ✅ Use type import
import { waitForFirebase } from '../lib/firebase/config';

export type { Executive };  // ✅ Re-export for compatibility

interface ExecutiveContextType {
  executives: Executive[];
  isLoading: boolean;
  error: string | null;
  addExecutive: (executive: Omit<Executive, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExecutive: (executiveId: string, updates: Partial<Executive>) => Promise<void>;
  deleteExecutive: (executiveId: string) => Promise<void>;
  getExecutivesByCategory: (category: 'chairman' | 'committee') => Executive[];
  refreshExecutives: () => Promise<void>;
}

const ExecutiveContext = createContext<ExecutiveContextType | undefined>(undefined);

export const ExecutiveProvider = ({ children }: { children: ReactNode }) => {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Firebase에서 운영진 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      // Firebase는 동기적으로 초기화됨
      await loadExecutives();
    };
    initializeData();
  }, []);

  const loadExecutives = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<Executive>('executives');
      if (result.success && result.data) {
        setExecutives(result.data);
        console.log('✅ Firebase에서 운영진 데이터 로드:', result.data.length);
      } else {
        console.log('ℹ️ Firebase에서 로드된 운영진 데이터가 없습니다.');
      }
    } catch (err: any) {
      console.error('❌ Firebase 운영진 데이터 로드 실패:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 운영진 추가
  const addExecutive = useCallback(async (
    executiveData: Omit<Executive, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const executiveId = `executive_${Date.now()}`;
      const now = new Date().toISOString();
      
      const newExecutive: Executive = {
        ...executiveData,
        id: executiveId,
        createdAt: now,
        updatedAt: now,
      };

      const result = await setDocument('executives', executiveId, newExecutive);
      if (result.success) {
        setExecutives(prev => [...prev, newExecutive]);
        console.log('✅ 운영진 추가 완료:', executiveId);
      } else {
        throw new Error(result.error || '운영진 추가 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw err;
    }
  }, []);

  // 운영진 수정
  const updateExecutive = useCallback(async (executiveId: string, updates: Partial<Executive>) => {
    try {
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('executives', executiveId, updatedData);
      if (result.success) {
        setExecutives(prev => prev.map(e => 
          e.id === executiveId ? { ...e, ...updatedData } : e
        ));
        console.log('✅ 운영진 수정 완료:', executiveId);
      } else {
        throw new Error(result.error || '운영진 수정 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { executiveId });
      throw err;
    }
  }, []);

  // 운영진 삭제
  const deleteExecutive = useCallback(async (executiveId: string) => {
    try {
      const result = await deleteDocument('executives', executiveId);
      if (result.success) {
        setExecutives(prev => prev.filter(e => e.id !== executiveId));
        console.log('✅ 운영진 삭제 완료:', executiveId);
      } else {
        throw new Error(result.error || '운영진 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { executiveId });
      throw err;
    }
  }, []);

  // 카테고리별 운영진 조회
  const getExecutivesByCategory = useCallback((category: 'chairman' | 'committee') => {
    return executives.filter(e => e.category === category);
  }, [executives]);

  // 데이터 새로고침
  const refreshExecutives = useCallback(async () => {
    await loadExecutives();
  }, []);

  const value = {
    executives,
    isLoading,
    error,
    addExecutive,
    updateExecutive,
    deleteExecutive,
    getExecutivesByCategory,
    refreshExecutives,
  };

  return (
    <ExecutiveContext.Provider value={value}>
      {children}
    </ExecutiveContext.Provider>
  );
};

export const useExecutives = () => {
  const context = useContext(ExecutiveContext);
  if (context === undefined) {
    throw new Error('useExecutives must be used within an ExecutiveProvider');
  }
  return context;
};

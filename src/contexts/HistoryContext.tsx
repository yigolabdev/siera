import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { ClubHistory } from '../types';
import { useAuth } from './AuthContextEnhanced';

interface HistoryContextType {
  histories: ClubHistory[];
  isLoading: boolean;
  error: string | null;
  addHistory: (history: Omit<ClubHistory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHistory: (id: string, history: Partial<Omit<ClubHistory, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteHistory: (id: string) => Promise<void>;
  refreshHistories: () => Promise<void>;
  _activate: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [histories, setHistories] = useState<ClubHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);

  const auth = useAuth();

  const loadHistories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<ClubHistory>('clubHistory');
      if (result.success && result.data) {
        // sortOrder 기준 오름차순 정렬
        const sorted = result.data.sort((a, b) => a.sortOrder - b.sortOrder);
        setHistories(sorted);
      } else {
        setHistories([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 연혁 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'HistoryContext.loadHistories',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!_activated) return;
    const initializeData = async () => {
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadHistories();
        setHasLoadedOnce(true);
      }
    };

    if (!auth.isLoading) {
      initializeData();
    }
  }, [_activated, auth.firebaseUser, auth.isLoading, loadHistories]);

  const addHistory = useCallback(async (historyData: Omit<ClubHistory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newHistory: Omit<ClubHistory, 'id'> = {
        ...historyData,
        createdAt: now,
        updatedAt: now,
      };

      const docId = `history_${Date.now()}`;
      const result = await setDocument('clubHistory', docId, newHistory);

      if (result.success) {
        const created = { ...newHistory, id: docId };
        setHistories(prev => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        throw new Error(result.error || '연혁 추가 실패');
      }
    } catch (error: unknown) {
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw error;
    }
  }, []);

  const updateHistory = useCallback(async (id: string, historyData: Partial<Omit<ClubHistory, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const now = new Date().toISOString();
      const result = await updateDocument('clubHistory', id, {
        ...historyData,
        updatedAt: now,
      });

      if (result.success) {
        setHistories(prev =>
          prev
            .map(h => h.id === id ? { ...h, ...historyData, updatedAt: now } : h)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        );
      } else {
        throw new Error(result.error || '연혁 수정 실패');
      }
    } catch (error: unknown) {
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw error;
    }
  }, []);

  const deleteHistory = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('clubHistory', id);
      if (result.success) {
        setHistories(prev => prev.filter(h => h.id !== id));
      } else {
        throw new Error(result.error || '연혁 삭제 실패');
      }
    } catch (error: unknown) {
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    histories,
    isLoading,
    error,
    addHistory,
    updateHistory,
    deleteHistory,
    refreshHistories: loadHistories,
    _activate,
  }), [histories, isLoading, error, addHistory, updateHistory, deleteHistory, loadHistories, _activate]);

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistories = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistories must be used within a HistoryProvider');
  }
  return context;
};

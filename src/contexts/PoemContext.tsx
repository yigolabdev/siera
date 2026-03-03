import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Poem } from '../types';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { sanitizeText } from '../utils/sanitize';

interface PoemContextType {
  poems: Poem[];
  currentPoem: Poem | null;
  isLoading: boolean;
  addPoem: (poem: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePoem: (id: string, poem: Partial<Poem>) => Promise<void>;
  deletePoem: (id: string) => Promise<void>;
  getPoemByMonth: (month: string) => Poem | undefined;
  getCurrentMonthPoem: () => Poem | undefined;
  _activate: () => void;
}

const PoemContext = createContext<PoemContextType | undefined>(undefined);

const COLLECTION = 'monthlyPoems';

export const PoemProvider = ({ children }: { children: ReactNode }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);

  // Firestore에서 데이터 로드
  const loadPoems = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getDocuments<Poem>(COLLECTION);
      
      if (result.success && result.data) {
        const sorted = result.data.sort((a, b) => b.month.localeCompare(a.month));
        setPoems(sorted);
      } else {
        setPoems([]);
      }
    } catch (error) {
      console.error('❌ 이달의 시 로드 실패:', error);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { context: 'PoemContext.loadPoems' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!_activated) return;
    loadPoems();
  }, [_activated, loadPoems]);

  // 현재 월의 시 가져오기
  const currentPoem = poems.length > 0
    ? poems.find(p => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return p.month === currentMonth;
      }) || poems[0] // 현재 월이 없으면 가장 최근 시 (이미 정렬됨)
    : null;

  const addPoem = async (poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = `poem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();
      
      const newPoem: Poem = {
        ...poemData,
        title: sanitizeText(poemData.title),
        author: sanitizeText(poemData.author),
        content: sanitizeText(poemData.content),
        id,
        createdAt: now,
        updatedAt: now,
      };

      const result = await setDocument(COLLECTION, id, newPoem);
      
      if (result.success) {
        setPoems(prev => [newPoem, ...prev].sort((a, b) => b.month.localeCompare(a.month)));
      } else {
        throw new Error(result.error || '시 등록 실패');
      }
    } catch (error) {
      console.error('❌ 시 등록 실패:', error);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { context: 'PoemContext.addPoem' });
      throw error;
    }
  };

  const updatePoem = async (id: string, updatedData: Partial<Poem>) => {
    try {
      const updatePayload = {
        ...updatedData,
        ...(updatedData.title !== undefined && { title: sanitizeText(updatedData.title) }),
        ...(updatedData.author !== undefined && { author: sanitizeText(updatedData.author) }),
        ...(updatedData.content !== undefined && { content: sanitizeText(updatedData.content) }),
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument(COLLECTION, id, updatePayload);
      
      if (result.success) {
        setPoems(prev => 
          prev.map(poem => poem.id === id ? { ...poem, ...updatePayload } : poem)
            .sort((a, b) => b.month.localeCompare(a.month))
        );
      } else {
        throw new Error(result.error || '시 수정 실패');
      }
    } catch (error) {
      console.error('❌ 시 수정 실패:', error);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { context: 'PoemContext.updatePoem' });
      throw error;
    }
  };

  const deletePoem = async (id: string) => {
    try {
      const result = await deleteDocument(COLLECTION, id);
      
      if (result.success) {
        setPoems(prev => prev.filter(poem => poem.id !== id));
      } else {
        throw new Error(result.error || '시 삭제 실패');
      }
    } catch (error) {
      console.error('❌ 시 삭제 실패:', error);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { context: 'PoemContext.deletePoem' });
      throw error;
    }
  };

  const getPoemByMonth = (month: string) => {
    return poems.find(p => p.month === month);
  };

  const getCurrentMonthPoem = () => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return getPoemByMonth(currentMonth) || poems[0];
  };

  return (
    <PoemContext.Provider value={{
      poems,
      currentPoem,
      isLoading,
      addPoem,
      updatePoem,
      deletePoem,
      getPoemByMonth,
      getCurrentMonthPoem,
      _activate,
    }}>
      {children}
    </PoemContext.Provider>
  );
};

export const usePoems = () => {
  const context = useContext(PoemContext);
  if (context === undefined) {
    throw new Error('usePoems must be used within a PoemProvider');
  }
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

// Export types for backwards compatibility
export type { Poem } from '../types';

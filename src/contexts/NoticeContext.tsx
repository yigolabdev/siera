import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { Notice } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { useAuth } from './AuthContextEnhanced';
import { sanitizeText } from '../utils/sanitize';

interface NoticeContextType {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  addNotice: (notice: Omit<Notice, 'id' | 'date' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNotice: (id: string, notice: Omit<Notice, 'id' | 'date' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  refreshNotices: () => Promise<void>;
  _activate: () => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);
  
  // 🔥 AuthContext 사용
  const auth = useAuth();

  const loadNotices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<Notice>('notices');
      if (result.success && result.data) {
        // 날짜 기준 내림차순 정렬 (최신순)
        const sortedNotices = result.data.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setNotices(sortedNotices);
      } else {
        setNotices([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 공지사항 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'NoticeContext.loadNotices',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firebase에서 공지사항 로드 - 로그인 상태 변경 시 재로드
  useEffect(() => {
    if (!_activated) return;
    const initializeData = async () => {
      // 로그인 상태이거나 아직 한 번도 로드하지 않았을 때만 로드
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadNotices();
        setHasLoadedOnce(true);
      }
    };
    
    // Auth 로딩이 완료된 후에만 실행
    if (!auth.isLoading) {
      initializeData();
    }
  }, [_activated, auth.firebaseUser, auth.isLoading, loadNotices]);

  const addNotice = useCallback(async (noticeData: Omit<Notice, 'id' | 'date' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date().toISOString();
      const newNotice: Omit<Notice, 'id'> = {
        ...noticeData,
        title: sanitizeText(noticeData.title),
        content: sanitizeText(noticeData.content),
        date: now.split('T')[0],
        createdAt: now,
        updatedAt: now,
      };

      const docId = `notice_${Date.now()}`;
      const result = await setDocument('notices', docId, newNotice);
      
      if (result.success) {
        setNotices(prev => [{ ...newNotice, id: docId }, ...prev]);
      } else {
        throw new Error(result.error || '공지사항 추가 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw error;
    }
  }, []);

  const updateNotice = useCallback(async (id: string, noticeData: Omit<Notice, 'id' | 'date' | 'createdAt' | 'updatedAt'>) => {
    try {
      const updates = {
        ...noticeData,
        title: sanitizeText(noticeData.title),
        content: sanitizeText(noticeData.content),
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('notices', id, updates);
      
      if (result.success) {
        setNotices(prev => prev.map(n =>
          n.id === id ? { ...n, ...updates } : n
        ));
      } else {
        throw new Error(result.error || '공지사항 수정 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { noticeId: id });
      throw error;
    }
  }, []);

  const deleteNotice = useCallback(async (id: string) => {
    try {
      const result = await deleteDocument('notices', id);
      
      if (result.success) {
        setNotices(prev => prev.filter(n => n.id !== id));
      } else {
        throw new Error(result.error || '공지사항 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { noticeId: id });
      throw error;
    }
  }, []);

  const togglePin = useCallback(async (id: string) => {
    try {
      const notice = notices.find(n => n.id === id);
      if (!notice) return;

      const updates = {
        isPinned: !notice.isPinned,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('notices', id, updates);
      
      if (result.success) {
        setNotices(prev => prev.map(n =>
          n.id === id ? { ...n, ...updates } : n
        ));
      } else {
        throw new Error(result.error || '공지사항 고정 토글 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { noticeId: id });
      throw error;
    }
  }, [notices]);

  const refreshNotices = useCallback(async () => {
    await loadNotices();
  }, [loadNotices]);

  const value = useMemo(
    () => ({
      notices,
      isLoading,
      error,
      addNotice,
      updateNotice,
      deleteNotice,
      togglePin,
      refreshNotices,
      _activate,
    }),
    [notices, isLoading, error, addNotice, updateNotice, deleteNotice, togglePin, refreshNotices, _activate]
  );

  return (
    <NoticeContext.Provider value={value}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotices must be used within a NoticeProvider');
  }
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

// Export types for backwards compatibility
export type { Notice } from '../types';

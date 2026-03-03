import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { HikingHistoryItem, HikingComment } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { useAuth } from './AuthContextEnhanced';

interface HikingHistoryContextType {
  history: HikingHistoryItem[];
  comments: Record<string, HikingComment[]>;
  isLoading: boolean;
  error: string | null;
  getHistoryByYear: (year: string) => HikingHistoryItem[];
  getHistoryById: (id: string) => HikingHistoryItem | undefined;
  addComment: (hikeId: string, content: string, authorId: string, authorName: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (hikeId: string, commentId: string) => Promise<void>;
  getCommentsByHikeId: (hikeId: string) => HikingComment[];
  refreshHistory: () => Promise<void>;
  _activate: () => void;
}

const HikingHistoryContext = createContext<HikingHistoryContextType | undefined>(undefined);

export const HikingHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HikingHistoryItem[]>([]);
  const [comments, setComments] = useState<Record<string, HikingComment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  
  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);

  const auth = useAuth();

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<HikingHistoryItem>('hikingHistory');  // ✅ camelCase로 변경
      if (result.success && result.data) {
        // 날짜 기준 내림차순 정렬
        const sortedHistory = result.data.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setHistory(sortedHistory);
      } else {
        setHistory([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 산행 이력 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'HikingHistoryContext.loadHistory',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const result = await getDocuments<HikingComment>('hikingComments');
      if (result.success && result.data) {
        // hikeId별로 그룹화
        const commentsByHike: Record<string, HikingComment[]> = {};
        result.data.forEach(comment => {
          if (!commentsByHike[comment.hikeId]) {
            commentsByHike[comment.hikeId] = [];
          }
          commentsByHike[comment.hikeId].push(comment);
        });

        // 각 그룹을 날짜 기준으로 정렬
        Object.keys(commentsByHike).forEach(hikeId => {
          commentsByHike[hikeId].sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        setComments(commentsByHike);
      } else {
        setComments({});
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 산행 후기 로드 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'HikingHistoryContext.loadComments',
      });
    }
  }, []);

  // Firebase에서 산행 이력 및 후기 로드 - 활성화 후 로그인 상태 변경 시 재로드
  useEffect(() => {
    if (!_activated) return;

    const initializeData = async () => {
      if (auth.firebaseUser || !hasLoadedOnce) {
        await loadHistory();
        await loadComments();
        setHasLoadedOnce(true);
      }
    };
    
    if (!auth.isLoading) {
      initializeData();
    }
  }, [_activated, auth.firebaseUser, auth.isLoading, loadHistory, loadComments]);

  // 연도별 산행 이력 조회
  const getHistoryByYear = useCallback((year: string) => {
    return history.filter(h => h.year === year);
  }, [history]);

  // ID로 산행 이력 조회
  const getHistoryById = useCallback((id: string) => {
    return history.find(h => h.id === id);
  }, [history]);

  // 후기 추가
  const addComment = useCallback(async (
    hikeId: string,
    content: string,
    authorId: string,
    authorName: string
  ) => {
    try {
      const commentId = `comment_${Date.now()}`;
      const now = new Date().toISOString();

      const commentData: HikingComment = {
        id: commentId,
        hikeId,
        authorId,
        authorName,
        content,
        createdAt: now,
        updatedAt: now,
      };

      const result = await setDocument('hikingComments', commentId, commentData);  // ✅ camelCase로 변경
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [hikeId]: [...(prev[hikeId] || []), commentData],
        }));
      } else {
        throw new Error(result.error || '후기 추가 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { hikeId });
      throw error;
    }
  }, []);

  // 후기 수정
  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const now = new Date().toISOString();
      const result = await updateDocument('hikingComments', commentId, {  // ✅ camelCase로 변경
        content,
        updatedAt: now,
      });

      if (result.success) {
        setComments(prev => {
          const newComments = { ...prev };
          Object.keys(newComments).forEach(hikeId => {
            newComments[hikeId] = newComments[hikeId].map(comment =>
              comment.id === commentId
                ? { ...comment, content, updatedAt: now }
                : comment
            );
          });
          return newComments;
        });
      } else {
        throw new Error(result.error || '후기 수정 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { commentId });
      throw error;
    }
  }, []);

  // 후기 삭제
  const deleteComment = useCallback(async (hikeId: string, commentId: string) => {
    try {
      const result = await deleteDocument('hikingComments', commentId);  // ✅ camelCase로 변경
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [hikeId]: (prev[hikeId] || []).filter(c => c.id !== commentId),
        }));
      } else {
        throw new Error(result.error || '후기 삭제 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, { hikeId, commentId });
      throw error;
    }
  }, []);

  // 산행별 후기 조회
  const getCommentsByHikeId = useCallback((hikeId: string) => {
    return comments[hikeId] || [];
  }, [comments]);

  // 산행 이력 새로고침
  const refreshHistory = useCallback(async () => {
    await loadHistory();
    await loadComments();
  }, [loadHistory, loadComments]);

  const value = {
    history,
    comments,
    isLoading,
    error,
    getHistoryByYear,
    getHistoryById,
    addComment,
    updateComment,
    deleteComment,
    getCommentsByHikeId,
    refreshHistory,
    _activate,
  };

  return (
    <HikingHistoryContext.Provider value={value}>
      {children}
    </HikingHistoryContext.Provider>
  );
};

export const useHikingHistory = () => {
  const context = useContext(HikingHistoryContext);
  if (context === undefined) {
    throw new Error('useHikingHistory must be used within a HikingHistoryProvider');
  }
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

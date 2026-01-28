import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { HikingHistoryItem, HikingComment } from '../types';

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
}

const HikingHistoryContext = createContext<HikingHistoryContextType | undefined>(undefined);

export const HikingHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<HikingHistoryItem[]>([]);
  const [comments, setComments] = useState<Record<string, HikingComment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log('✅ Firebase에서 산행 이력 로드:', sortedHistory.length);
      } else {
        console.log('ℹ️ Firebase에서 로드된 산행 이력이 없습니다.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 산행 이력 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
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
        console.log('✅ Firebase에서 산행 후기 로드:', result.data.length);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 산행 후기 로드 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE);
    }
  }, []);

  // Firebase에서 산행 이력 및 후기 로드
  useEffect(() => {
    loadHistory();
    loadComments();
  }, [loadHistory, loadComments]);

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
        console.log('✅ 산행 후기 추가 완료');
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
        console.log('✅ 산행 후기 수정 완료');
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
        console.log('✅ 산행 후기 삭제 완료');
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
  return context;
};

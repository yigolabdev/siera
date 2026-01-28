import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';

export interface HikingHistoryItem {
  id: string;
  year: string;
  month: string;
  date: string;
  mountain: string;
  location: string;
  participants: number;
  distance: string;
  duration: string;
  difficulty: '하' | '중하' | '중' | '중상' | '상';
  weather: string;
  temperature: string;
  imageUrl: string;
  isSpecial: boolean;
  summary?: string;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface HikingComment {
  id: string;
  hikeId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

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

  // Firebase에서 산행 이력 및 후기 로드
  useEffect(() => {
    loadHistory();
    loadComments();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<HikingHistoryItem>('hiking_history');
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
    } catch (err: any) {
      console.error('❌ Firebase 산행 이력 로드 실패:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const result = await getDocuments<HikingComment>('hiking_comments');
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
    } catch (err: any) {
      console.error('❌ Firebase 산행 후기 로드 실패:', err.message);
    }
  };

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
      };

      const result = await setDocument('hiking_comments', commentId, commentData);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [hikeId]: [...(prev[hikeId] || []), commentData],
        }));
        console.log('✅ 산행 후기 추가 완료');
      } else {
        throw new Error(result.error || '후기 추가 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { hikeId });
      throw err;
    }
  }, []);

  // 후기 수정
  const updateComment = useCallback(async (commentId: string, content: string) => {
    try {
      const now = new Date().toISOString();
      const result = await updateDocument('hiking_comments', commentId, {
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
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { commentId });
      throw err;
    }
  }, []);

  // 후기 삭제
  const deleteComment = useCallback(async (hikeId: string, commentId: string) => {
    try {
      const result = await deleteDocument('hiking_comments', commentId);
      if (result.success) {
        setComments(prev => ({
          ...prev,
          [hikeId]: (prev[hikeId] || []).filter(c => c.id !== commentId),
        }));
        console.log('✅ 산행 후기 삭제 완료');
      } else {
        throw new Error(result.error || '후기 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { hikeId, commentId });
      throw err;
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
  }, []);

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

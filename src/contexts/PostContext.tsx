import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getDocuments, setDocument, updateDocument, deleteDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { useAuth } from './AuthContextEnhanced';
import { Post, Comment } from '../types';
import { waitForFirebase } from '../lib/firebase/config';
import { sanitizeText } from '../utils/sanitize';

interface PostContextType {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  addPost: (post: Omit<Post, 'id' | 'views' | 'comments' | 'likes' | 'likedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  togglePostLike: (postId: string, userId: string) => Promise<void>;
  addComment: (comment: Omit<Comment, 'id' | 'likes' | 'likedBy' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  toggleCommentLike: (commentId: string, userId: string) => Promise<void>;
  incrementPostViews: (postId: string) => Promise<void>;
  getPostComments: (postId: string) => Comment[];
  refreshPosts: () => Promise<void>;
  _activate: () => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Lazy loading
  const [_activated, _setActivated] = useState(false);
  const _activate = useCallback(() => _setActivated(true), []);

  // Firebase에서 게시글 데이터 로드 - user가 로드된 후에만 실행
  // Firebase에서 게시글 및 댓글 로드 (useCallback으로 최적화)
  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<Post>('posts');
      if (result.success && result.data) {
        // 최신순 정렬
        const sortedPosts = result.data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } else {
        setPosts([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 게시글 데이터 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'PostContext.loadPosts',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const result = await getDocuments<Comment>('comments');
      if (result.success && result.data) {
        setComments(result.data);
      } else {
        setComments([]);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 댓글 데이터 로드 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'PostContext.loadComments',
      });
    }
  }, []);

  useEffect(() => {
    if (!_activated) return;

    const initializeData = async () => {
      if (firebaseUser || !hasLoadedOnce) {
        await loadPosts();
        await loadComments();
        setHasLoadedOnce(true);
      }
    };
    
    if (!authLoading) {
      initializeData();
    }
  }, [_activated, firebaseUser, authLoading, loadPosts, loadComments]);

  // 게시글 추가
  const addPost = useCallback(async (
    postData: Omit<Post, 'id' | 'views' | 'comments' | 'likes' | 'likedBy' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const postId = `post_${Date.now()}`;
      const now = new Date().toISOString();

      const newPost: Post = {
        ...postData,
        title: sanitizeText(postData.title),
        content: sanitizeText(postData.content),
        id: postId,
        views: 0,
        comments: 0,
        likes: 0,
        likedBy: [],
        createdAt: now,
        updatedAt: now,
      };

      const result = await setDocument('posts', postId, newPost);
      if (result.success) {
        setPosts(prev => [newPost, ...prev]);
      } else {
        throw new Error(result.error || '게시글 추가 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE);
      throw err;
    }
  }, [user]);

  // 게시글 수정
  const updatePost = useCallback(async (postId: string, updates: Partial<Post>) => {
    try {
      const updatedData = {
        ...updates,
        ...(updates.title !== undefined && { title: sanitizeText(updates.title) }),
        ...(updates.content !== undefined && { content: sanitizeText(updates.content) }),
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('posts', postId, updatedData);
      if (result.success) {
        setPosts(prev => prev.map(p => 
          p.id === postId ? { ...p, ...updatedData } : p
        ));
      } else {
        throw new Error(result.error || '게시글 수정 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { postId });
      throw err;
    }
  }, []);

  // 게시글 삭제
  const deletePost = useCallback(async (postId: string) => {
    try {
      // 게시글의 댓글도 함께 삭제
      const postComments = comments.filter(c => c.postId === postId);
      for (const comment of postComments) {
        await deleteDocument('comments', comment.id);
      }

      const result = await deleteDocument('posts', postId);
      if (result.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setComments(prev => prev.filter(c => c.postId !== postId));
      } else {
        throw new Error(result.error || '게시글 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { postId });
      throw err;
    }
  }, [comments, posts]);

  // 게시글 좋아요 토글
  const togglePostLike = useCallback(async (postId: string, userId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const isLiked = post.likedBy.includes(userId);
      const newLikedBy = isLiked
        ? post.likedBy.filter(id => id !== userId)
        : [...post.likedBy, userId];

      await updatePost(postId, {
        likes: newLikedBy.length,
        likedBy: newLikedBy,
      });
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { postId });
    }
  }, [posts, updatePost]);

  // 조회수 증가
  const incrementPostViews = useCallback(async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      await updatePost(postId, {
        views: post.views + 1,
      });
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { postId });
    }
  }, [posts, updatePost]);

  // 댓글 추가
  const addComment = useCallback(async (
    commentData: Omit<Comment, 'id' | 'likes' | 'likedBy' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!user) {
      console.error('❌ 댓글 작성 실패: 로그인이 필요합니다.');
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const commentId = `comment_${Date.now()}`;
      const now = new Date().toISOString();
      
      // undefined 값을 제거하고 새 댓글 객체 생성
      const newComment: Comment = {
        id: commentId,
        postId: commentData.postId,
        author: commentData.author,
        authorId: commentData.authorId,
        content: sanitizeText(commentData.content),
        date: commentData.date,
        likes: 0,
        likedBy: [],
        createdAt: now,
        updatedAt: now,
        // parentId가 있을 때만 포함 (undefined 제거)
        ...(commentData.parentId && { parentId: commentData.parentId }),
      };

      const result = await setDocument('comments', commentId, newComment);
      
      if (!result.success) {
        console.error('❌ Firestore 댓글 저장 실패:', result.error);
        throw new Error(result.error || '댓글 저장에 실패했습니다.');
      }
      
      setComments(prev => [...prev, newComment]);
      
      // 게시글의 댓글 수 업데이트 (실패해도 댓글 자체는 저장됨)
      try {
        const post = posts.find(p => p.id === commentData.postId);
        if (post) {
          await updatePost(commentData.postId, {
            comments: post.comments + 1,
            });
          }
        } catch (countErr) {
          // 댓글 수 업데이트 실패 (댓글은 정상 저장됨)
        }
    } catch (err: any) {
      console.error('❌ 댓글 작성 에러:', err);
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { 
        postId: commentData.postId,
        userId: user.id 
      });
      throw err;
    }
  }, [user, posts, updatePost]);

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const result = await deleteDocument('comments', commentId);
      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        
        // 게시글의 댓글 수 업데이트 (실패해도 댓글 삭제는 완료)
        try {
          const post = posts.find(p => p.id === comment.postId);
          if (post) {
            await updatePost(comment.postId, {
              comments: Math.max(0, post.comments - 1),
            });
          }
        } catch (countErr) {
          // 댓글 수 업데이트 실패 (댓글 삭제는 정상 처리됨)
        }
      } else {
        throw new Error(result.error || '댓글 삭제 실패');
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { commentId });
      throw err;
    }
  }, [comments, posts, updatePost]);

  // 댓글 좋아요 토글
  const toggleCommentLike = useCallback(async (commentId: string, userId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      const isLiked = comment.likedBy.includes(userId);
      const newLikedBy = isLiked
        ? comment.likedBy.filter(id => id !== userId)
        : [...comment.likedBy, userId];

      const updatedData = {
        likes: newLikedBy.length,
        likedBy: newLikedBy,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('comments', commentId, updatedData);
      if (result.success) {
        setComments(prev => prev.map(c =>
          c.id === commentId ? { ...c, ...updatedData } : c
        ));
      }
    } catch (err: any) {
      logError(err, ErrorLevel.ERROR, ErrorCategory.DATABASE, { commentId });
    }
  }, [comments]);

  // 특정 게시글의 댓글 조회
  const getPostComments = useCallback((postId: string) => {
    return comments.filter(c => c.postId === postId);
  }, [comments]);

  // 데이터 새로고침
  const refreshPosts = useCallback(async () => {
    await loadPosts();
    await loadComments();
  }, []);

  const value = {
    posts,
    comments,
    isLoading,
    error,
    addPost,
    updatePost,
    deletePost,
    togglePostLike,
    addComment,
    deleteComment,
    toggleCommentLike,
    incrementPostViews,
    getPostComments,
    refreshPosts,
    _activate,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  useEffect(() => { context._activate(); }, [context._activate]);
  return context;
};

// Export types for backwards compatibility
export type { Post, Comment } from '../types';

import { MessageSquare, ThumbsUp, Eye, ArrowLeft, Send, User, Clock, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { usePosts, Post, Comment as PostComment } from '../contexts/PostContext';
import { useNotices, Notice } from '../contexts/NoticeContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const BoardDetail = () => {
  const { id, type } = useParams<{ id: string; type: 'notice' | 'post' }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAdmin } = useAuth();
  const { posts, togglePostLike, incrementPostViews, addComment, deleteComment, toggleCommentLike, getPostComments, deletePost } = usePosts();
  const { notices } = useNotices();
  
  const [post, setPost] = useState<Post | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyToComment, setReplyToComment] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  // 조회수 증가를 한 번만 실행하기 위한 ref
  const viewCountedRef = useRef(false);
  
  // 이전 페이지(게시판 탭) 정보
  const fromTab = searchParams.get('from') || 'notice';

  // 게시글/공지 데이터 로드 (조회수 증가 제외)
  useEffect(() => {
    if (type === 'post' && id) {
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      }
    } else if (type === 'notice' && id) {
      const foundNotice = notices.find(n => n.id === id);
      if (foundNotice) {
        setNotice(foundNotice);
      }
    }
  }, [id, type, posts, notices]);

  // 조회수 증가는 최초 1회만 실행
  useEffect(() => {
    if (type === 'post' && id && !viewCountedRef.current) {
      incrementPostViews(id);
      viewCountedRef.current = true;
      console.log('✅ [BoardDetail] 조회수 증가:', id);
    }
    
    // 게시글 ID가 변경되면 ref 초기화
    return () => {
      viewCountedRef.current = false;
    };
  }, [id, type]);

  const comments = post ? getPostComments(post.id) : [];
  
  // 목록으로 돌아가기 (이전 탭 정보 포함)
  const handleGoBack = () => {
    navigate(`/home/board?tab=${fromTab}`);
  };

  const handleLikePost = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !post) return;
    await togglePostLike(post.id, user.id);
    // 업데이트된 게시글 다시 가져오기
    const updatedPost = posts.find(p => p.id === post.id);
    if (updatedPost) setPost(updatedPost);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post || !user) return;
    
    try {
      await addComment({
        postId: post.id,
        author: user.name,
        authorId: user.id,
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        parentId: replyToComment || undefined,
      });
      
      setNewComment('');
      setReplyToComment(null);
    } catch (error: any) {
      alert(`댓글 작성에 실패했습니다.\n\n${error.message || '다시 시도해주세요.'}`);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    await toggleCommentLike(commentId, user.id);
  };

  const toggleCommentExpand = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return;
    
    try {
      await deleteComment(commentId);
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;
    
    try {
      await deletePost(post.id);
      alert('게시글이 삭제되었습니다.');
      handleGoBack();
    } catch (error) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'general':
        return <Badge variant="info">자유</Badge>;
      case 'poem':
        return <Badge variant="primary">시</Badge>;
      default:
        return <Badge variant="info">자유</Badge>;
    }
  };

  if (!post && !notice) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-slate-600">게시글을 찾을 수 없습니다.</p>
          <button
            onClick={handleGoBack}
            className="mt-4 btn-primary"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleGoBack}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </button>

        {/* 게시글 카드 */}
        <Card className="mb-6">
          {/* 헤더 */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              {type === 'notice' ? (
                <>
                  <Badge variant="danger">공지</Badge>
                  {notice?.isPinned && <Badge variant="danger">필독</Badge>}
                </>
              ) : post && (
                getCategoryBadge(post.category)
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              {type === 'notice' ? notice?.title : post?.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-slate-900">
                    {type === 'notice' ? '관리자' : post?.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{type === 'notice' ? notice?.date : post?.date}</span>
                </div>
                {type === 'post' && post && (
                  <>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </>
                )}
              </div>

              {type === 'post' && post && (user?.id === post.authorId || isAdmin) && (
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div className="py-8">
            <div className="prose max-w-none">
              <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                {type === 'notice' ? notice?.content : post?.content}
              </p>
            </div>
          </div>

          {/* 좋아요 (게시글만) */}
          {type === 'post' && post && (
            <div className="border-t border-slate-200 pt-6">
              <button
                onClick={handleLikePost}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                  user && post.likedBy.includes(user.id)
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${user && post.likedBy.includes(user.id) ? 'fill-white' : ''}`} />
                <span>좋아요 {post.likes}</span>
              </button>
            </div>
          )}
        </Card>

        {/* 댓글 섹션 (게시글만) */}
        {type === 'post' && post && (
          <Card>
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              댓글 {comments.length}개
            </h3>

            {/* 댓글 작성 */}
            <div className="mb-8">
              {replyToComment && (
                <div className="mb-3 flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-slate-700">
                    <span className="font-bold">
                      {comments.find(c => c.id === replyToComment)?.author}
                    </span>
                    님에게 답글 작성 중
                  </span>
                  <button
                    onClick={() => setReplyToComment(null)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    취소
                  </button>
                </div>
              )}
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder={replyToComment ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  작성
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments
                .filter(c => !c.parentId)
                .map((comment) => {
                  const replies = comments.filter(c => c.parentId === comment.id);
                  const isExpanded = expandedComments.has(comment.id);
                  
                  return (
                    <div key={comment.id} className="space-y-3">
                      <div className="p-5 bg-slate-50 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{comment.author}</span>
                              <span className="text-sm text-slate-500">{comment.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                                user && comment.likedBy.includes(user.id)
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              <ThumbsUp 
                                className={`h-4 w-4 ${user && comment.likedBy.includes(user.id) ? 'fill-primary-600' : ''}`}
                              />
                              <span className="text-sm font-medium">{comment.likes}</span>
                            </button>
                            {user && (user.id === comment.authorId || isAdmin) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="삭제"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-700 mb-3 leading-relaxed">{comment.content}</p>
                        <button
                          onClick={() => setReplyToComment(replyToComment === comment.id ? null : comment.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {replyToComment === comment.id ? '취소' : '답글'}
                        </button>
                      </div>
                      
                      {/* 대댓글 */}
                      {replies.length > 0 && (
                        <div className="ml-8 md:ml-12">
                          <button
                            onClick={() => toggleCommentExpand(comment.id)}
                            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium mb-3"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {isExpanded ? '답글 숨기기' : `답글 ${replies.length}개 보기`}
                          </button>
                          
                          {isExpanded && (
                            <div className="space-y-3">
                              {replies.map((reply) => (
                                <div key={reply.id} className="p-5 bg-blue-50 rounded-xl border-l-4 border-primary-600">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary-700" />
                                      </div>
                                      <div>
                                        <span className="font-bold text-slate-900 block">{reply.author}</span>
                                        <span className="text-xs text-slate-500">{reply.date}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleLikeComment(reply.id)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
                                          user && reply.likedBy.includes(user.id)
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-slate-500 hover:bg-blue-100'
                                        }`}
                                      >
                                        <ThumbsUp 
                                          className={`h-3.5 w-3.5 ${user && reply.likedBy.includes(user.id) ? 'fill-primary-600' : ''}`}
                                        />
                                        <span className="text-sm font-medium">{reply.likes}</span>
                                      </button>
                                      {user && (user.id === reply.authorId || isAdmin) && (
                                        <button
                                          onClick={() => handleDeleteComment(reply.id)}
                                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                          title="삭제"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">{reply.content}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">첫 번째 댓글을 작성해보세요!</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default BoardDetail;

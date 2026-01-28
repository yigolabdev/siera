import { Bell, Pin, MessageSquare, ThumbsUp, Eye, Search, Plus, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { useNotices, Notice } from '../contexts/NoticeContext';
import { usePosts, Comment as PostComment, Post } from '../contexts/PostContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const Board = () => {
  const { user } = useAuth();
  const { notices } = useNotices();
  const { 
    posts, 
    comments, 
    isLoading, 
    addPost, 
    deletePost, 
    togglePostLike, 
    addComment, 
    deleteComment, 
    toggleCommentLike, 
    incrementPostViews,
    getPostComments 
  } = usePosts();
  
  const [activeTab, setActiveTab] = useState<'notice' | 'general' | 'poem'>('notice');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null); // 선택된 공지사항
  
  // 글쓰기 폼
  const [writeForm, setWriteForm] = useState({
    category: 'general' as 'general' | 'poem',
    title: '',
    content: '',
  });
  
  // 댓글 관련
  const [newComment, setNewComment] = useState('');
  const [replyToComment, setReplyToComment] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  
  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);
  
  // 탭에 따라 게시글 필터링
  const filteredPosts = posts.filter(post => {
    if (activeTab === 'notice') return false; // 공지사항 탭에서는 게시글 표시 안 함
    const matchesCategory = activeTab === 'general' || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // 글쓰기
  const handleWritePost = async () => {
    if (!writeForm.title.trim() || !writeForm.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      await addPost({
        category: activeTab === 'notice' ? 'general' : activeTab,
        title: writeForm.title,
        author: user.name,
        authorId: user.id,
        date: new Date().toISOString().split('T')[0],
        content: writeForm.content,
      });
      
      setWriteForm({ category: 'general', title: '', content: '' });
      setShowWriteModal(false);
      alert('게시글이 등록되었습니다!');
    } catch (error) {
      console.error('게시글 작성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };
  
  // 게시글 좋아요
  const handleLikePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    await togglePostLike(postId, user.id);
  };
  
  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost || !user) return;
    
    console.log('📝 댓글 추가 시도:', {
      postId: selectedPost.id,
      content: newComment,
    });
    
    try {
      await addComment({
        postId: selectedPost.id,
        author: user.name,
        authorId: user.id,
        content: newComment,
        date: new Date().toISOString().split('T')[0],
        parentId: replyToComment || undefined,
      });
      
      console.log('✅ 댓글 추가 성공');
      setNewComment('');
      setReplyToComment(null);
    } catch (error: any) {
      console.error('❌ 댓글 작성 실패:', error);
      alert(`댓글 작성에 실패했습니다.\n\n${error.message || '다시 시도해주세요.'}`);
    }
  };
  
  // 댓글 좋아요
  const handleLikeComment = async (commentId: string) => {
    if (!user) return;
    await toggleCommentLike(commentId, user.id);
  };
  
  // 게시글 조회
  const handleViewPost = async (post: Post) => {
    await incrementPostViews(post.id);
    setSelectedPost(post);
  };
  
  // 대댓글 토글
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

  // 현재 게시글의 댓글 가져오기
  const postComments = selectedPost ? getPostComments(selectedPost.id) : [];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <nav className="flex space-x-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('notice')}
                className={`py-4 px-2 border-b-2 font-bold text-base transition-colors whitespace-nowrap ${
                  activeTab === 'notice'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                공지사항
              </button>
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-2 border-b-2 font-bold text-base transition-colors whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                자유게시판
              </button>
              <button
                onClick={() => setActiveTab('poem')}
                className={`py-4 px-2 border-b-2 font-bold text-base transition-colors whitespace-nowrap ${
                  activeTab === 'poem'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                시(詩)
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'notice' ? (
        /* 공지사항 탭 */
        <div>
          {/* 공지사항이 없을 때 */}
          {notices.length === 0 && (
            <Card className="text-center py-12 border-2 border-dashed border-slate-200">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-600">
                아직 등록된 공지사항이 없습니다.
              </p>
            </Card>
          )}
          
          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">중요 공지</h3>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <Card 
                    key={notice.id} 
                    className="border-l-4 border-red-600 hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <Badge variant="danger">필독</Badge>
                        <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                      </div>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {notice.date}
                      </span>
                    </div>
                    {/* 미리보기 텍스트 (최대 2줄) */}
                    <p className="text-slate-700 leading-relaxed line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="mt-3 text-sm text-blue-600 font-medium">
                      자세히 보기 →
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Notices */}
          {regularNotices.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">일반 공지</h3>
              <div className="space-y-4">
                {regularNotices.map((notice) => (
                  <Card 
                    key={notice.id} 
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 flex-1">{notice.title}</h3>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {notice.date}
                      </span>
                    </div>
                    {/* 미리보기 텍스트 (최대 2줄) */}
                    <p className="text-slate-700 leading-relaxed line-clamp-2">
                      {notice.content}
                    </p>
                    <div className="mt-3 text-sm text-blue-600 font-medium">
                      자세히 보기 →
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 커뮤니티 게시판 탭들 */
        <div>
          {/* Search and Write Button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
            </div>
            <button 
              onClick={() => setShowWriteModal(true)}
              className="btn-primary whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>글쓰기</span>
            </button>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-slate-600 mt-4">게시글을 불러오는 중...</p>
            </div>
          )}
          
          {/* Posts List */}
          {!isLoading && filteredPosts.length === 0 && (
            <Card className="text-center py-16 border-2 border-dashed border-slate-200">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl font-bold text-slate-900 mb-2">
                {searchTerm ? '검색 결과가 없습니다' : '첫 번째 게시글을 작성해보세요!'}
              </p>
              <p className="text-slate-600 mb-6">
                {searchTerm 
                  ? '다른 검색어로 시도해보세요.' 
                  : activeTab === 'poem' 
                    ? '감동적인 시를 공유해주세요.'
                    : '회원들과 자유롭게 소통해보세요.'
                }
              </p>
              {!searchTerm && (
                <button 
                  onClick={() => setShowWriteModal(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>글쓰기</span>
                </button>
              )}
            </Card>
          )}
          
          {!isLoading && filteredPosts.length > 0 && (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id} 
                  className="cursor-pointer hover:shadow-lg hover:border-primary-600 transition-all"
                  onClick={() => handleViewPost(post)}
                >
                  <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {getCategoryBadge(post.category)}
                      <h3 className="text-xl font-bold text-slate-900">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-700">{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <button
                        onClick={(e) => handleLikePost(post.id, e)}
                        className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                      >
                        <ThumbsUp 
                          className={`h-4 w-4 ${user && post.likedBy.includes(user.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                        />
                        <span className={user && post.likedBy.includes(user.id) ? 'text-primary-600 font-bold' : ''}>
                          {post.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && filteredPosts.length === 0 && (
            <Card className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-xl text-slate-500 mb-3">
                {searchTerm ? '검색 결과가 없습니다.' : '아직 작성된 게시글이 없습니다.'}
              </p>
              <button
                onClick={() => setShowWriteModal(true)}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                첫 게시글 작성하기
              </button>
            </Card>
          )}
        </div>
      )}
      
      {/* 글쓰기 모달 */}
      {showWriteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowWriteModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold text-slate-900">새 글 작성</h3>
              <button 
                onClick={() => setShowWriteModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={writeForm.title}
                    onChange={(e) => setWriteForm({ ...writeForm, title: e.target.value })}
                    placeholder="제목을 입력하세요"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    내용
                  </label>
                  <textarea
                    value={writeForm.content}
                    onChange={(e) => setWriteForm({ ...writeForm, content: e.target.value })}
                    placeholder="내용을 입력하세요"
                    rows={12}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setShowWriteModal(false)}
                className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleWritePost}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 게시글 상세 모달 */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getCategoryBadge(selectedPost.category)}
                  <span className="text-sm text-slate-500">{selectedPost.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedPost.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="font-medium">{selectedPost.author}</span>
                  <span>조회 {selectedPost.views}</span>
                  <span>댓글 {selectedPost.comments}</span>
                  <button
                    onClick={(e) => handleLikePost(selectedPost.id, e)}
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <ThumbsUp 
                      className={`h-4 w-4 ${user && selectedPost.likedBy.includes(user.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                    />
                    <span className={user && selectedPost.likedBy.includes(user.id) ? 'text-primary-600 font-bold' : ''}>
                      {selectedPost.likes}
                    </span>
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-slate-600" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {/* 게시글 내용 */}
              <div className="mb-8">
                <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
              
              {/* 댓글 섹션 */}
              <div className="border-t pt-6">
                <h4 className="text-xl font-bold text-slate-900 mb-4">
                  댓글 {postComments.length}개
                </h4>
                
                {/* 댓글 목록 */}
                <div className="space-y-4 mb-6">
                  {postComments
                    .filter(c => !c.parentId)
                    .map((comment) => {
                      const replies = postComments.filter(c => c.parentId === comment.id);
                      const isExpanded = expandedComments.has(comment.id);
                      
                      return (
                        <div key={comment.id} className="space-y-3">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900">{comment.author}</span>
                                <span className="text-sm text-gray-500">{comment.date}</span>
                              </div>
                              <button
                                onClick={() => handleLikeComment(comment.id)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                              >
                                <ThumbsUp 
                                  className={`h-4 w-4 ${user && comment.likedBy.includes(user.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                                />
                                <span className={`text-sm ${user && comment.likedBy.includes(user.id) ? 'text-primary-600 font-bold' : ''}`}>
                                  {comment.likes}
                                </span>
                              </button>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.content}</p>
                            <button
                              onClick={() => setReplyToComment(replyToComment === comment.id ? null : comment.id)}
                              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                              {replyToComment === comment.id ? '취소' : '답글'}
                            </button>
                          </div>
                          
                          {/* 대댓글 */}
                          {replies.length > 0 && (
                            <div className="ml-8">
                              <button
                                onClick={() => toggleCommentExpand(comment.id)}
                                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 font-medium mb-2"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                <span>{isExpanded ? '답글 숨기기' : `답글 ${replies.length}개 보기`}</span>
                              </button>
                              
                              {isExpanded && (
                                <div className="space-y-3">
                                  {replies.map((reply) => (
                                    <div key={reply.id} className="p-4 bg-blue-50 rounded-lg border-l-2 border-primary-600">
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-bold text-gray-900">{reply.author}</span>
                                          <span className="text-sm text-gray-500">{reply.date}</span>
                                        </div>
                                        <button
                                          onClick={() => handleLikeComment(reply.id)}
                                          className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                                        >
                                          <ThumbsUp 
                                            className={`h-4 w-4 ${user && reply.likedBy.includes(user.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                                          />
                                          <span className={`text-sm ${user && reply.likedBy.includes(user.id) ? 'text-primary-600 font-bold' : ''}`}>
                                            {reply.likes}
                                          </span>
                                        </button>
                                      </div>
                                      <p className="text-gray-700">{reply.content}</p>
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
                
                {/* 댓글 작성 */}
                <div className="sticky bottom-0 bg-white pt-4 border-t">
                  {replyToComment && (
                    <div className="mb-2 flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="text-sm text-gray-700">
                        <span className="font-bold">
                          {postComments.find(c => c.id === replyToComment)?.author}
                        </span>
                        님에게 답글 작성 중
                      </span>
                      <button
                        onClick={() => setReplyToComment(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder={replyToComment ? '답글을 입력하세요...' : '댓글을 입력하세요...'}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>작성</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 공지사항 상세 모달 */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {selectedNotice.isPinned && <Badge variant="danger">필독</Badge>}
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {selectedNotice.title}
                </h2>
                <div className="text-sm text-slate-500">
                  {selectedNotice.date}
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            
            {/* 모달 본문 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose max-w-none">
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedNotice.content}
                </p>
              </div>
            </div>
            
            {/* 모달 푸터 */}
            <div className="p-6 border-t border-slate-200">
              <button
                onClick={() => setSelectedNotice(null)}
                className="btn-primary w-full"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;

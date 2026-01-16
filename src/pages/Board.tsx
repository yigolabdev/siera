import { Bell, Pin, CreditCard, MessageSquare, ThumbsUp, Eye, Calendar, Search, Plus, X, Send, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotices } from '../contexts/NoticeContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  parentId?: number;
}

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  content: string;
}

const Board = () => {
  const { user, isAdmin } = useAuth();
  const { notices } = useNotices();
  const [activeTab, setActiveTab] = useState<'notice' | 'general' | 'info' | 'question' | 'poem'>('notice');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  
  // 글쓰기 폼
  const [writeForm, setWriteForm] = useState({
    category: 'general',
    title: '',
    content: '',
  });
  
  // 댓글 관련
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, postId: 1, author: '강백운', content: '정말 좋은 날씨였죠! 다음에 또 함께해요~', date: '2026-01-16', likes: 5 },
    { id: 2, postId: 1, author: '윤설악', content: '사진도 멋지게 나왔어요!', date: '2026-01-16', likes: 3 },
    { id: 3, postId: 1, author: '김산행', content: '다음 산행도 기대됩니다', date: '2026-01-17', likes: 2, parentId: 2 },
    { id: 4, postId: 2, author: '이등산', content: '유익한 정보 감사합니다!', date: '2026-01-15', likes: 8 },
    { id: 5, postId: 3, author: '박트레킹', content: '저는 ○○ 브랜드 추천드립니다', date: '2026-01-14', likes: 4 },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyToComment, setReplyToComment] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      category: 'general',
      title: '지난 주 북한산 산행 정말 좋았습니다!',
      author: '김산행',
      date: '2026-01-16',
      views: 156,
      comments: 3,
      likes: 24,
      content: '날씨도 좋고 회원분들과 즐거운 시간 보냈습니다. 정상에서 본 경치가 정말 환상적이었어요. 다들 수고 많으셨고 다음 산행도 기대됩니다!',
    },
    {
      id: 2,
      category: 'info',
      title: '겨울 산행 시 주의사항 클럽합니다',
      author: '이등산',
      date: '2026-01-15',
      views: 234,
      comments: 1,
      likes: 45,
      content: '겨울철 산행 시 꼭 필요한 준비물과 주의사항입니다. 아이젠, 스패츠, 보온병, 여벌 옷 등을 챙기시고 안전한 산행 하세요!',
    },
    {
      id: 3,
      category: 'question',
      title: '등산화 추천 부탁드립니다',
      author: '박트레킹',
      date: '2026-01-14',
      views: 189,
      comments: 1,
      likes: 8,
      content: '새로 등산화를 구매하려고 하는데 추천해주세요. 발이 넓은 편이라 편한 제품으로 부탁드립니다.',
    },
    {
      id: 4,
      category: 'general',
      title: '다음 달 설악산 산행 기대됩니다',
      author: '최하이킹',
      date: '2026-01-13',
      views: 178,
      comments: 0,
      likes: 32,
      content: '설악산 대청봉 정상까지 함께 힘내봅시다! 날씨가 좋았으면 좋겠네요.',
    },
    {
      id: 5,
      category: 'info',
      title: '산행 후 스트레칭 방법',
      author: '정봉우리',
      date: '2026-01-12',
      views: 267,
      comments: 0,
      likes: 38,
      content: '산행 후 근육통 예방을 위한 스트레칭 방법입니다. 하산 직후와 귀가 후 스트레칭을 꼭 해주세요!',
    },
    {
      id: 6,
      category: 'poem',
      title: '산을 오르며',
      author: '강시인',
      date: '2026-01-11',
      views: 145,
      comments: 0,
      likes: 28,
      content: `한 걸음 한 걸음\n돌계단을 오를 때마다\n숨이 차오르고\n\n하지만 멈추지 않네\n정상을 향한 발걸음\n\n구름 사이로 보이는\n아득한 세상\n\n여기 산 위에서\n나는 비로소 나를 만난다`,
    },
  ]);
  
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
  const handleWritePost = () => {
    if (!writeForm.title.trim() || !writeForm.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    const newPost: Post = {
      id: posts.length + 1,
      category: activeTab === 'notice' ? 'general' : activeTab as string,
      title: writeForm.title,
      author: user?.name || '익명',
      date: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0,
      likes: 0,
      content: writeForm.content,
    };
    
    setPosts([newPost, ...posts]);
    setWriteForm({ category: 'general', title: '', content: '' });
    setShowWriteModal(false);
    alert('게시글이 등록되었습니다!');
  };
  
  // 게시글 좋아요
  const handleLikePost = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };
  
  // 댓글 작성
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;
    
    const comment: Comment = {
      id: comments.length + 1,
      postId: selectedPost.id,
      author: user?.name || '익명',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      parentId: replyToComment || undefined,
    };
    
    setComments([...comments, comment]);
    setPosts(prev => prev.map(post =>
      post.id === selectedPost.id
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
    setNewComment('');
    setReplyToComment(null);
  };
  
  // 댓글 좋아요
  const handleLikeComment = (commentId: number) => {
    setLikedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };
  
  // 게시글 조회수 증가
  const handleViewPost = (post: Post) => {
    setPosts(prev => prev.map(p =>
      p.id === post.id ? { ...p, views: p.views + 1 } : p
    ));
    setSelectedPost({ ...post, views: post.views + 1 });
  };
  
  // 대댓글 토글
  const toggleCommentExpand = (commentId: number) => {
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
      case 'info':
        return <Badge variant="success">정보</Badge>;
      case 'question':
        return <Badge variant="warning">질문</Badge>;
      case 'poem':
        return <Badge variant="primary">시</Badge>;
      default:
        return <Badge variant="info">자유</Badge>;
    }
  };
  
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
                onClick={() => setActiveTab('info')}
                className={`py-4 px-2 border-b-2 font-bold text-base transition-colors whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                정보클럽
              </button>
              <button
                onClick={() => setActiveTab('question')}
                className={`py-4 px-2 border-b-2 font-bold text-base transition-colors whitespace-nowrap ${
                  activeTab === 'question'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                질문
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
                  <Card key={notice.id} className="border-l-4 border-red-600 hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap flex-1">
                        <Badge variant="danger">필독</Badge>
                        <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                      </div>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{notice.content}</p>
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
                  <Card key={notice.id} className="hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 flex-1">{notice.title}</h3>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{notice.content}</p>
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
          
          {/* Posts List */}
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
                        className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                      />
                      <span className={likedPosts.has(post.id) ? 'text-primary-600 font-bold' : ''}>
                        {post.likes}
                      </span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
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
                      className={`h-4 w-4 ${likedPosts.has(selectedPost.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                    />
                    <span className={likedPosts.has(selectedPost.id) ? 'text-primary-600 font-bold' : ''}>
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
                  댓글 {comments.filter(c => c.postId === selectedPost.id).length}개
                </h4>
                
                {/* 댓글 목록 */}
                <div className="space-y-4 mb-6">
                  {comments
                    .filter(c => c.postId === selectedPost.id && !c.parentId)
                    .map((comment) => {
                      const replies = comments.filter(c => c.parentId === comment.id);
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
                                  className={`h-4 w-4 ${likedComments.has(comment.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                                />
                                <span className={`text-sm ${likedComments.has(comment.id) ? 'text-primary-600 font-bold' : ''}`}>
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
                                            className={`h-4 w-4 ${likedComments.has(reply.id) ? 'fill-primary-600 text-primary-600' : ''}`}
                                          />
                                          <span className={`text-sm ${likedComments.has(reply.id) ? 'text-primary-600 font-bold' : ''}`}>
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
                          {comments.find(c => c.id === replyToComment)?.author}
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
    </div>
  );
};

export default Board;


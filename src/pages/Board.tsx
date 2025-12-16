import { Bell, Pin, CreditCard, MessageSquare, ThumbsUp, Eye, Calendar, Search, Plus, X, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'notice' | 'community'>('notice');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
  
  // 공지사항 데이터
  const notices = [
    {
      id: 1,
      title: '2026년 1월 정기산행 안내',
      content: '1월 15일(월) 앙봉산 정상 등반을 진행합니다. 오전 7시 15분 종합운동장역 6번 출구 앞 집결 예정이오니 참석하실 회원님들은 미리 신청 부탁드립니다.',
      date: '2026-01-01',
      isPinned: true,
    },
    {
      id: 2,
      title: '2026년 연회비 납부 안내',
      content: '2026년도 연회비 납부를 시작합니다. 계좌번호: 국민은행 123-456-789012 (예금주: 시애라)',
      date: '2026-01-02',
      isPinned: true,
    },
    {
      id: 3,
      title: '신년 하례식 일정 공지',
      content: '2026년 신년 하례식을 1월 5일(금) 저녁 7시에 진행합니다. 장소는 강남 ○○호텔입니다.',
      date: '2026-01-03',
      isPinned: false,
    },
    {
      id: 4,
      title: '겨울철 산행 안전 수칙',
      content: '겨울철 산행 시 미끄럼 방지 아이젠과 보온 의류를 반드시 준비해주시기 바랍니다.',
      date: '2025-12-28',
      isPinned: false,
    },
    {
      id: 5,
      title: '12월 정기산행 결과 보고',
      content: '12월 정기산행이 성황리에 마무리되었습니다. 참석해주신 35명의 회원님들께 감사드립니다.',
      date: '2025-12-20',
      isPinned: false,
    },
  ];
  
  const payments = [
    {
      id: 1,
      title: '1월 정기산행 회비',
      amount: '₩60,000',
      dueDate: '2026-01-10',
      status: 'completed' as const,
      bankInfo: '카카오뱅크 7979-90-65342 오경임',
    },
    {
      id: 2,
      title: '2월 정기산행 회비',
      amount: '₩60,000',
      dueDate: '2026-02-10',
      status: 'pending' as const,
      bankInfo: '카카오뱅크 7979-90-65342 오경임',
    },
  ];
  
  // 커뮤니티 데이터
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '자유게시판' },
    { id: 'info', name: '정보공유' },
    { id: 'question', name: '질문' },
  ];
  
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
      title: '겨울 산행 시 주의사항 공유합니다',
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
  ]);
  
  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);
  
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
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
      category: writeForm.category,
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
    const badges: { [key: string]: { bg: string; text: string; label: string } } = {
      general: { bg: 'bg-blue-100', text: 'text-blue-800', label: '자유' },
      info: { bg: 'bg-green-100', text: 'text-green-800', label: '정보' },
      question: { bg: 'bg-orange-100', text: 'text-orange-800', label: '질문' },
    };
    const badge = badges[category] || badges.general;
    return (
      <span className={`px-2 py-1 rounded text-sm font-bold ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">게시판</h1>
        <p className="text-xl text-slate-600">
          시애라의 공지사항과 커뮤니티를 확인하세요.
        </p>
      </div>
      
      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('notice')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors ${
                activeTab === 'notice'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              공지사항
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`py-4 px-1 border-b-2 font-bold text-lg transition-colors ${
                activeTab === 'community'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              커뮤니티
            </button>
          </nav>
        </div>
      </div>
      
      {/* Content */}
      {activeTab === 'notice' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notices */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pinned Notices */}
            {pinnedNotices.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">중요 공지</h2>
                <div className="space-y-4">
                  {pinnedNotices.map((notice) => (
                    <div key={notice.id} className="card border-l-4 border-red-600">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                            필독
                          </span>
                          <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                        </div>
                        <span className="text-sm text-slate-500 whitespace-nowrap ml-4">
                          {notice.date}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{notice.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Regular Notices */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">일반 공지</h2>
              <div className="space-y-4">
                {regularNotices.map((notice) => (
                  <div key={notice.id} className="card">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{notice.title}</h3>
                      <span className="text-sm text-slate-500 whitespace-nowrap ml-4">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Payment Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="card">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">회비 안내</h2>
                
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="p-4 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{payment.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          payment.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {payment.status === 'completed' ? '납부완료' : '납부대기'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">금액</span>
                          <span className="font-bold text-slate-900 text-lg">{payment.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">납부기한</span>
                          <span className="text-slate-900">{payment.dueDate}</span>
                        </div>
                        {payment.bankInfo && (
                          <div className="pt-2 mt-2 border-t border-slate-200">
                            <p className="text-slate-600 text-xs mb-1">입금 계좌</p>
                            <p className="text-slate-900 font-medium">{payment.bankInfo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-bold text-slate-900 mb-2">입금 시 안내</p>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>입금자명은 본인 성함으로 해주세요</li>
                    <li>입금 후 자동으로 확인됩니다</li>
                    <li>문의: 010-1234-5678</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="제목 또는 작성자로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => setShowWriteModal(true)}
              className="btn-primary whitespace-nowrap"
            >
              글쓰기
            </button>
          </div>
          
          {/* Categories */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-slate-900 text-white'
                    : 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className="card cursor-pointer hover:border-slate-300 transition-colors"
                onClick={() => handleViewPost(post)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 flex-1">
                    {getCategoryBadge(post.category)}
                    <h3 className="text-xl font-bold text-slate-900">
                      {post.title}
                    </h3>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-4 line-clamp-2">{post.content}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-slate-700">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>조회 {post.views}</span>
                    <span>댓글 {post.comments}</span>
                    <button
                      onClick={(e) => handleLikePost(post.id, e)}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
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
              </div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-slate-500">검색 결과가 없습니다.</p>
            </div>
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
                    카테고리
                  </label>
                  <select
                    value={writeForm.category}
                    onChange={(e) => setWriteForm({ ...writeForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  >
                    <option value="general">자유게시판</option>
                    <option value="info">정보공유</option>
                    <option value="question">질문</option>
                  </select>
                </div>
                
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


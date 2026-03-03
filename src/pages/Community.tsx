import { MessageSquare, ThumbsUp, Eye, Calendar, Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import FilterGroup from '../components/ui/FilterGroup';

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'general', name: '자유게시판' },
    { id: 'info', name: '정보클럽' },
    { id: 'question', name: '질문' },
  ];
  
  const posts = [
    {
      id: 1,
      category: 'general',
      title: '지난 주 북한산 산행 정말 좋았습니다!',
      author: '김철수',
      date: '2024-01-16',
      views: 156,
      comments: 12,
      likes: 24,
      content: '날씨도 좋고 회원분들과 즐거운 시간 보냈습니다.',
    },
    {
      id: 2,
      category: 'info',
      title: '겨울 산행 시 주의사항 클럽합니다',
      author: '이영희',
      date: '2024-01-15',
      views: 234,
      comments: 8,
      likes: 45,
      content: '겨울철 산행 시 꼭 필요한 준비물과 주의사항입니다.',
    },
    {
      id: 3,
      category: 'question',
      title: '등산화 추천 부탁드립니다',
      author: '박민수',
      date: '2024-01-14',
      views: 189,
      comments: 15,
      likes: 8,
      content: '새로 등산화를 구매하려고 하는데 추천해주세요.',
    },
    {
      id: 4,
      category: 'general',
      title: '다음 달 설악산 산행 기대됩니다',
      author: '최지영',
      date: '2024-01-13',
      views: 178,
      comments: 10,
      likes: 32,
      content: '설악산 대청봉 정상까지 함께 힘내봅시다!',
    },
    {
      id: 5,
      category: 'info',
      title: '산행 후 스트레칭 방법',
      author: '정현우',
      date: '2024-01-12',
      views: 267,
      comments: 6,
      likes: 38,
      content: '산행 후 근육통 예방을 위한 스트레칭 방법입니다.',
    },
  ];
  
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
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
      <div className="flex justify-end mb-6">
        <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" />
          글쓰기
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<MessageSquare className="w-8 h-8" />} label="전체 게시글" value={posts.length} iconColor="text-blue-600" />
        <StatCard icon={<Eye className="w-8 h-8" />} label="총 조회수" value={posts.reduce((sum, post) => sum + post.views, 0)} iconColor="text-emerald-600" />
        <StatCard icon={<ThumbsUp className="w-8 h-8" />} label="총 좋아요" value={posts.reduce((sum, post) => sum + post.likes, 0)} iconColor="text-purple-600" />
        <StatCard icon={<MessageSquare className="w-8 h-8" />} label="총 댓글" value={posts.reduce((sum, post) => sum + post.comments, 0)} iconColor="text-orange-600" />
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="게시글 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
        </div>
        <FilterGroup
          options={categories.map(c => ({ key: c.id, label: c.name }))}
          selected={selectedCategory}
          onChange={setSelectedCategory}
          size="sm"
        />
      </div>
      
      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            to={`/community/${post.id}`}
            className="card hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  {getCategoryBadge(post.category)}
                  <h3 className="text-xl font-bold text-slate-900">{post.title}</h3>
                </div>
                <p className="text-slate-600 mb-3 text-base">{post.content}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span className="font-medium">{post.author}</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Community;


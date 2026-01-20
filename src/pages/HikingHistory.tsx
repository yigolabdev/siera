import { Calendar, MapPin, Users, Award, Mountain, ChevronRight, Image as ImageIcon, MessageSquare, Plus, Edit2, Trash2, X, CalendarX } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const HikingHistory = () => {
  const { user, isAdmin } = useAuth();
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedHikeId, setSelectedHikeId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  
  // 후기 데이터 (실제로는 각 산행에 포함되어야 함)
  const [comments, setComments] = useState<Record<string, Array<{
    id: string;
    author: string;
    authorId: string;
    content: string;
    date: string;
  }>>>({
    'hike-2024-12': [
      {
        id: 'comment-1',
        author: '김대한',
        authorId: 'user-1',
        content: '겨울 설악산의 설경이 정말 아름다웠습니다. 힘든 등반이었지만 정상에서 본 풍경은 평생 잊지 못할 것 같습니다.',
        date: '2024-12-21',
      },
      {
        id: 'comment-2',
        author: '이민국',
        authorId: 'user-2',
        content: '추운 날씨였지만 모두 함께 해서 즐거웠습니다. 다음에도 또 가고 싶네요!',
        date: '2024-12-22',
      },
    ],
    'hike-2024-10': [
      {
        id: 'comment-3',
        author: '박세계',
        authorId: 'user-3',
        content: '제주도 1박2일 산행 너무 좋았습니다. 한라산 백록담의 웅장함에 감탄했습니다.',
        date: '2024-10-21',
      },
    ],
  });
  
  // 후기 추가
  const handleAddComment = () => {
    if (!selectedHikeId || !newComment.trim()) return;
    
    const newCommentObj = {
      id: `comment-${Date.now()}`,
      author: user?.name || '익명',
      authorId: user?.id || 'guest',
      content: newComment.trim(),
      date: new Date().toISOString().split('T')[0],
    };
    
    setComments(prev => ({
      ...prev,
      [selectedHikeId]: [...(prev[selectedHikeId] || []), newCommentObj],
    }));
    
    setNewComment('');
    setShowCommentModal(false);
    setSelectedHikeId(null);
  };
  
  // 후기 수정
  const handleEditComment = (hikeId: string, commentId: string) => {
    if (!editCommentText.trim()) return;
    
    setComments(prev => ({
      ...prev,
      [hikeId]: prev[hikeId].map(comment =>
        comment.id === commentId
          ? { ...comment, content: editCommentText.trim() }
          : comment
      ),
    }));
    
    setEditingCommentId(null);
    setEditCommentText('');
  };
  
  // 후기 삭제
  const handleDeleteComment = (hikeId: string, commentId: string) => {
    if (!confirm('이 후기를 삭제하시겠습니까?')) return;
    
    setComments(prev => ({
      ...prev,
      [hikeId]: prev[hikeId].filter(comment => comment.id !== commentId),
    }));
  };
  
  // 후기 작성 모달 열기
  const openCommentModal = (hikeId: string) => {
    setSelectedHikeId(hikeId);
    setShowCommentModal(true);
  };
  
  // 이전 산행 이력 데이터
  const hikingHistory = [
    {
      id: 'hike-2025-01',
      year: '2025',
      month: '1월',
      date: '2025-01-15',
      mountain: '북한산 백운대',
      location: '서울 강북구',
      participants: 28,
      distance: '8.5km',
      duration: '5시간 30분',
      difficulty: '중',
      weather: '맑음',
      temperature: '-3°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-12',
      year: '2024',
      month: '12월',
      date: '2024-12-20',
      mountain: '설악산 대청봉',
      location: '강원도 속초시',
      participants: 32,
      distance: '12.3km',
      duration: '7시간 20분',
      difficulty: '상',
      weather: '눈',
      temperature: '-8°C',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
      isSpecial: true,
    },
    {
      id: 'hike-2024-11',
      year: '2024',
      month: '11월',
      date: '2024-11-18',
      mountain: '지리산 천왕봉',
      location: '경남 산청군',
      participants: 30,
      distance: '14.2km',
      duration: '8시간 10분',
      difficulty: '상',
      weather: '흐림',
      temperature: '5°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-10',
      year: '2024',
      month: '10월',
      date: '2024-10-20',
      mountain: '한라산 백록담',
      location: '제주특별자치도',
      participants: 35,
      distance: '19.2km',
      duration: '9시간 30분',
      difficulty: '상',
      weather: '맑음',
      temperature: '12°C',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
      isSpecial: true,
    },
    {
      id: 'hike-2024-09',
      year: '2024',
      month: '9월',
      date: '2024-09-15',
      mountain: '오대산 비로봉',
      location: '강원도 평창군',
      participants: 26,
      distance: '10.5km',
      duration: '6시간 40분',
      difficulty: '중',
      weather: '맑음',
      temperature: '18°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-08',
      year: '2024',
      month: '8월',
      date: '2024-08-17',
      mountain: '덕유산 향적봉',
      location: '전북 무주군',
      participants: 24,
      distance: '11.8km',
      duration: '7시간',
      difficulty: '중상',
      weather: '구름많음',
      temperature: '25°C',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-07',
      year: '2024',
      month: '7월',
      date: '2024-07-20',
      mountain: '속리산 천왕봉',
      location: '충북 보은군',
      participants: 27,
      distance: '9.7km',
      duration: '6시간',
      difficulty: '중',
      weather: '맑음',
      temperature: '28°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-06',
      year: '2024',
      month: '6월',
      date: '2024-06-15',
      mountain: '계룡산 천황봉',
      location: '충남 공주시',
      participants: 29,
      distance: '8.3km',
      duration: '5시간 20분',
      difficulty: '중하',
      weather: '맑음',
      temperature: '24°C',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-05',
      year: '2024',
      month: '5월',
      date: '2024-05-18',
      mountain: '치악산 비로봉',
      location: '강원도 원주시',
      participants: 31,
      distance: '10.2km',
      duration: '6시간 30분',
      difficulty: '중',
      weather: '맑음',
      temperature: '20°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-04',
      year: '2024',
      month: '4월',
      date: '2024-04-20',
      mountain: '월출산 천황봉',
      location: '전남 영암군',
      participants: 28,
      distance: '7.8km',
      duration: '5시간',
      difficulty: '중하',
      weather: '맑음',
      temperature: '16°C',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-03',
      year: '2024',
      month: '3월',
      date: '2024-03-16',
      mountain: '태백산 장군봉',
      location: '강원도 태백시',
      participants: 25,
      distance: '9.5km',
      duration: '6시간',
      difficulty: '중',
      weather: '구름많음',
      temperature: '8°C',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      isSpecial: false,
    },
    {
      id: 'hike-2024-02',
      year: '2024',
      month: '2월',
      date: '2024-02-17',
      mountain: '가야산 상왕봉',
      location: '경남 합천군',
      participants: 26,
      distance: '8.9km',
      duration: '5시간 40분',
      difficulty: '중',
      weather: '맑음',
      temperature: '3°C',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=400&fit=crop',
      isSpecial: false,
    },
  ];
  
  // 연도별 필터링
  const years = ['전체', '2025', '2024', '2023'];
  const filteredHistory = selectedYear === '전체' 
    ? hikingHistory 
    : hikingHistory.filter(hike => hike.year === selectedYear);
  
  // 통계 계산
  const totalHikes = hikingHistory.length;
  const totalParticipants = hikingHistory.reduce((sum, hike) => sum + hike.participants, 0);
  const specialHikes = hikingHistory.filter(hike => hike.isSpecial).length;
  const avgParticipants = Math.round(totalParticipants / totalHikes);
  
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case '하':
        return <Badge variant="success">하</Badge>;
      case '중하':
        return <Badge variant="info">중하</Badge>;
      case '중':
        return <Badge variant="warning">중</Badge>;
      case '중상':
        return <Badge variant="danger">중상</Badge>;
      case '상':
        return <Badge variant="danger">상</Badge>;
      default:
        return <Badge variant="warning">중</Badge>;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section with Background Image */}
      <div className="relative h-[400px] rounded-2xl overflow-hidden mb-12 shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=400&fit=crop"
          alt="Hiking History"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <Mountain className="w-16 h-16 text-white mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">산행 이력</h1>
          <p className="text-xl text-white/90 text-center max-w-2xl">
            시애라와 함께한 모든 산행의 기록을 확인하세요
          </p>
        </div>
      </div>
      
      {/* Stats - 모바일에서 숨김 */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Mountain className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">총 산행 횟수</p>
          <p className="text-3xl font-bold text-slate-900">{totalHikes}회</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">총 참가 인원</p>
          <p className="text-3xl font-bold text-slate-900">{totalParticipants}명</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">특별 산행</p>
          <p className="text-3xl font-bold text-slate-900">{specialHikes}회</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">평균 참가 인원</p>
          <p className="text-3xl font-bold text-slate-900">{avgParticipants}명</p>
        </Card>
      </div>
      
      {/* Year Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedYear === year
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
      
      {/* History List */}
      {filteredHistory.length === 0 ? (
        // 산행 일정이 없을 때 홈 배경과 동일한 디자인
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=500&fit=crop" 
            alt="Mountain" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20">
              <CalendarX className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">다음 산행 일정 준비 중</h2>
            <p className="text-white/90 text-lg mb-8 max-w-md text-center">
              이번 달 정기 산행이 완료되었습니다.<br />
              다음 산행 일정은 곧 공지될 예정입니다.
            </p>
            
            <Link 
              to="/home/gallery"
              className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30"
            >
              사진 갤러리 보기
            </Link>
          </div>
        </div>
      ) : (
      <div className="space-y-6">
        {filteredHistory.map((hike) => (
          <Card key={hike.id} className="overflow-hidden hover:shadow-xl transition-all">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto">
                <img
                  src={hike.image}
                  alt={hike.mountain}
                  className="w-full h-full object-cover"
                />
                {hike.isSpecial && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="danger" className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      특별산행
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Info Section */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">{hike.mountain}</h3>
                        {getDifficultyBadge(hike.difficulty)}
                      </div>
                      <div className="flex items-center gap-4 text-slate-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{hike.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{hike.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 상세 정보 그리드 - 모바일에서 간소화 */}
                  <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">참가 인원</p>
                      <p className="text-lg font-bold text-slate-900">{hike.participants}명</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">거리</p>
                      <p className="text-lg font-bold text-slate-900">{hike.distance}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">소요 시간</p>
                      <p className="text-lg font-bold text-slate-900">{hike.duration}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">날씨</p>
                      <p className="text-lg font-bold text-slate-900">{hike.weather} {hike.temperature}</p>
                    </div>
                  </div>

                  {/* 모바일 전용 간소화된 정보 */}
                  <div className="md:hidden flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">👥 {hike.participants}명</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">📏 {hike.distance}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">⏱️ {hike.duration}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-700">{hike.weather} {hike.temperature}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary">{hike.month} 산행</Badge>
                    <Link
                      to="/home/gallery"
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                      <ImageIcon className="w-4 h-4" />
                      사진 보기
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  {/* 후기 섹션 */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-slate-600" />
                        <h4 className="font-bold text-slate-900">산행 후기</h4>
                        <span className="text-sm text-slate-500">
                          ({comments[hike.id]?.length || 0})
                        </span>
                      </div>
                      <button
                        onClick={() => openCommentModal(hike.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        후기 작성
                      </button>
                    </div>
                    
                    {/* 1. 데이터 존재 여부 확인 */}
                    {comments[hike.id] && comments[hike.id].length > 0 ? (
                      /* 데이터가 있을 때: 후기 목록 표시 */
                      <div className="space-y-3">
                        {comments[hike.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-slate-50 rounded-lg p-4"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900">{comment.author}</span>
                                <span className="text-xs text-slate-500">{comment.date}</span>
                              </div>
                              {(user?.id === comment.authorId || isAdmin) && (
                                <div className="flex items-center gap-1">
                                  {editingCommentId === comment.id ? (
                                    <>
                                      <button
                                        onClick={() => handleEditComment(hike.id, comment.id)}
                                        className="p-1 text-primary-600 hover:bg-primary-100 rounded transition-colors"
                                        title="저장"
                                      >
                                        <MessageSquare className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setEditCommentText('');
                                        }}
                                        className="p-1 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                        title="취소"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(comment.id);
                                          setEditCommentText(comment.content);
                                        }}
                                        className="p-1 text-slate-600 hover:bg-slate-200 rounded transition-colors"
                                        title="수정"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(hike.id, comment.id)}
                                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                        title="삭제"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                            {editingCommentId === comment.id ? (
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                                rows={3}
                              />
                            ) : (
                              <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* 2. 데이터가 없을 때: 입력 안내 메시지 표시 */
                      <div className="bg-slate-50 rounded-lg p-6 text-center border-2 border-dashed border-slate-200">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-600 mb-3">
                          아직 작성된 후기가 없습니다.
                        </p>
                        <button
                          onClick={() => openCommentModal(hike.id)}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          첫 후기 작성하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      )}
      
      {/* 후기 작성 모달 */}
      {showCommentModal && (
        <Modal
          onClose={() => {
            setShowCommentModal(false);
            setSelectedHikeId(null);
            setNewComment('');
          }}
          title="산행 후기 작성"
          maxWidth="max-w-2xl"
        >
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              후기 내용
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="산행에 대한 소감을 자유롭게 작성해주세요..."
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={6}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowCommentModal(false);
                setSelectedHikeId(null);
                setNewComment('');
              }}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${
                newComment.trim()
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              작성 완료
            </button>
          </div>
        </div>
        </Modal>
      )}
    </div>
  );
};

export default HikingHistory;

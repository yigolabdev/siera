import { useState } from 'react';
import { Calendar, Image, Users, TrendingUp, Bell, MapPin, Mountain, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  // 참석 여부 상태 (실제로는 백엔드에서 가져와야 함)
  const [myParticipationStatus, setMyParticipationStatus] = useState<'attending' | 'not-attending' | 'pending' | null>('attending');
  
  const upcomingEvent = {
    id: '1',
    title: '앙봉산 정상 등반',
    mountain: '앙봉산',
    altitude: '737.2m',
    difficulty: '중급' as const,
    date: '2026년 1월 15일',
    location: '경기도 가평군',
    participants: 18,
    maxParticipants: 25,
    daysLeft: 7,
    description: '아름다운 경치와 함께하는 겨울 산행',
  };
  
  // 난이도별 색상
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급':
        return 'bg-green-500';
      case '중급':
        return 'bg-yellow-500';
      case '상급':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const recentNotices = [
    { id: 1, title: '2026년 1월 정기산행 안내', date: '2026-01-01', isPinned: true },
    { id: 2, title: '2026년 연회비 납부 안내', date: '2026-01-02', isPinned: true },
    { id: 3, title: '신년 하례식 일정 공지', date: '2026-01-03', isPinned: false },
  ];
  
  const stats = [
    { label: '총 회원', value: '45명', icon: Users, color: 'bg-blue-500' },
    { label: 'D-' + upcomingEvent.daysLeft, value: '다음 산행', icon: Calendar, color: 'bg-green-500' },
    { label: '평균 참여율', value: '82%', icon: TrendingUp, color: 'bg-purple-500' },
    { label: '사진 갤러리', value: '234장', icon: Image, color: 'bg-orange-500' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-2xl overflow-hidden mb-16 bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=500&fit=crop" 
          alt="Mountain" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 max-w-4xl">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6 border border-white/20">
              D-{upcomingEvent.daysLeft} · {upcomingEvent.difficulty}
            </div>
            <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
              {upcomingEvent.mountain}
            </h1>
            <p className="text-2xl text-white/90 mb-2 font-light">
              {upcomingEvent.altitude} · {upcomingEvent.location}
            </p>
            <p className="text-lg text-white/70 mb-10 font-light">
              {upcomingEvent.date}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link 
                to="/events" 
                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-all inline-block"
              >
                산행 신청하기
              </Link>
              <Link 
                to="/events" 
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all inline-block"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Event */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">이번 달 정기 산행</h2>
            <span className="text-sm text-slate-500">D-{upcomingEvent.daysLeft}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-4">{upcomingEvent.title}</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>일정</span>
                <span className="font-medium text-slate-900">{upcomingEvent.date}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>신청 인원</span>
                <span className="font-medium text-slate-900">
                  {upcomingEvent.participants}/{upcomingEvent.maxParticipants}명
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(upcomingEvent.participants / upcomingEvent.maxParticipants) * 100}%` }}
                />
              </div>
            </div>
            
            {/* 내 참석 여부 */}
            {user && myParticipationStatus && (
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">내 참석 여부</p>
                {myParticipationStatus === 'attending' && (
                  <p className="text-sm font-semibold text-primary-600">참석 신청 완료</p>
                )}
                {myParticipationStatus === 'pending' && (
                  <p className="text-sm font-semibold text-amber-600">승인 대기 중</p>
                )}
                {myParticipationStatus === 'not-attending' && (
                  <p className="text-sm font-semibold text-slate-600">불참</p>
                )}
              </div>
            )}
            
            <Link to="/events" className="btn-primary w-full block text-center">
              자세히 보기
            </Link>
          </div>
        </div>
        
        {/* Recent Notices */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">최근 공지사항</h2>
          <div className="space-y-4">
            {recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to="/board"
                className="block p-4 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-1">{notice.title}</h3>
                    <p className="text-sm text-slate-500">{notice.date}</p>
                  </div>
                  {notice.isPinned && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full mt-2"></span>
                  )}
                </div>
              </Link>
            ))}
            <Link to="/board" className="block text-center text-primary-600 hover:text-primary-700 font-medium pt-4">
              전체 보기 →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/gallery" className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors text-center">
          <h3 className="font-semibold text-slate-900">사진 갤러리</h3>
        </Link>
        <Link to="/info" className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors text-center">
          <h3 className="font-semibold text-slate-900">등산 정보</h3>
        </Link>
        <Link to="/board" className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors text-center">
          <h3 className="font-semibold text-slate-900">게시판</h3>
        </Link>
        <Link to="/members" className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors text-center">
          <h3 className="font-semibold text-slate-900">회원명부</h3>
        </Link>
      </div>
    </div>
  );
};

export default Home;


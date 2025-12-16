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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=400&fit=crop" 
          alt="Mountain" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="px-12 max-w-3xl">
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-3 py-1 bg-primary-600 text-white text-sm font-bold rounded-full flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>D-{upcomingEvent.daysLeft}</span>
              </span>
              <span className={`px-3 py-1 ${getDifficultyColor(upcomingEvent.difficulty)} text-white text-sm font-bold rounded-full flex items-center space-x-1`}>
                <Mountain className="h-4 w-4" />
                <span>{upcomingEvent.difficulty}</span>
              </span>
            </div>
            <h1 className="text-6xl font-bold text-white mb-3">
              {upcomingEvent.mountain}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2 text-2xl text-gray-200">
                <TrendingUp className="h-6 w-6" />
                <span>{upcomingEvent.altitude}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center space-x-2 text-2xl text-gray-200">
                <MapPin className="h-6 w-6" />
                <span>{upcomingEvent.location}</span>
              </div>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              {upcomingEvent.description}
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/events" className="btn-primary inline-block">
                산행 신청하기 ({upcomingEvent.participants}/{upcomingEvent.maxParticipants}명)
              </Link>
              <Link to="/events" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold hover:bg-white/20 transition-colors inline-block">
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Event */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">이번 달 정기 산행</h2>
            </div>
            <span className="px-4 py-2 bg-primary-600 text-white text-lg font-bold rounded-lg">
              D-{upcomingEvent.daysLeft}
            </span>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-primary-50 to-green-50 rounded-lg border-l-4 border-primary-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{upcomingEvent.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="h-5 w-5" />
                  <span className="text-lg">{upcomingEvent.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users className="h-5 w-5" />
                  <span className="text-lg">
                    {upcomingEvent.participants}/{upcomingEvent.maxParticipants}명 신청중
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(upcomingEvent.participants / upcomingEvent.maxParticipants) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* 내 참석 여부 */}
              {user && myParticipationStatus && (
                <div className="mb-4 p-4 rounded-lg border-2 bg-white">
                  <p className="text-sm text-gray-600 mb-2 font-medium">내 참석 여부</p>
                  {myParticipationStatus === 'attending' && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-6 w-6 fill-green-500" />
                      <span className="text-lg font-bold">참석 신청 완료</span>
                    </div>
                  )}
                  {myParticipationStatus === 'pending' && (
                    <div className="flex items-center space-x-2 text-yellow-700">
                      <Clock className="h-6 w-6" />
                      <span className="text-lg font-bold">승인 대기 중</span>
                    </div>
                  )}
                  {myParticipationStatus === 'not-attending' && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <XCircle className="h-6 w-6" />
                      <span className="text-lg font-bold">불참</span>
                    </div>
                  )}
                </div>
              )}
              
              <Link to="/events" className="btn-primary w-full block text-center">
                자세히 보기 및 신청하기
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Notices */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900">최근 공지사항</h2>
          </div>
          <div className="space-y-3">
            {recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to="/board"
                className="block p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {notice.isPinned && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                          필독
                        </span>
                      )}
                      <h3 className="font-medium text-gray-900 text-lg">{notice.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
                  </div>
                </div>
              </Link>
            ))}
            <Link to="/board" className="block text-center text-primary-600 hover:text-primary-700 font-medium text-lg mt-4">
              전체 공지사항 보기 →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/gallery" className="card hover:bg-primary-50 transition-colors text-center">
          <Image className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-lg">사진 갤러리</h3>
        </Link>
        <Link to="/info" className="card hover:bg-primary-50 transition-colors text-center">
          <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-lg">등산 정보</h3>
        </Link>
        <Link to="/board" className="card hover:bg-primary-50 transition-colors text-center">
          <Users className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-lg">게시판</h3>
        </Link>
        <Link to="/members" className="card hover:bg-primary-50 transition-colors text-center">
          <Users className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <h3 className="font-bold text-gray-900 text-lg">회원명부</h3>
        </Link>
      </div>
    </div>
  );
};

export default Home;


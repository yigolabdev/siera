import { useState } from 'react';
import { Calendar, Image, Users, TrendingUp, Bell, MapPin, Mountain, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed } from '../utils/format';

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
    date: '2026-01-15',
    dateDisplay: '2026년 1월 15일',
    location: '경기도 가평군',
    participants: 18,
    maxParticipants: 25,
    daysLeft: 7,
    description: '아름다운 경치와 함께하는 겨울 산행',
  };
  
  // 신청 마감일 정보 계산
  const applicationDeadline = formatDeadline(upcomingEvent.date);
  const daysUntilDeadline = getDaysUntilDeadline(upcomingEvent.date);
  const applicationClosed = isApplicationClosed(upcomingEvent.date);
  
  // 난이도별 배지
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case '초급':
        return <Badge variant="success">{difficulty}</Badge>;
      case '중급':
        return <Badge variant="warning">{difficulty}</Badge>;
      case '상급':
        return <Badge variant="danger">{difficulty}</Badge>;
      default:
        return <Badge variant="primary">{difficulty}</Badge>;
    }
  };
  
  const recentNotices = [
    { id: 1, title: '2026년 1월 정기산행 안내', date: '2026-01-01', isPinned: true },
    { id: 2, title: '2026년 연회비 납부 안내', date: '2026-01-02', isPinned: true },
    { id: 3, title: '신년 하례식 일정 공지', date: '2026-01-03', isPinned: false },
  ];
  
  const stats = [
    { label: '총 회원', value: '45명', icon: Users, color: 'text-blue-600' },
    { label: 'D-' + upcomingEvent.daysLeft, value: '다음 산행', icon: Calendar, color: 'text-green-600' },
    { label: '평균 참여율', value: '82%', icon: TrendingUp, color: 'text-purple-600' },
    { label: '사진 갤러리', value: '234장', icon: Image, color: 'text-orange-600' },
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=500&fit=crop" 
          alt="Mountain" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6 border border-white/20">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">D-{upcomingEvent.daysLeft}</span>
              <span className="text-white/50">·</span>
              {getDifficultyBadge(upcomingEvent.difficulty)}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              {upcomingEvent.mountain}
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-lg md:text-2xl text-white/90 mb-2 font-light">
              <Mountain className="w-5 h-5 md:w-6 md:h-6" />
              <span>{upcomingEvent.altitude}</span>
              <span className="text-white/50">·</span>
              <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              <span>{upcomingEvent.location}</span>
            </div>
            
            <p className="text-base md:text-lg text-white/70 mb-10 font-light">
              {upcomingEvent.dateDisplay}
            </p>
            
            {/* 신청 마감일 안내 */}
            <div className="mb-8 flex justify-center">
              {applicationClosed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-md rounded-lg text-white text-sm font-semibold">
                  <XCircle className="w-4 h-4" />
                  신청 마감
                </div>
              ) : daysUntilDeadline <= 3 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/90 backdrop-blur-md rounded-lg text-white text-sm font-semibold">
                  <Bell className="w-4 h-4 animate-pulse" />
                  신청 마감 {daysUntilDeadline}일 전 · {applicationDeadline}까지
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/80 backdrop-blur-md rounded-lg text-white text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  신청 마감: {applicationDeadline}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/home/events" 
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-center ${
                  applicationClosed 
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed' 
                    : 'bg-white text-slate-900 hover:bg-white/90'
                }`}
                onClick={(e) => {
                  if (applicationClosed) {
                    e.preventDefault();
                    alert('신청 기간이 마감되었습니다.');
                  }
                }}
              >
                {applicationClosed ? '신청 마감' : '산행 신청하기'}
              </Link>
              <Link 
                to="/home/events" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all text-center"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center hover:shadow-lg transition-all">
              <div className="flex items-center justify-center mb-2">
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</p>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Upcoming Event */}
        <Card className="hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-600" />
              이번 달 정기 산행
            </h2>
            <Badge variant="warning">D-{upcomingEvent.daysLeft}</Badge>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{upcomingEvent.title}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">일정</span>
                <span className="font-semibold text-slate-900">{upcomingEvent.date}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">신청 인원</span>
                <span className="font-semibold text-slate-900">
                  {upcomingEvent.participants}/{upcomingEvent.maxParticipants}명
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">신청률</span>
                <span className="text-sm font-semibold text-primary-600">
                  {Math.round((upcomingEvent.participants / upcomingEvent.maxParticipants) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(upcomingEvent.participants / upcomingEvent.maxParticipants) * 100}%` }}
                />
              </div>
            </div>
            
            {/* 내 참석 여부 */}
            {user && myParticipationStatus && (
              <div className="mb-6 p-4 rounded-xl border-2 border-dashed" 
                   style={{
                     backgroundColor: myParticipationStatus === 'attending' ? '#dcfce7' : 
                                     myParticipationStatus === 'pending' ? '#fef3c7' : '#f1f5f9',
                     borderColor: myParticipationStatus === 'attending' ? '#86efac' : 
                                 myParticipationStatus === 'pending' ? '#fde68a' : '#cbd5e1'
                   }}>
                <div className="flex items-center gap-2">
                  {myParticipationStatus === 'attending' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-900">참석 신청 완료</span>
                    </>
                  )}
                  {myParticipationStatus === 'pending' && (
                    <>
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-yellow-900">승인 대기 중</span>
                    </>
                  )}
                  {myParticipationStatus === 'not-attending' && (
                    <>
                      <XCircle className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-700">불참</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <Link to="/home/events" className="btn-primary w-full block text-center">
              자세히 보기
            </Link>
          </div>
        </Card>
        
        {/* Recent Notices */}
        <Card className="hover:shadow-lg transition-all">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-600" />
            최근 공지사항
          </h2>
          
          <div className="space-y-2">
            {recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to="/home/board"
                className="block p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-slate-500">{notice.date}</p>
                  </div>
                  {notice.isPinned && (
                    <Badge variant="danger">필독</Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          <Link 
            to="/home/board" 
            className="block text-center text-primary-600 hover:text-primary-700 font-semibold pt-6 transition-colors"
          >
            전체 보기 →
          </Link>
        </Card>
      </div>
      
      {/* Quick Links */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">바로가기</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/home/gallery">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer">
              <div className="flex items-center justify-center mb-3">
                <Image className="w-8 h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                사진 갤러리
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/info">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer">
              <div className="flex items-center justify-center mb-3">
                <Mountain className="w-8 h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                등산 정보
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/board">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer">
              <div className="flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                게시판
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/members">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                회원명부
              </h3>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

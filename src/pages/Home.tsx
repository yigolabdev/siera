import { useState, useMemo } from 'react';
import { Calendar, Image, Users, TrendingUp, Bell, MapPin, Mountain, CheckCircle, XCircle, Clock, Settings, CalendarX, Cloud, Thermometer, Wind, Droplets, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDevMode } from '../contexts/DevModeContext';
import { useEvents } from '../contexts/EventContext';
import { useMembers } from '../contexts/MemberContext';
import { usePoems } from '../contexts/PoemContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed } from '../utils/format';
import { mockWeatherData, calculateStats } from '../data/mockData';
import { mockNotices } from '../data/mockPosts';

const Home = () => {
  const { user } = useAuth();
  const { isDevMode, applicationStatus, specialApplicationStatus } = useDevMode(); // specialApplicationStatus 추가
  const { events, currentEvent, specialEvent, getParticipantsByEventId } = useEvents(); // specialEvent 추가
  const { members } = useMembers();
  const { currentPoem } = usePoems();
  
  // 참석 여부 상태 (실제로는 백엔드에서 가져와야 함)
  const [myParticipationStatus, setMyParticipationStatus] = useState<'attending' | 'not-attending' | 'pending' | null>('attending');
  
  // 날씨 데이터 사용
  const weatherData = mockWeatherData;

  // 날씨 상태에 따른 아이콘 및 텍스트
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return { icon: Sun, color: 'text-amber-400', bg: 'bg-amber-50', text: '맑음' };
      case 'cloudy':
        return { icon: Cloud, color: 'text-slate-400', bg: 'bg-slate-50', text: '흐림' };
      case 'rainy':
        return { icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50', text: '비' };
      case 'snowy':
        return { icon: CloudSnow, color: 'text-cyan-400', bg: 'bg-cyan-50', text: '눈' };
      default:
        return { icon: Cloud, color: 'text-slate-400', bg: 'bg-slate-50', text: '흐림' };
    }
  };

  const weatherInfo = getWeatherIcon(weatherData.condition);
  const WeatherIcon = weatherInfo.icon;
  
  // EventContext에서 이벤트 가져오기
  const upcomingEvents = useMemo(() => {
    if (!currentEvent) return [];
    
    // 개발 모드 상태 반영
    const mainEvent = {
      ...currentEvent,
      participants: isDevMode && applicationStatus === 'full' 
        ? currentEvent.maxParticipants 
        : currentEvent.currentParticipants,
      daysLeft: Math.ceil((new Date(currentEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      dateDisplay: new Date(currentEvent.date).toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      isSpecial: currentEvent.isSpecial || false,
    };
    
    return [mainEvent];
  }, [currentEvent, isDevMode, applicationStatus]);
  
  // 첫 번째 이벤트를 기본으로 사용
  const mainEvent = upcomingEvents[0] || null;
  
  // 신청 마감일 정보 계산 (개발 모드 상태 반영) - mainEvent 기준
  const applicationDeadline = mainEvent ? formatDeadline(mainEvent.date) : '';
  const daysUntilDeadline = useMemo(() => {
    if (!mainEvent) return 0;
    if (!isDevMode) return getDaysUntilDeadline(mainEvent.date);
    
    // 개발 모드에서는 applicationStatus에 따라 강제 설정
    if (applicationStatus === 'closed') return -1;
    return getDaysUntilDeadline(mainEvent.date);
  }, [isDevMode, applicationStatus, mainEvent]);
  
  const applicationClosed = useMemo(() => {
    if (!mainEvent) return false;
    if (!isDevMode) return isApplicationClosed(mainEvent.date);
    return applicationStatus === 'closed';
  }, [isDevMode, applicationStatus, mainEvent]);
  
  // 난이도별 배지
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case '하':
        return <Badge variant="success">{difficulty}</Badge>;
      case '중하':
        return <Badge variant="info">{difficulty}</Badge>;
      case '중':
        return <Badge variant="warning">{difficulty}</Badge>;
      case '중상':
        return <Badge variant="danger">{difficulty}</Badge>;
      case '상':
        return <Badge variant="danger">{difficulty}</Badge>;
      default:
        return <Badge variant="warning">{difficulty}</Badge>;
    }
  };
  
  // 공지사항 데이터 (상위 3개만)
  const recentNotices = mockNotices.slice(0, 3).map(notice => ({
    id: parseInt(notice.id),
    title: notice.title,
    date: notice.createdAt,
    isPinned: notice.isPinned,
  }));
  
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* 산행 미정 상태일 때 - 특별산행이 있으면 배너만 표시 */}
      {!mainEvent ? (
        <div>
          {/* Hero Section with Background Image */}
          <div className="relative h-[350px] sm:h-[400px] md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=500&fit=crop" 
              alt="Mountain" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-white/20">
                <CalendarX className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 text-center">다음 산행 일정 준비 중</h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md text-center px-4">
              이번 달 정기 산행이 완료되었습니다.<br />
              다음 산행 일정은 곧 공지될 예정입니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md px-4">
              <Link 
                to="/home/gallery"
                className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30 text-center text-sm sm:text-base"
              >
                사진 갤러리 보기
              </Link>
              <Link 
                to="/home/hiking-history"
                className="flex-1 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30 text-center text-sm sm:text-base"
              >
                이전 산행 보기
              </Link>
            </div>
            </div>
          </div>

          {/* 이달의 시 섹션 */}
          {currentPoem && (
            <div className="mb-12">
              <Card className="relative overflow-hidden">
                {/* 배경 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
                
                {/* 장식 요소 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-slate-100/30 to-blue-100/20 rounded-full blur-2xl" />
                
                <div className="relative p-8 md:p-12">
                  {/* 헤더 */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-800">이달의 詩</h3>
                    <p className="text-sm text-slate-500 mt-2">
                      {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                    </p>
                  </div>

                  {/* 시 제목과 작가 */}
                  <div className="mb-8 text-center">
                    <h4 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                      {currentPoem.title}
                    </h4>
                    <p className="text-lg text-slate-600 italic">
                      — {currentPoem.author}
                    </p>
                  </div>

                  {/* 구분선 */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  </div>

                  {/* 시 본문 */}
                  <div className="max-w-3xl mx-auto">
                    <div className={`text-slate-700 leading-relaxed whitespace-pre-line text-center ${
                      currentPoem.content.length <= 200 ? 'text-lg md:text-xl' :
                      currentPoem.content.length <= 400 ? 'text-base md:text-lg' :
                      'text-sm md:text-base'
                    }`}>
                      {currentPoem.content}
                    </div>
                  </div>

                  {/* 하단 장식 */}
                  <div className="flex items-center gap-4 mt-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {/* 특별 산행 배너 - 정기산행 미정 시에도 표시 */}
          {specialEvent && specialApplicationStatus !== 'no-event' && (
            <div className="mb-8 md:mb-12">
              <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow bg-gradient-to-r from-amber-50/50 to-white">
                <div className="p-6 md:p-8">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">특별 산행</h3>
                      <Badge variant="warning">D-{Math.ceil((new Date(specialEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Badge>
                    </div>
                    {/* 신청 상태 배지 */}
                    {specialApplicationStatus === 'closed' && (
                      <Badge variant="danger">신청 마감</Badge>
                    )}
                    {specialApplicationStatus === 'full' && (
                      <Badge variant="danger">정원 마감</Badge>
                    )}
                  </div>
                  
                  {/* 제목 */}
                  <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">{specialEvent.title}</h4>
                  
                  {/* 정보 */}
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mountain className="w-4 h-4" />
                      <span>{specialEvent.altitude}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{specialEvent.location}</span>
                    </div>
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(specialEvent.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  {/* 설명 */}
                  <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                    {specialEvent.description || '특별한 산행에 여러분을 초대합니다. 일반 정기 산행과는 다른 특별한 경험을 만나보세요.'}
                  </p>
                  
                  {/* 버튼 */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {specialApplicationStatus === 'open' ? (
                      <Link
                        to={`/home/events?eventId=${specialEvent.id}`}
                        className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold text-center hover:bg-amber-600 transition-colors"
                      >
                        신청하기
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex-1 px-6 py-3 bg-slate-300 text-slate-500 rounded-lg font-semibold text-center cursor-not-allowed"
                      >
                        {specialApplicationStatus === 'closed' ? '신청 마감' : '정원 마감'}
                      </button>
                    )}
                    <Link
                      to={`/home/events?eventId=${specialEvent.id}`}
                      className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold text-center hover:bg-slate-50 transition-colors"
                    >
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <div>
      {/* Hero Section */}
      <div className="relative h-[450px] sm:h-[500px] md:h-[550px] lg:h-[600px] rounded-xl md:rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=500&fit=crop" 
          alt="Mountain" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        
        {/* 날씨 정보 - 태블릿 이상에서만 표시 */}
        <div className="hidden md:block absolute top-6 right-6 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 min-w-[280px]">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
              <div className={`p-2 ${weatherInfo.bg} rounded-xl flex-shrink-0`}>
                <WeatherIcon className={`w-6 h-6 ${weatherInfo.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 font-medium">산행 당일 날씨</p>
                <p className="text-lg font-bold text-slate-900">{weatherInfo.text}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-50 rounded-lg flex-shrink-0">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">기온</p>
                  <p className="text-sm font-bold text-slate-900">{weatherData.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg flex-shrink-0">
                  <Wind className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">풍속</p>
                  <p className="text-sm font-bold text-slate-900">{weatherData.windSpeed}m/s</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-50 rounded-lg flex-shrink-0">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">습도</p>
                  <p className="text-sm font-bold text-slate-900">{weatherData.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 rounded-lg flex-shrink-0">
                  <CloudRain className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500">강수확률</p>
                  <p className="text-sm font-bold text-slate-900">{weatherData.precipitation}%</p>
                </div>
              </div>
            </div>
            
            {/* 체감온도 및 자외선 */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                체감온도 <span className="font-semibold text-slate-900">{weatherData.feelsLike}°C</span>
              </span>
              <Badge variant={weatherData.uvIndex === 'low' ? 'success' : weatherData.uvIndex === 'moderate' ? 'warning' : 'danger'}>
                자외선 {weatherData.uvIndex === 'low' ? '낮음' : weatherData.uvIndex === 'moderate' ? '보통' : '높음'}
              </Badge>
            </div>
            
            <p className="text-xs text-slate-500 mt-2 text-center">
              ⚠️ 산행 당일 날씨가 변경될 수 있습니다
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 max-w-4xl w-full">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm mb-4 sm:mb-6 border border-white/20 flex-wrap justify-center">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-semibold">D-{mainEvent.daysLeft}</span>
              <span className="text-white/50">·</span>
              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold text-xs sm:text-sm ${
                mainEvent.difficulty === '하' ? 'bg-emerald-500/90 text-white' :
                mainEvent.difficulty === '중하' ? 'bg-blue-500/90 text-white' :
                mainEvent.difficulty === '중' ? 'bg-amber-500/90 text-white' :
                mainEvent.difficulty === '중상' ? 'bg-orange-500/90 text-white' :
                'bg-red-500/90 text-white'
              }`}>
                {mainEvent.difficulty}
              </span>
              {mainEvent.isSpecial && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-500/90 text-white font-semibold text-xs sm:text-sm">
                    특별산행
                  </span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-4 tracking-tight drop-shadow-lg">
              {mainEvent.mountain}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg lg:text-2xl text-white/90 mb-2 font-bold">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Mountain className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>{mainEvent.altitude}</span>
              </div>
              <span className="text-white/50">·</span>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>{mainEvent.location}</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 md:mb-10 font-bold">
              {mainEvent.dateDisplay}
            </p>
            
            {/* 신청 마감일 안내 */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              {applicationClosed ? (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/90 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm font-semibold">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  신청 마감
                </div>
              ) : (isDevMode && applicationStatus === 'full') || mainEvent.participants >= mainEvent.maxParticipants ? (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/90 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm font-semibold">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  정원 마감
                </div>
              ) : daysUntilDeadline <= 3 ? (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500/90 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm font-semibold">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                  <span className="hidden sm:inline">신청 마감 {daysUntilDeadline}일 전 · {applicationDeadline}까지</span>
                  <span className="sm:hidden">마감 D-{daysUntilDeadline}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/80 backdrop-blur-md rounded-lg text-white text-xs sm:text-sm font-medium">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">신청 마감: {applicationDeadline}</span>
                  <span className="sm:hidden">마감일: {applicationDeadline.split(' ')[0]}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link 
                to="/home/events?apply=true" 
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all shadow-lg text-center text-sm sm:text-base ${
                  applicationClosed || (isDevMode && applicationStatus === 'full') || mainEvent.participants >= mainEvent.maxParticipants
                    ? 'bg-slate-400 text-slate-600 cursor-not-allowed' 
                    : 'bg-white text-slate-900 hover:bg-white/90'
                }`}
                onClick={(e) => {
                  if (applicationClosed || (isDevMode && applicationStatus === 'full') || mainEvent.participants >= mainEvent.maxParticipants) {
                    e.preventDefault();
                    alert(applicationClosed ? '신청 기간이 마감되었습니다.' : '정원이 마감되었습니다.');
                  }
                }}
              >
                {applicationClosed ? '신청 마감' : 
                 (isDevMode && applicationStatus === 'full') || mainEvent.participants >= mainEvent.maxParticipants ? '정원 마감' : 
                 '산행 신청하기'}
              </Link>
              <Link 
                to="/home/events" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all text-center text-sm sm:text-base"
              >
                자세히 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 특별 산행 배너 - 심플한 디자인 */}
      {specialEvent && specialApplicationStatus !== 'no-event' && (
        <div className="mb-8 md:mb-12">
          <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow bg-gradient-to-r from-amber-50/50 to-white">
            <div className="p-6 md:p-8">
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">특별 산행</h3>
                  <Badge variant="warning">D-{Math.ceil((new Date(specialEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</Badge>
                </div>
                {/* 신청 상태 배지 */}
                {specialApplicationStatus === 'closed' && (
                  <Badge variant="danger">신청 마감</Badge>
                )}
                {specialApplicationStatus === 'full' && (
                  <Badge variant="danger">정원 마감</Badge>
                )}
                {(specialApplicationStatus as any) === 'no-event' && (
                  <Badge variant="default">산행 미정</Badge>
                )}
              </div>
              
              {/* 제목 */}
              <h4 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">{specialEvent.title}</h4>
              
              {/* 정보 */}
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-4 h-4" />
                  <span>{specialEvent.altitude}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{specialEvent.location}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(specialEvent.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              
              {/* 설명 */}
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                {specialEvent.description || '특별한 산행에 여러분을 초대합니다. 일반 정기 산행과는 다른 특별한 경험을 만나보세요.'}
              </p>
              
              {/* 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                {specialApplicationStatus === 'open' ? (
                  <Link
                    to={`/home/events?eventId=${specialEvent.id}`}
                    className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-lg font-semibold text-center hover:bg-amber-600 transition-colors"
                  >
                    신청하기
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex-1 px-6 py-3 bg-slate-300 text-slate-500 rounded-lg font-semibold text-center cursor-not-allowed"
                  >
                    {specialApplicationStatus === 'closed' ? '신청 마감' :
                     specialApplicationStatus === 'full' ? '정원 마감' : '산행 미정'}
                  </button>
                )}
                <Link
                  to={`/home/events?eventId=${specialEvent.id}`}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold text-center hover:bg-slate-50 transition-colors"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 md:mb-12">
        {/* Upcoming Events - 산행 목록 */}
        {upcomingEvents.map((event, index) => (
          <Card key={event.id} className="hover:shadow-lg transition-all p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                {event.isSpecial ? '특별 산행' : '이번 달 정기 산행'}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="warning">D-{event.daysLeft}</Badge>
                {event.isSpecial && (
                  <Badge variant="danger">특별</Badge>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4">{event.title}</h3>
              
              {/* 내 참석 여부 - 첫 번째 이벤트만 표시 */}
              {index === 0 && user && myParticipationStatus && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border-2 border-dashed" 
                     style={{
                       backgroundColor: myParticipationStatus === 'attending' ? '#dcfce7' : 
                                       myParticipationStatus === 'pending' ? '#fef3c7' : '#f1f5f9',
                       borderColor: myParticipationStatus === 'attending' ? '#86efac' : 
                                   myParticipationStatus === 'pending' ? '#fde68a' : '#cbd5e1'
                     }}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {myParticipationStatus === 'attending' && (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          <span className="text-sm sm:text-base font-bold text-green-900">참석 신청 완료</span>
                        </>
                      )}
                      {myParticipationStatus === 'pending' && (
                        <>
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                          <span className="text-sm sm:text-base font-bold text-yellow-900">승인 대기 중</span>
                        </>
                      )}
                      {myParticipationStatus === 'not-attending' && (
                        <>
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                          <span className="text-sm sm:text-base font-bold text-slate-700">불참</span>
                        </>
                      )}
                    </div>
                    
                    {/* 참석 취소 버튼 */}
                    {(myParticipationStatus === 'attending' || myParticipationStatus === 'pending') && (
                      <button
                        onClick={() => {
                          if (confirm('참석 신청을 취소하시겠습니까?')) {
                            setMyParticipationStatus('not-attending');
                            alert('참석 신청이 취소되었습니다.');
                          }
                        }}
                        className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        취소
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              <Link 
                to="/home/events"
                className={`w-full text-center block py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-bold transition-all ${
                  event.isSpecial 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'btn-primary'
                }`}
              >
                자세히 보기
              </Link>
            </div>
          </Card>
        ))}
        
        {/* Recent Notices */}
        <Card className="hover:shadow-lg transition-all p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
            최근 공지사항
          </h2>
          
          <div className="space-y-2">
            {recentNotices.map((notice) => (
              <Link
                key={notice.id}
                to="/home/board"
                className="block p-3 sm:p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1 line-clamp-1">
                      {notice.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500">{notice.date}</p>
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
            className="block text-center text-primary-600 hover:text-primary-700 text-sm sm:text-base font-semibold pt-4 sm:pt-6 transition-colors"
          >
            전체 보기 →
          </Link>
        </Card>
      </div>
        </div>
      )}
      
      {/* Quick Links */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">바로가기</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Link to="/home/gallery">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Image className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                사진 갤러리
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/hiking-history">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Mountain className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                이전 산행
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/board">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                게시판
              </h3>
            </Card>
          </Link>
          
          <Link to="/home/members">
            <Card className="text-center hover:shadow-lg hover:border-primary-600 transition-all group cursor-pointer p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-600 group-hover:text-primary-600 transition-colors" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
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

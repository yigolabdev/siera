import { Calendar, MapPin, Users, TrendingUp, CheckCircle, XCircle, Clock, Navigation, UserCheck, Phone, Mail, CreditCard, Copy, X, Shield, Mountain, Settings, CalendarX, Bell, AlertTriangle, Check, Backpack, Cloud, Thermometer, Wind, Droplets, CloudRain, CloudSnow, Sun } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDevMode } from '../contexts/DevModeContext';
import { useEvents } from '../contexts/EventContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed, formatDate } from '../utils/format';
import { mockWeatherData } from '../data/mockData';

const Events = () => {
  const { user } = useAuth();
  const { isDevMode, applicationStatus } = useDevMode();
  const { currentEvent, getParticipantsByEventId } = useEvents();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [searchParams] = useSearchParams();
  
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
  
  // EventContext에서 현재 이벤트 사용 (개발 모드 상태 반영)
  const event = useMemo(() => {
    if (!currentEvent) return null;
    
    return {
      ...currentEvent,
      currentParticipants: isDevMode && applicationStatus === 'full' 
        ? currentEvent.maxParticipants 
        : currentEvent.currentParticipants,
      isRegistered: false, // TODO: 실제 사용자 신청 여부 확인
    };
  }, [currentEvent, isDevMode, applicationStatus]);
  
  // 참석자 목록 (실제 신청자)
  const participants = event ? getParticipantsByEventId(event.id) : [];
  
  // 조 편성
  const teams = [
    {
      id: '1',
      name: '1조',
      leaderId: '1',
      leaderName: '김산행',
      leaderOccupation: '○○그룹 회장',
      members: [
        { id: 'm1', name: '홍정상', occupation: '대표변호사', company: '※※법률사무소' },
        { id: 'm2', name: '강백운', occupation: '대표', company: '◎◎IT' },
        { id: 'm3', name: '윤설악', occupation: '사장', company: '▽▽건축' },
        { id: 'm4', name: '문북한', occupation: '전무', company: '◈◈컨설팅' },
        { id: 'm5', name: '신계룡', occupation: '대표', company: '▲▲물류' },
      ],
    },
    {
      id: '2',
      name: '2조',
      leaderId: '2',
      leaderName: '이등산',
      leaderOccupation: '△△건설 대표이사',
      members: [
        { id: 'm6', name: '임지리', occupation: '부사장', company: '★★무역' },
        { id: 'm7', name: '조한라', occupation: '이사', company: '◆◆투자' },
        { id: 'm8', name: '장태백', occupation: '사장', company: '▼▼제조' },
        { id: 'm9', name: '권덕유', occupation: '이사', company: '◐◐통신' },
        { id: 'm10', name: '서오대', occupation: '교수', company: '◑◑교육' },
      ],
    },
    {
      id: '3',
      name: '3조',
      leaderId: '3',
      leaderName: '박트레킹',
      leaderOccupation: '□□금융 부사장',
      members: [
        { id: 'm11', name: '오속리', occupation: '대표', company: '◒◒인프라' },
        { id: 'm12', name: '배치악', occupation: '본부장', company: '◓◓미디어' },
        { id: 'm13', name: '류월출', occupation: '연구소장', company: '◔◔바이오' },
        { id: 'm14', name: '전청계', occupation: '전무', company: '◕◕에너지' },
        { id: 'm15', name: '황무등', occupation: '대표', company: '◖◖자산운용' },
      ],
    },
    {
      id: '4',
      name: '4조',
      leaderId: '4',
      leaderName: '최하이킹',
      leaderOccupation: '◇◇제약 전무이사',
      members: [
        { id: 'm16', name: '안관악', occupation: '부장', company: '◗◗마케팅' },
        { id: 'm17', name: '남도봉', occupation: '이사', company: '◘◘유통' },
        { id: 'm18', name: '송악산', occupation: '대표', company: '◙◙테크' },
        { id: 'm19', name: '진용문', occupation: '상무', company: '◚◚디자인' },
      ],
    },
    {
      id: '5',
      name: '5조',
      leaderId: '5',
      leaderName: '정봉우리',
      leaderOccupation: '☆☆병원 원장',
      members: [
        { id: 'm20', name: '차금강', occupation: '센터장', company: '◛◛연구소' },
        { id: 'm21', name: '표영봉', occupation: '실장', company: '◜◜개발' },
        { id: 'm22', name: '마니산', occupation: '팀장', company: '◝◝기획' },
        { id: 'm23', name: '노고단', occupation: '부장', company: '◞◞전략' },
      ],
    },
  ];
  
  // 지난 산행 기록
  const pastEvents = [
    {
      id: 'past-1',
      title: '설악산 대청봉 등반',
      date: '2025-12-15',
      participants: 22,
    },
    {
      id: 'past-2',
      title: '지리산 노고단 산행',
      date: '2025-11-20',
      participants: 25,
    },
    {
      id: 'past-3',
      title: '설악산 대청봉 등반',
      date: '2025-10-18',
      participants: 20,
    },
  ];
  
  const getDifficultyBadge = (difficulty: '하' | '중하' | '중' | '중상' | '상') => {
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
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  // 신청 마감일 정보 계산 (개발 모드 상태 반영)
  const applicationDeadline = event ? formatDeadline(event.date) : '';
  const daysUntilDeadline = useMemo(() => {
    if (!event) return 0;
    if (!isDevMode) return getDaysUntilDeadline(event.date);
    
    // 개발 모드에서는 applicationStatus에 따라 강제 설정
    if (applicationStatus === 'closed') return -1;
    return getDaysUntilDeadline(event.date);
  }, [isDevMode, applicationStatus, event]);
  
  const applicationClosed = useMemo(() => {
    if (!event) return false;
    if (!isDevMode) return isApplicationClosed(event.date);
    return applicationStatus === 'closed';
  }, [isDevMode, applicationStatus, event]);
  
  // URL 파라미터로 신청 모달 자동 열기
  useEffect(() => {
    const apply = searchParams.get('apply');
    if (apply === 'true' && !applicationClosed && event && event.currentParticipants < event.maxParticipants) {
      setShowCourseModal(true);
    }
  }, [searchParams, applicationClosed, event]);
  
  const handleRegister = () => {
    if (applicationClosed) {
      alert('신청 기간이 마감되었습니다.');
      return;
    }
    if (isDevMode && applicationStatus === 'full') {
      alert('정원이 마감되었습니다.');
      return;
    }
    // 코스 선택 모달 표시
    setShowCourseModal(true);
  };
  
  const handleCourseSelect = (course: string) => {
    setSelectedCourse(course);
    setShowCourseModal(false);
    setIsRegistered(true);
    setShowPaymentModal(true);
  };
  
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };
  
  const handleCancel = () => {
    // TODO: 실제 취소 로직
    setIsRegistered(false);
    alert('신청이 취소되었습니다.');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">이번 달 정기 산행</h1>
        <p className="text-xl text-slate-600">
          매월 한 번 진행되는 정기 산행에 참여하세요.
        </p>
      </div>
      
      {/* 산행 미정 상태 */}
      {(isDevMode && applicationStatus === 'no-event') || !event ? (
        <div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-xl">
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
              
              <div className="flex gap-4">
                <Link 
                  to="/home/gallery"
                  className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30"
                >
                  사진 갤러리 보기
                </Link>
                <Link 
                  to="/home/hiking-history"
                  className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-xl font-bold hover:bg-white/30 transition-colors border border-white/30"
                >
                  이전 산행 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
      
      {/* Current Event */}
      <Card className="mb-12 p-0 overflow-hidden hover:shadow-xl transition-all">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          {/* 날씨 정보 - 태블릿 이상에서만 표시 */}
          <div className="hidden md:block absolute top-6 right-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 min-w-[280px]">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                <div className={`p-2 ${weatherInfo.bg} rounded-xl`}>
                  <WeatherIcon className={`w-6 h-6 ${weatherInfo.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600 font-medium">산행 당일 날씨</p>
                  <p className="text-lg font-bold text-slate-900">{weatherInfo.text}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">기온</p>
                    <p className="text-sm font-bold text-slate-900">{weatherData.temperature}°C</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Wind className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">풍속</p>
                    <p className="text-sm font-bold text-slate-900">{weatherData.windSpeed}m/s</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-cyan-50 rounded-lg">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">습도</p>
                    <p className="text-sm font-bold text-slate-900">{weatherData.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 rounded-lg">
                    <CloudRain className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
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
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                event.difficulty === '하' ? 'bg-emerald-500/90 text-white border border-emerald-300' :
                event.difficulty === '중하' ? 'bg-blue-500/90 text-white border border-blue-300' :
                event.difficulty === '중' ? 'bg-amber-500/90 text-white border border-amber-300' :
                event.difficulty === '중상' ? 'bg-orange-500/90 text-white border border-orange-300' :
                'bg-red-500/90 text-white border border-red-300'
              }`}>
                {event.difficulty}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h2>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                <span>{event.altitude}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Details */}
        <div className="p-6 md:p-8">
          {/* 신청 마감일 안내 */}
          {applicationClosed ? (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-red-900 mb-1">신청 마감</h4>
                  <p className="text-sm text-red-700">
                    신청 기간이 종료되었습니다. ({applicationDeadline} 마감)
                  </p>
                </div>
              </div>
            </div>
          ) : daysUntilDeadline <= 3 ? (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-amber-900 mb-1">마감 임박!</h4>
                  <p className="text-sm text-amber-700">
                    신청 마감까지 <strong className="text-amber-900">{daysUntilDeadline}일</strong> 남았습니다. 
                    <span className="ml-2 text-amber-600">({applicationDeadline} 까지)</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-blue-900 mb-1">신청 기간</h4>
                  <p className="text-sm text-blue-700">
                    <strong className="text-blue-900">{applicationDeadline}</strong>까지 신청 가능합니다.
                    <span className="ml-2 text-blue-600">(출발일 10일 전 마감)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Mountain className="w-6 h-6 text-primary-600" />
                산행 정보
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">일정</span>
                  <span className="font-semibold text-slate-900">{formatDate(event.date)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">장소</span>
                  <span className="font-semibold text-slate-900">{event.location}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">신청 인원</span>
                  <span className="font-semibold text-slate-900">{event.currentParticipants}/{event.maxParticipants}명</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600">신청률</span>
                    <span className="font-semibold text-primary-600">
                      {Math.round((event.currentParticipants / event.maxParticipants) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 bg-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium">신청 마감</span>
                  <span className="font-bold text-blue-900">{applicationDeadline}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-medium">참가비</span>
                  <span className="font-bold text-emerald-900 text-lg">{event.cost}</span>
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed">
                {event.description}
              </p>
            </div>
            
            {/* Schedule */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary-600" />
                당일 동선
              </h3>
              <div className="relative">
                {/* 타임라인 선 */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-4">
                  {event.schedule.map((item, index) => {
                    const isFirst = index === 0;
                    const isLast = index === event.schedule.length - 1;
                    
                    return (
                      <div key={index} className="relative pl-14">
                        {/* 타임라인 도트 */}
                        <div className={`absolute left-[18px] top-5 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                          item.type === 'departure' ? 'bg-success-500' :
                          item.type === 'arrival' ? 'bg-info-500' :
                          item.type === 'return' ? 'bg-warning-500' :
                          'bg-primary-500'
                        }`}></div>
                        
                        <div className="bg-white rounded-lg border border-slate-200 hover:border-primary-300 transition-all p-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ${
                              item.type === 'departure' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              item.type === 'arrival' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              item.type === 'return' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                              'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}>
                              {item.type === 'departure' && '출발'}
                              {item.type === 'stop' && '정차'}
                              {item.type === 'return' && '복귀'}
                              {item.type === 'arrival' && '도착'}
                            </span>
                            <span className="text-base font-bold text-primary-700 flex-shrink-0 min-w-[60px]">{item.time}</span>
                            <p className="text-slate-800 font-medium flex-1">{item.location}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Courses Section */}
          {event.courses && event.courses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">산행 코스</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {event.courses.map((course) => (
                  <Card key={course.id} className="bg-slate-50 border-2 hover:border-primary-600 transition-all">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-300">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                        {course.name}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{course.name} 코스</p>
                        <p className="text-sm text-slate-600">{course.distance}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-bold text-slate-700 mb-2">코스 안내</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-slate-700 mb-3">상세 일정</p>
                      <div className="space-y-2">
                        {course.schedule.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <span className="font-bold text-primary-600 min-w-[60px]">{item.time}</span>
                            <span className="text-slate-700">{item.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-slate-900">참가자 현황</span>
              <span className="font-bold text-primary-600 text-lg">
                {event.currentParticipants}/{event.maxParticipants}명
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {Math.round((event.currentParticipants / event.maxParticipants) * 100)}% 신청 완료
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            {isRegistered ? (
              <>
                <button className="flex-1 px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  참석 신청 완료
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-8 py-4 bg-slate-200 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-300 transition-colors"
                  disabled={applicationClosed}
                >
                  신청 취소
                </button>
              </>
            ) : (
              <button 
                onClick={handleRegister}
                className={`flex-1 text-lg py-4 rounded-xl font-bold transition-all ${
                  applicationClosed || (isDevMode && applicationStatus === 'full') || event.currentParticipants >= event.maxParticipants
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
                disabled={applicationClosed || (isDevMode && applicationStatus === 'full') || event.currentParticipants >= event.maxParticipants}
              >
                {applicationClosed 
                  ? '신청 마감' 
                  : (isDevMode && applicationStatus === 'full') || event.currentParticipants >= event.maxParticipants 
                    ? '정원 마감' 
                    : '참석 신청하기'}
              </button>
            )}
            
            {/* View Participants Button */}
            <button 
              onClick={() => setShowParticipantsModal(true)}
              className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 hover:border-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-6 h-6" />
              참석자 명단 ({participants.length}명)
            </button>
          </div>
        </div>
      </Card>
      
      {/* Course Selection Modal */}
      {showCourseModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCourseModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">코스 선택</h3>
                <button 
                  onClick={() => setShowCourseModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-600 mt-2">참여하실 코스를 선택해주세요</p>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {event.courses.map((course, index) => (
                <button
                  key={index}
                  onClick={() => handleCourseSelect(course.name)}
                  className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-primary-600 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {course.name}
                    </h4>
                    <Badge variant={index === 0 ? "success" : "info"}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-4">{course.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">거리</p>
                      <p className="text-sm font-bold text-slate-900">{course.distance}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 mb-1">소요시간</p>
                      <p className="text-sm font-bold text-slate-900">{course.duration}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Participants Modal */}
      {showParticipantsModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowParticipantsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">참석자 명단</h3>
                <button 
                  onClick={() => setShowParticipantsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-slate-600" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="success">
                  확정: {participants.filter(p => p.status === 'confirmed').length}명
                </Badge>
                <Badge variant="warning">
                  대기: {participants.filter(p => p.status === 'pending').length}명
                </Badge>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id} 
                    className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm font-bold text-slate-500 min-w-[32px]">{index + 1}</span>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{participant.name}</p>
                      <p className="text-sm text-slate-600">{participant.occupation}</p>
                    </div>
                    <Badge variant={participant.status === 'confirmed' ? 'success' : 'warning'}>
                      {participant.status === 'confirmed' ? '확정' : '대기'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t">
              <button 
                onClick={() => setShowParticipantsModal(false)}
                className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Teams Section - 조편성이 등록되어 있고, 신청 마감 또는 정원 마감 상태일 때만 표시 */}
      {teams.length > 0 && (applicationClosed || (isDevMode && applicationStatus === 'full')) && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary-600" />
            이달의 참석자 조 편성
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg hover:border-primary-600 transition-all">
                {/* Team Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {team.name}
                  </div>
                  <div className="flex-1">
                    <Badge variant="info">조장</Badge>
                    <p className="font-bold text-slate-900 mt-1">{team.leaderName}</p>
                    <p className="text-sm text-slate-600">{team.leaderOccupation}</p>
                  </div>
                </div>
                
                {/* Team Members */}
                <div>
                  <p className="text-sm font-semibold text-slate-600 mb-3">
                    조원 {team.members.length}명
                  </p>
                  <div className="space-y-2">
                    {team.members.map((member, idx) => (
                      <div 
                        key={member.id} 
                        className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-xs text-slate-500 mt-0.5 min-w-[16px]">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm">{member.name}</p>
                          <p className="text-xs text-slate-600">{member.occupation} · {member.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 안전 수칙 & 장비 체크리스트 */}
      <div className="space-y-8 mt-12">
        {/* 안전 수칙 */}
        <Card className="hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">안전 수칙</h2>
              <p className="text-slate-600 text-sm">안전한 산행을 위해 꼭 지켜주세요</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-red-600">📋</span>
                등산 전 준비사항
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">일기예보를 꼭 확인하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">등산화, 등산복, 스틱 준비</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">충분한 물과 간식 챙기기</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">휴대폰 배터리 충전</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-green-600">⛰️</span>
                등산 중 주의사항
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">자신의 체력에 맞는 페이스 유지</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">일행과 떨어지지 않기</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">표지판과 리본 확인하며 이동</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">쓰레기는 반드시 되가져가기</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-blue-600">🌦️</span>
                기상 변화 대응
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">보온 의류 여벌 준비</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">비옷이나 우산 챙기기</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">급격한 기상 변화 시 하산 고려</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">체온 유지에 신경 쓰기</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* 등산 장비 체크리스트 */}
        <Card className="hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Backpack className="w-7 h-7 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">등산 장비 체크리스트</h2>
              <p className="text-slate-600 text-sm">산행 전 꼭 챙겨야 할 필수 장비</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">👟</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">등산화</p>
              <p className="text-slate-600 text-xs text-center">발목 보호 & 미끄럼 방지</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">👕</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">등산복</p>
              <p className="text-slate-600 text-xs text-center">땀 배출 & 보온성</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">🎒</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">배낭</p>
              <p className="text-slate-600 text-xs text-center">20-30L 용량</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">🥾</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">등산 스틱</p>
              <p className="text-slate-600 text-xs text-center">무릎 보호 & 균형 유지</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">💧</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">물</p>
              <p className="text-slate-600 text-xs text-center">1.5L 이상 식수</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">🍫</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">간식</p>
              <p className="text-slate-600 text-xs text-center">초콜릿, 견과류 등</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">🏥</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">구급약</p>
              <p className="text-slate-600 text-xs text-center">밴드, 소독약, 진통제</p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-purple-400 transition-all">
              <div className="text-center mb-2 text-3xl">🔦</div>
              <p className="font-bold text-slate-900 text-center text-sm mb-1">헤드랜턴</p>
              <p className="text-slate-600 text-xs text-center">비상시 조명</p>
            </div>
          </div>
        </Card>
      </div>
        </div>
      )}
      
      {/* 입금 정보 모달 */}
      {showPaymentModal && event.paymentInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-slate-900">신청 완료</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-slate-600" />
                </button>
              </div>
              <p className="text-slate-600 mt-2">
                {event.title} 산행 신청이 완료되었습니다.
              </p>
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-900 font-bold">
                  참가비를 입금해주셔야 최종 신청이 완료됩니다.
                </p>
              </div>
              
              {/* 입금 정보 */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  입금 정보
                </h4>
                
                {/* 참가비 */}
                <Card className="bg-primary-50 border-2 border-primary-200">
                  <p className="text-sm text-primary-700 mb-1 font-medium">참가비</p>
                  <p className="text-3xl font-bold text-primary-900">{event.cost}</p>
                </Card>
                
                {/* 계좌 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">은행명</p>
                      <p className="text-lg font-bold text-slate-900">{event.paymentInfo.bankName}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(event.paymentInfo.bankName, '은행명')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="복사"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">계좌번호</p>
                      <p className="text-lg font-bold text-slate-900">{event.paymentInfo.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(event.paymentInfo.accountNumber, '계좌번호')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="복사"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">예금주</p>
                      <p className="text-lg font-bold text-slate-900">{event.paymentInfo.accountHolder}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(event.paymentInfo.accountHolder, '예금주')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="복사"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                {/* 담당자 정보 */}
                <Card className="bg-blue-50 border-blue-200">
                  <h5 className="text-sm font-bold text-slate-900 mb-3">담당자 문의</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">이름</span>
                      <span className="font-semibold text-slate-900">{event.paymentInfo.managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">연락처</span>
                      <a 
                        href={`tel:${event.paymentInfo.managerPhone}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {event.paymentInfo.managerPhone}
                      </a>
                    </div>
                  </div>
                </Card>
                
                {/* 입금 시 주의사항 */}
                <Card className="bg-slate-50">
                  <h5 className="text-sm font-bold text-slate-900 mb-2">입금 시 주의사항</h5>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• 입금자명은 본인 이름으로 해주세요</li>
                    <li>• 입금 확인 후 참석 확정됩니다</li>
                    <li>• 문의사항은 담당자에게 연락주세요</li>
                  </ul>
                </Card>
                
                {copiedText && (
                  <div className="fixed top-4 right-4 px-4 py-2 bg-primary-600 text-white rounded-xl shadow-lg">
                    {copiedText} 복사됨
                  </div>
                )}
              </div>
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  if (event.paymentInfo) {
                    const copyText = `
[산행 신청 완료]
산행명: ${event.title}
참가비: ${event.cost.toLocaleString()}원

[입금 정보]
은행명: ${event.paymentInfo.bankName}
계좌번호: ${event.paymentInfo.accountNumber}
예금주: ${event.paymentInfo.accountHolder}
입금 기한: ${event.paymentInfo.deadline}
                    `.trim();
                    
                    navigator.clipboard.writeText(copyText)
                      .then(() => {
                        alert('입금 정보가 클립보드에 복사되었습니다.');
                        setShowPaymentModal(false);
                      })
                      .catch(() => {
                        alert('복사에 실패했습니다. 다시 시도해주세요.');
                      });
                  }
                }}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
              >
                전체 정보 복사
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;

import { Calendar, MapPin, Users, TrendingUp, CheckCircle, XCircle, Clock, Navigation, UserCheck, Phone, Mail, CreditCard, Copy, X, Shield, Mountain } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed, formatDate } from '../utils/format';

const Events = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  
  // 한 달에 한 번 정기 산행 - 현재 예정된 산행
  const currentEvent = {
    id: '1',
    title: '앙봉산 정상 등반',
    date: '2026-01-15',
    location: '경기도 가평군',
    mountain: '앙봉산',
    altitude: '737.2m',
    difficulty: 'medium' as const,
    description: '앙봉산 정상(737.2m)을 목표로 하는 1월 정기 산행입니다.',
    maxParticipants: 25,
    currentParticipants: 18,
    cost: '60,000원',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    isRegistered: false,
    paymentInfo: {
      bankName: '국민은행',
      accountNumber: '123-456-789012',
      accountHolder: '시애라',
      managerName: '김산행',
      managerPhone: '010-1234-5678',
    },
    schedule: [
      { time: '07:15', location: '종합운동장역 6번 출구 앞 집결 및 출발', type: 'departure' },
      { time: '08:30-13:30', location: '산행코스 (A조)', type: 'stop' },
      { time: '17:00', location: '종합운동장역 복귀', type: 'arrival' },
    ],
    courses: [
      {
        id: 'course-a',
        name: 'A조',
        description: '한국APT - 약수터 - 성당칼림길 - 능선길 - 무적고개칼림길 - 왕산사칼림길 - 팔각정 - 정상(737.2m) - 팔각정 - 왕산사칼림길 - 왕산사(약 8.5킬로)',
        distance: '약 8.5킬로',
        schedule: [
          { time: '08:30', location: '한국APT 출발', type: 'departure' },
          { time: '09:00', location: '약수터', type: 'stop' },
          { time: '10:00', location: '성당칼림길', type: 'stop' },
          { time: '11:00', location: '능선길', type: 'stop' },
          { time: '12:00', location: '정상 (737.2m)', type: 'stop' },
          { time: '13:30', location: '왕산사 도착', type: 'arrival' },
        ],
      },
      {
        id: 'course-b',
        name: 'B조',
        description: '왕산사 - 관문봉칼림길 - 팔각정 - 정상(737.2m) - 팔각정 - 왕산사칼림길 - 왕산사(약 4.2킬로)',
        distance: '약 4.2킬로',
        schedule: [
          { time: '08:30', location: '왕산사 출발', type: 'departure' },
          { time: '09:30', location: '관문봉칼림길', type: 'stop' },
          { time: '10:30', location: '팔각정', type: 'stop' },
          { time: '11:30', location: '정상 (737.2m)', type: 'stop' },
          { time: '13:00', location: '왕산사 도착', type: 'arrival' },
        ],
      },
    ],
  };
  
  // 참석자 목록
  const participants = [
    { id: '1', name: '김산행', occupation: '○○그룹 회장', phone: '010-1234-5678', status: 'confirmed' as const },
    { id: '2', name: '이등산', occupation: '△△건설 대표이사', phone: '010-2345-6789', status: 'confirmed' as const },
    { id: '3', name: '박트레킹', occupation: '□□금융 부사장', phone: '010-3456-7890', status: 'confirmed' as const },
    { id: '4', name: '최하이킹', occupation: '◇◇제약 전무이사', phone: '010-4567-8901', status: 'confirmed' as const },
    { id: '5', name: '정봉우리', occupation: '☆☆병원 원장', phone: '010-5678-9012', status: 'confirmed' as const },
    { id: '6', name: '홍정상', occupation: '※※법률사무소 대표변호사', phone: '010-6789-0123', status: 'confirmed' as const },
    { id: '7', name: '강백운', occupation: '◎◎IT 대표', phone: '010-7890-1234', status: 'confirmed' as const },
    { id: '8', name: '윤설악', occupation: '▽▽건축 사장', phone: '010-8901-2345', status: 'confirmed' as const },
    { id: '9', name: '임지리', occupation: '★★무역 부사장', phone: '010-9012-3456', status: 'pending' as const },
    { id: '10', name: '조한라', occupation: '◆◆투자 이사', phone: '010-0123-4567', status: 'pending' as const },
  ];
  
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
  
  const getDifficultyBadge = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="success">초급</Badge>;
      case 'medium':
        return <Badge variant="warning">중급</Badge>;
      case 'hard':
        return <Badge variant="danger">상급</Badge>;
    }
  };
  
  const [isRegistered, setIsRegistered] = useState(currentEvent.isRegistered);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  
  // 신청 마감일 정보 계산
  const applicationDeadline = formatDeadline(currentEvent.date);
  const daysUntilDeadline = getDaysUntilDeadline(currentEvent.date);
  const applicationClosed = isApplicationClosed(currentEvent.date);
  
  const handleRegister = () => {
    if (applicationClosed) {
      alert('신청 기간이 마감되었습니다.');
      return;
    }
    // TODO: 실제 등록 로직
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
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">산행 일자</p>
          <p className="text-2xl font-bold text-slate-900">{formatDate(currentEvent.date)}</p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">참가 신청</p>
          <p className="text-3xl font-bold text-slate-900">
            {currentEvent.currentParticipants}/{currentEvent.maxParticipants}명
          </p>
        </Card>
        <Card className="text-center hover:shadow-lg transition-all">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-slate-600 text-sm mb-2">신청 마감</p>
          <p className="text-lg font-bold text-slate-900">{applicationDeadline}</p>
          {!applicationClosed && daysUntilDeadline <= 5 && (
            <Badge variant={daysUntilDeadline <= 3 ? 'danger' : 'warning'} className="mt-2">
              {daysUntilDeadline}일 남음
            </Badge>
          )}
        </Card>
      </div>
      
      {/* Current Event */}
      <Card className="mb-12 p-0 overflow-hidden hover:shadow-xl transition-all">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80">
          <img 
            src={currentEvent.imageUrl} 
            alt={currentEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              {getDifficultyBadge(currentEvent.difficulty)}
              <Badge variant="info">{currentEvent.cost}</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentEvent.title}</h2>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                <span>{currentEvent.altitude}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{currentEvent.location}</span>
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
                  <span className="font-semibold text-slate-900">{formatDate(currentEvent.date)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">장소</span>
                  <span className="font-semibold text-slate-900">{currentEvent.location}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium">신청 마감</span>
                  <span className="font-bold text-blue-900">{applicationDeadline}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-medium">참가비</span>
                  <span className="font-bold text-emerald-900 text-lg">{currentEvent.cost}</span>
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed">
                {currentEvent.description}
              </p>
            </div>
            
            {/* Schedule */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary-600" />
                당일 일정
              </h3>
              <div className="space-y-3">
                {currentEvent.schedule.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-primary-600 transition-colors">
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-primary-600 min-w-[100px] text-sm">{item.time}</span>
                      <div className="flex-1">
                        <Badge variant={
                          item.type === 'departure' ? 'success' :
                          item.type === 'arrival' ? 'info' : 'primary'
                        }>
                          {item.type === 'departure' && '출발'}
                          {item.type === 'stop' && '산행'}
                          {item.type === 'arrival' && '도착'}
                        </Badge>
                        <p className="text-slate-700 text-sm mt-2">{item.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Courses Section */}
          {currentEvent.courses && currentEvent.courses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">산행 코스</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentEvent.courses.map((course) => (
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
                {currentEvent.currentParticipants}/{currentEvent.maxParticipants}명
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentEvent.currentParticipants / currentEvent.maxParticipants) * 100}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {Math.round((currentEvent.currentParticipants / currentEvent.maxParticipants) * 100)}% 신청 완료
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
                  applicationClosed || currentEvent.currentParticipants >= currentEvent.maxParticipants
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
                disabled={applicationClosed || currentEvent.currentParticipants >= currentEvent.maxParticipants}
              >
                {applicationClosed 
                  ? '신청 마감' 
                  : currentEvent.currentParticipants >= currentEvent.maxParticipants 
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
      
      {/* Teams Section */}
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
      
      {/* Past Events */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">지난 산행 기록</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>{event.participants}명 참가</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 입금 정보 모달 */}
      {showPaymentModal && currentEvent.paymentInfo && (
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
                {currentEvent.title} 산행 신청이 완료되었습니다.
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
                  <p className="text-3xl font-bold text-primary-900">{currentEvent.cost}</p>
                </Card>
                
                {/* 계좌 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">은행명</p>
                      <p className="text-lg font-bold text-slate-900">{currentEvent.paymentInfo.bankName}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(currentEvent.paymentInfo.bankName, '은행명')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="복사"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">계좌번호</p>
                      <p className="text-lg font-bold text-slate-900">{currentEvent.paymentInfo.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(currentEvent.paymentInfo.accountNumber, '계좌번호')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="복사"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-xl hover:border-primary-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600">예금주</p>
                      <p className="text-lg font-bold text-slate-900">{currentEvent.paymentInfo.accountHolder}</p>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(currentEvent.paymentInfo.accountHolder, '예금주')}
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
                      <span className="font-semibold text-slate-900">{currentEvent.paymentInfo.managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">연락처</span>
                      <a 
                        href={`tel:${currentEvent.paymentInfo.managerPhone}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {currentEvent.paymentInfo.managerPhone}
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
                  setShowPaymentModal(false);
                  alert('입금 정보가 클립보드에 복사되었습니다.');
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

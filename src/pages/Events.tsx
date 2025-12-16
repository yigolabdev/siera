import { Calendar, MapPin, Users, TrendingUp, CheckCircle, XCircle, Clock, Navigation, UserCheck, Phone, Mail, CreditCard, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    const badges = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    const labels = {
      easy: '초급',
      medium: '중급',
      hard: '상급',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-bold ${badges[difficulty]}`}>
        {labels[difficulty]}
      </span>
    );
  };
  
  const [isRegistered, setIsRegistered] = useState(currentEvent.isRegistered);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  
  const handleRegister = () => {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-3">이번 달 정기 산행</h1>
        <p className="text-xl text-gray-600">
          매월 한 번 진행되는 정기 산행에 참여하세요.
        </p>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">산행 일자</p>
          <p className="text-2xl font-bold text-slate-900">{currentEvent.date}</p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">참가 신청</p>
          <p className="text-3xl font-bold text-slate-900">
            {currentEvent.currentParticipants}/{currentEvent.maxParticipants}명
          </p>
        </div>
        <div className="card text-center">
          <p className="text-slate-600 text-sm mb-2">나의 참여율</p>
          <p className="text-3xl font-bold text-slate-900">85%</p>
        </div>
      </div>
      
      {/* Current Event */}
      <div className="card mb-12">
        {/* Hero Image */}
        <div className="relative h-80 rounded-xl overflow-hidden mb-6">
          <img 
            src={currentEvent.imageUrl} 
            alt={currentEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-end">
            <div className="p-8 w-full bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-4xl font-bold text-white">{currentEvent.title}</h2>
                {getDifficultyBadge(currentEvent.difficulty)}
              </div>
              <p className="text-xl text-white/90">{currentEvent.location}</p>
            </div>
          </div>
        </div>
        
        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">산행 정보</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">일정</span>
                <span className="font-medium text-slate-900">{currentEvent.date}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">장소</span>
                <span className="font-medium text-slate-900">{currentEvent.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-600">참가비</span>
                <span className="font-bold text-primary-600">{currentEvent.cost}</span>
              </div>
            </div>
            
            <p className="text-slate-700 leading-relaxed">
              {currentEvent.description}
            </p>
          </div>
          
          {/* Schedule */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">당일 일정</h3>
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="space-y-3">
                {currentEvent.schedule.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 py-2">
                    <span className="font-bold text-slate-900 min-w-[100px]">{item.time}</span>
                    <div className="flex-1">
                      <span className="text-slate-700">
                        {item.type === 'departure' && '출발'}
                        {item.type === 'stop' && '산행'}
                        {item.type === 'return' && '복귀'}
                        {item.type === 'arrival' && '도착'}
                      </span>
                      <p className="text-slate-600 text-sm mt-1">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Courses Section */}
        {currentEvent.courses && currentEvent.courses.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">산행 코스</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentEvent.courses.map((course) => (
                <div key={course.id} className="p-5 border border-slate-200 rounded-xl">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">
                      {course.name}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{course.name} 코스</p>
                      <p className="text-sm text-slate-600">{course.distance}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-bold text-slate-700 mb-2">코스 안내</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-2">상세 일정</p>
                    <div className="space-y-2">
                      {course.schedule.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="text-sm font-bold text-slate-900 min-w-[60px]">{item.time}</span>
                          <span className="text-sm text-slate-600">{item.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-600">
                      산행시간: {course.name === 'A조' ? '약 5시간' : '약 4.5시간'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-slate-600 mb-2">
            <span>참가자 현황</span>
            <span className="font-bold text-slate-900">
              {currentEvent.currentParticipants}/{currentEvent.maxParticipants}명
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-slate-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentEvent.currentParticipants / currentEvent.maxParticipants) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          {isRegistered ? (
            <>
              <button className="flex-1 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg">
                참석 신청 완료
              </button>
              <button 
                onClick={handleCancel}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
              >
                신청 취소
              </button>
            </>
          ) : (
            <button 
              onClick={handleRegister}
              className="flex-1 btn-primary text-lg py-4"
              disabled={currentEvent.currentParticipants >= currentEvent.maxParticipants}
            >
              {currentEvent.currentParticipants >= currentEvent.maxParticipants ? '정원 마감' : '참석 신청하기'}
            </button>
          )}
          
          {/* View Participants Button */}
          <button 
            onClick={() => setShowParticipantsModal(true)}
            className="px-8 py-4 border-2 border-slate-300 text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors"
          >
            참석자 명단 ({participants.length}명)
          </button>
        </div>
      </div>
      
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
                  <XCircle className="h-6 w-6 text-slate-600" />
                </button>
              </div>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <span className="text-slate-600">
                  참석 확정: <span className="font-bold">{participants.filter(p => p.status === 'confirmed').length}명</span>
                </span>
                <span className="text-slate-600">
                  대기: <span className="font-bold">{participants.filter(p => p.status === 'pending').length}명</span>
                </span>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="space-y-1">
                {participants.map((participant, index) => (
                  <div 
                    key={participant.id} 
                    className="flex items-center space-x-3 p-3 border-b border-slate-100 last:border-0"
                  >
                    <span className="text-sm text-slate-500 min-w-[24px]">{index + 1}</span>
                    <span className="flex-1 font-medium text-slate-900">{participant.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      participant.status === 'confirmed' 
                        ? 'bg-slate-100 text-slate-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {participant.status === 'confirmed' ? '확정' : '대기'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t">
              <button 
                onClick={() => setShowParticipantsModal(false)}
                className="w-full px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Teams Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">이달의 참석자 조 편성</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="card">
              {/* Team Header */}
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">
                  {team.name}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-slate-600">조장</span>
                    <span className="font-bold text-slate-900">{team.leaderName}</span>
                  </div>
                  <p className="text-sm text-slate-600">{team.leaderOccupation}</p>
                </div>
              </div>
              
              {/* Team Members */}
              <div>
                <p className="text-sm text-slate-600 mb-3">조원 {team.members.length}명</p>
                <div className="space-y-2">
                  {team.members.map((member, idx) => (
                    <div 
                      key={member.id} 
                      className="flex items-start space-x-2 py-2 border-b border-slate-100 last:border-0"
                    >
                      <span className="text-xs text-slate-500 mt-0.5">{idx + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{member.name}</p>
                        <p className="text-xs text-slate-600">{member.occupation} · {member.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Past Events */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">지난 산행 기록</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pastEvents.map((event) => (
            <div key={event.id} className="card">
              <div className="text-sm text-slate-600 mb-2">{event.date}</div>
              <h3 className="font-bold text-slate-900 mb-2">{event.title}</h3>
              <div className="text-sm text-slate-600">{event.participants}명 참가</div>
            </div>
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
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-900 font-medium">
                  참가비를 입금해주셔야 최종 신청이 완료됩니다.
                </p>
              </div>
              
              {/* 입금 정보 */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900 mb-4">입금 정보</h4>
                
                {/* 참가비 */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">참가비</p>
                  <p className="text-3xl font-bold text-slate-900">{currentEvent.cost}</p>
                </div>
                
                {/* 계좌 정보 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
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
                  
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
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
                  
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
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
                <div className="mt-6 p-4 border border-slate-200 rounded-xl">
                  <h5 className="text-sm font-bold text-slate-900 mb-3">담당자 문의</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">이름</span>
                      <span className="font-medium text-slate-900">{currentEvent.paymentInfo.managerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">연락처</span>
                      <a 
                        href={`tel:${currentEvent.paymentInfo.managerPhone}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {currentEvent.paymentInfo.managerPhone}
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* 입금 시 주의사항 */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                  <h5 className="text-sm font-bold text-slate-900 mb-2">입금 시 주의사항</h5>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>입금자명은 본인 이름으로 해주세요</li>
                    <li>입금 확인 후 참석 확정됩니다</li>
                    <li>문의사항은 담당자에게 연락주세요</li>
                  </ul>
                </div>
                
                {copiedText && (
                  <div className="fixed top-4 right-4 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg">
                    {copiedText} 복사됨
                  </div>
                )}
              </div>
            </div>

            {/* 푸터 */}
            <div className="p-6 border-t flex space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  alert('입금 정보가 클립보드에 복사되었습니다.');
                }}
                className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
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


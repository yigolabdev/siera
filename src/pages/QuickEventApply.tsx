import { useState, useMemo, useEffect } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, Mountain, UserCheck, Clock, ArrowLeft, Search, Building2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { useEvents } from '../contexts/EventContext';
import { useMembers } from '../contexts/MemberContext';
import { formatDate, formatDeadline, getDaysUntilDeadline, isApplicationClosed } from '../utils/format';
import { User } from '../types';

export default function QuickEventApply() {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { members } = useMembers();
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 승인된 회원만 필터링
  const approvedMembers = useMemo(() => {
    return members.filter(m => m.isApproved && m.isActive !== false);
  }, [members]);

  // 이름으로 회원 검색
  const filteredMembers = useMemo(() => {
    if (!name.trim() || selectedMember) return [];
    
    const searchName = name.trim().toLowerCase();
    return approvedMembers
      .filter(member => 
        member.name.toLowerCase().includes(searchName)
      )
      .slice(0, 10); // 최대 10개만 표시
  }, [name, approvedMembers, selectedMember]);

  // 이름 입력 핸들러
  const handleNameChange = (value: string) => {
    setName(value);
    setSelectedMember(null);
    setShowMemberSuggestions(true);
  };

  // 회원 선택 핸들러
  const handleSelectMember = (member: User) => {
    setSelectedMember(member);
    setName(member.name);
    setShowMemberSuggestions(false);
  };

  // 선택 취소 핸들러
  const handleClearSelection = () => {
    setSelectedMember(null);
    setName('');
    setShowMemberSuggestions(false);
  };

  // 신청 가능한 산행 목록 (현재부터 2개월 이내)
  const availableEvents = useMemo(() => {
    const now = new Date();
    const twoMonthsLater = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= twoMonthsLater && event.isPublished !== false;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  // 선택된 산행 또는 첫 번째 산행
  const currentEvent = useMemo(() => {
    if (selectedEventId) {
      return availableEvents.find(e => e.id === selectedEventId) || availableEvents[0] || null;
    }
    return availableEvents[0] || null;
  }, [availableEvents, selectedEventId]);

  // 신청 마감일 정보 계산
  const applicationDeadline = currentEvent ? formatDeadline(currentEvent.date) : '';
  const daysUntilDeadline = currentEvent ? getDaysUntilDeadline(currentEvent.date) : 0;
  const applicationClosed = currentEvent ? isApplicationClosed(currentEvent.date) : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMember) {
      alert('등록된 회원을 선택해주세요.');
      return;
    }

    if (!currentEvent) {
      alert('현재 신청 가능한 산행이 없습니다.');
      return;
    }

    // 코스 선택 확인 (코스가 있는 경우에만)
    if (currentEvent.courses && currentEvent.courses.length > 0 && !selectedCourse) {
      alert('코스를 선택해주세요.');
      return;
    }

    // 신청 마감 확인
    if (isApplicationClosed(currentEvent.date)) {
      alert(`신청 기간이 마감되었습니다. (${formatDeadline(currentEvent.date)} 마감)`);
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 실제 Firebase 연동 - ParticipationContext 사용
      console.log('간편 산행 신청:', { 
        memberId: selectedMember.id,
        memberName: selectedMember.name,
        memberEmail: selectedMember.email,
        memberCompany: selectedMember.company,
        eventId: currentEvent.id, 
        course: selectedCourse 
      });
      
      // 시뮬레이션: 서버 통신 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert(`${selectedMember.name}님의 산행 신청이 완료되었습니다!\n자세한 내용은 등록하신 연락처로 안내드립니다.`);
      navigate('/');
    } catch (error) {
      console.error('산행 신청 실패:', error);
      alert('산행 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    if (['하', '중하', '중', '중상', '상'].includes(difficulty)) {
      return difficulty;
    }
    const labels: Record<string, string> = {
      easy: '하',
      medium: '중',
      hard: '상',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const normalizedDifficulty = getDifficultyLabel(difficulty);
    switch (normalizedDifficulty) {
      case '하':
        return 'success';
      case '중하':
        return 'info';
      case '중':
        return 'warning';
      case '중상':
      case '상':
        return 'danger';
      default:
        return 'primary';
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 산행이 없는 경우
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              홈으로 돌아가기
            </Link>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">간편 산행 신청</h1>
              <p className="text-lg text-slate-400">
                로그인 없이 이름만 입력하면 빠르게 산행을 신청할 수 있습니다
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-800 shadow-2xl text-center">
            <Calendar className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">
              현재 신청 가능한 산행이 없습니다
            </h2>
            <p className="text-slate-400 mb-8">
              다음 산행 일정을 기다려주세요.<br />
              정기 산행은 매월 진행됩니다.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
            >
              <Mountain className="w-5 h-5" />
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로 돌아가기
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">간편 산행 신청</h1>
            <p className="text-lg text-slate-400">
              로그인 없이 이름만 입력하면 빠르게 산행을 신청할 수 있습니다
            </p>
          </div>
        </div>

        {/* 로딩 상태 */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
              <p className="text-xl text-white font-medium">산행 정보를 불러오는 중...</p>
            </div>
          </div>
        ) : availableEvents.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-12 text-center border border-slate-800">
            <Mountain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">신청 가능한 산행이 없습니다</h3>
            <p className="text-slate-400 mb-6">
              현재 접수 중인 산행이 없습니다.<br />
              다음 산행 일정은 곧 공지될 예정입니다.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              홈으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
        {/* Notice */}
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-white">간편 신청 안내</p>
              <p className="text-white">등록된 회원만 신청 가능합니다. 정확한 이름을 입력하시면 자동으로 회원 정보가 확인됩니다.</p>
            </div>
          </div>
        </div>

        {/* 산행 선택 (여러 산행이 있을 경우) */}
        {availableEvents.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-4">신청할 산행을 선택하세요</h3>
            <div className="grid grid-cols-1 gap-3">
              {availableEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setSelectedCourse('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    currentEvent.id === event.id
                      ? 'border-emerald-600 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-900/50 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-lg text-white">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {currentEvent.id === event.id && (
                        <Badge variant="primary">선택됨</Badge>
                      )}
                      <Badge variant={getDifficultyColor(event.difficulty)}>
                        {getDifficultyLabel(event.difficulty)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Information */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                {availableEvents.length > 1 ? '선택된 산행 정보' : '이번 달 정기 산행'}
              </h3>
              
              {/* 신청 마감일 안내 */}
              {applicationClosed ? (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-red-400">신청 마감</h4>
                      <p className="text-sm text-red-300 mt-1">
                        신청 기간이 종료되었습니다. ({applicationDeadline} 마감)
                      </p>
                    </div>
                  </div>
                </div>
              ) : daysUntilDeadline <= 3 ? (
                <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <h4 className="text-lg font-bold text-amber-400">마감 임박!</h4>
                      <p className="text-sm text-amber-300 mt-1">
                        신청 마감까지 <strong>{daysUntilDeadline}일</strong> 남았습니다. ({applicationDeadline})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span>
                      신청 마감: <strong className="text-blue-200">{applicationDeadline}</strong>
                      <span className="text-blue-400 ml-2">(출발일 10일 전)</span>
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-2xl font-bold text-white">{currentEvent.title}</h4>
                  <Badge variant={getDifficultyColor(currentEvent.difficulty)}>
                    {getDifficultyLabel(currentEvent.difficulty)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">{formatDate(currentEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span className="text-base">{currentEvent.location}</span>
                  </div>
                  {currentEvent.mountain && (
                    <div className="flex items-center space-x-2">
                      <Mountain className="w-5 h-5" />
                      <span className="text-base">
                        {currentEvent.mountain}
                        {currentEvent.altitude && ` (${currentEvent.altitude})`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-emerald-400">참가비: {currentEvent.cost}</span>
                  </div>
                </div>
                
                {currentEvent.description && (
                  <div className="pt-3 mt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-300">{currentEvent.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Course Selection */}
            {currentEvent.courses && currentEvent.courses.length > 0 && (
              <div className="pt-6 border-t border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                  코스 선택
                </h3>
                <div className="space-y-3 mb-4">
                  {currentEvent.courses.map((course, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedCourse(course.name)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedCourse === course.name
                          ? 'border-emerald-600 bg-emerald-500/10'
                          : 'border-slate-700 bg-slate-800/50 hover:border-emerald-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-white">
                            {course.name}
                          </h4>
                          <span className="text-sm font-semibold text-slate-400">
                            {course.distance}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "warning" : "info"}>
                            {course.difficulty}
                          </Badge>
                          {selectedCourse === course.name && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {course.description}
                      </p>
                    </button>
                  ))}
                  
                  {/* 현장 결정 옵션 */}
                  <button
                    type="button"
                    onClick={() => setSelectedCourse('현장 결정')}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCourse === '현장 결정'
                        ? 'border-emerald-600 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning" className="text-xs">현장 결정</Badge>
                        <span className="text-white font-semibold">현장에서 결정하겠습니다</span>
                      </div>
                      {selectedCourse === '현장 결정' && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                  </button>
                </div>
                
                {!selectedCourse && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    코스를 선택해주세요
                  </p>
                )}
              </div>
            )}

            {/* Name Input */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                신청자 정보
              </h3>
              <div className="relative">
                <label className="block text-white font-semibold mb-2 text-sm">
                  이름 <span className="text-red-400">*</span>
                </label>
                
                {/* 선택된 회원 표시 */}
                {selectedMember ? (
                  <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                          {selectedMember.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{selectedMember.name}</p>
                          {selectedMember.company && (
                            <p className="text-sm text-slate-300 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {selectedMember.company}
                              {selectedMember.position && ` · ${selectedMember.position}`}
                            </p>
                          )}
                          <p className="text-xs text-emerald-400 mt-1">✓ 등록된 회원</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        disabled={isSubmitting}
                      >
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onFocus={() => setShowMemberSuggestions(true)}
                        className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all pr-12"
                        placeholder="등록된 회원 이름을 입력하세요"
                        required
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>

                    {/* 회원 검색 결과 */}
                    {showMemberSuggestions && filteredMembers.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-slate-800 border-2 border-slate-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                        <div className="p-2">
                          <p className="text-xs text-slate-400 px-3 py-2">
                            검색 결과 ({filteredMembers.length}명)
                          </p>
                          {filteredMembers.map((member) => (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => handleSelectMember(member)}
                              className="w-full p-3 rounded-lg hover:bg-slate-700 transition-colors text-left flex items-center gap-3"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                {member.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{member.name}</p>
                                {member.company && (
                                  <p className="text-sm text-slate-300 flex items-center gap-1 truncate">
                                    <Building2 className="w-3 h-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {member.company}
                                      {member.position && ` · ${member.position}`}
                                    </span>
                                  </p>
                                )}
                                {!member.company && member.email && (
                                  <p className="text-xs text-slate-400 truncate">{member.email}</p>
                                )}
                              </div>
                              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 검색 결과 없음 */}
                    {showMemberSuggestions && name.trim() && filteredMembers.length === 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-slate-800 border-2 border-red-500/50 rounded-xl shadow-2xl p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-red-400">등록된 회원을 찾을 수 없습니다</p>
                            <p className="text-sm text-slate-300 mt-1">
                              입력하신 이름으로 등록된 회원이 없습니다.<br />
                              정확한 이름을 입력하시거나, 회원 가입 후 신청해주세요.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <p className="mt-2 text-sm text-slate-400">
                  ※ 동호회에 등록된 정확한 이름을 입력해주세요
                </p>
              </div>
            </div>

            {/* 입금 안내 */}
            <div className="pt-6 border-t border-slate-700">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1 text-white">입금 완료 후 신청 확정</p>
                    <p className="text-white">신청 후 안내받으신 계좌로 참가비를 입금해야 최종 신청이 확정됩니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link
                to="/"
                className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-xl font-bold text-center hover:bg-slate-700 transition-all border border-slate-700"
              >
                취소
              </Link>
              <button 
                type="submit" 
                disabled={
                  applicationClosed ||
                  isSubmitting ||
                  !selectedMember ||
                  (currentEvent.courses && currentEvent.courses.length > 0 && !selectedCourse)
                }
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg ${
                  applicationClosed || isSubmitting || !selectedMember || (currentEvent.courses && currentEvent.courses.length > 0 && !selectedCourse)
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    처리 중...
                  </>
                ) : applicationClosed ? (
                  '신청 마감'
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    신청하기
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        </>
        )}
      </div>
    </div>
  );
}

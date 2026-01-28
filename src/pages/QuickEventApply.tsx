import { useState, useMemo, useEffect } from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, Mountain, UserCheck, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import { useEvents } from '../contexts/EventContext';
import { formatDate, formatDeadline, getDaysUntilDeadline, isApplicationClosed } from '../utils/format';

export default function QuickEventApply() {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('');

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
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

    // 시뮬레이션: 서버 통신 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: 실제 Firebase 연동
    console.log('간편 산행 신청:', { name, eventId: currentEvent.id, course: selectedCourse });
    
    alert('산행 신청이 완료되었습니다!\n자세한 내용은 등록하신 연락처로 안내드립니다.');
    setIsSubmitting(false);
    navigate('/');
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
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  이름 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="등록된 회원 이름을 입력하세요"
                  required
                  disabled={isSubmitting}
                />
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
                  !name.trim() ||
                  (currentEvent.courses && currentEvent.courses.length > 0 && !selectedCourse)
                }
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg ${
                  applicationClosed || isSubmitting || !name.trim() || (currentEvent.courses && currentEvent.courses.length > 0 && !selectedCourse)
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
      </div>
    </div>
  );
}

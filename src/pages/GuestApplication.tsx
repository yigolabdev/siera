import { useState, useEffect, useMemo } from 'react';
import { Mountain, User, Mail, Phone, Briefcase, Building, UserPlus, ArrowLeft, Clock, AlertCircle, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed, formatDate } from '../utils/format';
import { useEvents } from '../contexts/EventContext';
import { useGuestApplications } from '../contexts/GuestApplicationContext';

const GuestApplication = () => {
  const navigate = useNavigate();
  const { events, isLoading } = useEvents();
  const { addGuestApplication } = useGuestApplications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    company: '',
    position: '',
    referredBy: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 신청 가능한 산행 (현재부터 2개월 이내)
  const currentEvent = useMemo(() => {
    const now = new Date();
    const twoMonthsLater = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    const availableEvents = events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && 
               eventDate <= twoMonthsLater && 
               event.isPublished !== false;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return availableEvents[0] || null;
  }, [events]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEvent) {
      alert('현재 신청 가능한 산행이 없습니다.');
      return;
    }
    
    // 마감일 확인
    if (isApplicationClosed(currentEvent.date)) {
      alert('신청 기간이 마감되었습니다.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Firebase에 게스트 신청 저장
      await addGuestApplication({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        company: formData.company || undefined,
        position: formData.position || undefined,
        referredBy: formData.referredBy || undefined,
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        eventDate: currentEvent.date,
      });
      
      console.log('✅ 게스트 신청 완료:', {
        name: formData.name,
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
      });
      
      alert('산행 신청이 완료되었습니다!\n담당자 확인 후 연락드리겠습니다.');
      navigate('/');
    } catch (error) {
      console.error('❌ 게스트 신청 실패:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 신청 마감일 정보 계산
  const applicationDeadline = currentEvent ? formatDeadline(currentEvent.date) : '';
  const daysUntilDeadline = currentEvent ? getDaysUntilDeadline(currentEvent.date) : 0;
  const applicationClosed = currentEvent ? isApplicationClosed(currentEvent.date) : true;

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
              <h1 className="text-4xl font-bold text-white mb-2">게스트 산행 신청</h1>
              <p className="text-lg text-slate-400">
                회원이 아니어도 게스트로 산행에 참여하실 수 있습니다
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-800 shadow-2xl text-center">
            <Calendar className="w-20 h-20 text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">
              현재 게스트 신청 가능한 산행이 없습니다
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
            <h1 className="text-4xl font-bold text-white mb-2">게스트 산행 신청</h1>
            <p className="text-lg text-slate-400">
              회원이 아니어도 게스트로 산행에 참여하실 수 있습니다
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
        ) : !currentEvent ? (
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
              <p className="font-semibold mb-1 text-white">게스트 신청 승인 안내</p>
              <p className="text-white">신청 후 관리자 승인이 필요합니다. 승인 완료 시 입금 계좌를 안내드립니다.</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                기본 정보
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    이름 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    이메일 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    전화번호 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                직업 정보
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    소속 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="○○그룹"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    직책 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="예: 대표이사, 전무, 부장 등"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Referral Info */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                추천인 정보
              </h3>
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  추천인
                </label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="시애라 회원의 이름을 입력해주세요 (선택)"
                />
                <p className="mt-2 text-sm text-slate-400">
                  시애라 회원의 추천이 있으면 더욱 좋습니다 (선택사항)
                </p>
              </div>
            </div>

            {/* Event Information */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                이번 달 정기 산행
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
                <h4 className="text-2xl font-bold text-white mb-3">{currentEvent.title}</h4>
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5" />
                    <span className="text-base">{currentEvent.location}</span>
                  </div>
                  {currentEvent.mountain && (
                    <div className="flex items-center space-x-2">
                      <span className="text-base">
                        {currentEvent.mountain}
                        {currentEvent.altitude && ` (${currentEvent.altitude})`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{formatDate(currentEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-emerald-400">참가비: {currentEvent.cost}</span>
                  </div>
                  {currentEvent.description && (
                    <div className="pt-2 mt-2 border-t border-slate-700">
                      <p className="text-sm text-slate-300">{currentEvent.description}</p>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  * 신청 후 참가비 입금이 완료되어야 최종 신청이 확정됩니다. 입금 계좌는 승인 후 안내드립니다.
                </p>
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
                disabled={applicationClosed || isSubmitting}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg ${
                  applicationClosed || isSubmitting
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
                    <UserPlus className="w-5 h-5" />
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
};

export default GuestApplication;


import { useState, useEffect } from 'react';
import { Mountain, User, Mail, Phone, Briefcase, Building, UserPlus, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDeadline, getDaysUntilDeadline, isApplicationClosed, formatDate } from '../utils/format';

const GuestApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    occupation: '',
    company: '',
    referredBy: '',
  });

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 이번 달 정기 산행
  const currentEvent = {
    id: '1',
    title: '앙봉산 정상 등반',
    date: '2026-01-15',
    location: '경기도 가평군',
    cost: '60,000원',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 마감일 확인
    if (isApplicationClosed(currentEvent.date)) {
      alert('신청 기간이 마감되었습니다.');
      return;
    }
    
    // TODO: 실제 API 호출로 대체
    console.log('게스트 신청:', formData);
    alert('산행 신청이 완료되었습니다!\n담당자 확인 후 연락드리겠습니다.');
    navigate('/');
  };
  
  // 신청 마감일 정보 계산
  const applicationDeadline = formatDeadline(currentEvent.date);
  const daysUntilDeadline = getDaysUntilDeadline(currentEvent.date);
  const applicationClosed = isApplicationClosed(currentEvent.date);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">게스트 산행 신청</h1>
          <p className="text-lg text-slate-600">
            회원이 아니어도 게스트로 산행에 참여하실 수 있습니다
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">기본 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="홍길동"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="010-1234-5678"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      직업 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="예: 회사 대표이사"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      회사/기관 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="○○그룹"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Info */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">추천인 정보</h3>
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  누구의 추천으로 오셨나요? <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="추천인 이름을 입력해주세요"
                  required
                />
                <p className="mt-2 text-sm text-slate-500">
                  시애라 회원의 추천이 필요합니다
                </p>
              </div>
            </div>

            {/* Event Information */}
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4">이번 달 정기 산행</h3>
              
              {/* 신청 마감일 안내 */}
              {applicationClosed ? (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold text-red-900">신청 마감</h4>
                      <p className="text-sm text-red-700 mt-1">
                        신청 기간이 종료되었습니다. ({applicationDeadline} 마감)
                      </p>
                    </div>
                  </div>
                </div>
              ) : daysUntilDeadline <= 3 ? (
                <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 animate-pulse" />
                    <div>
                      <h4 className="text-lg font-bold text-amber-900">마감 임박!</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        신청 마감까지 <strong>{daysUntilDeadline}일</strong> 남았습니다. ({applicationDeadline})
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-blue-800">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span>
                      신청 마감: <strong className="text-blue-900">{applicationDeadline}</strong>
                      <span className="text-blue-600 ml-2">(출발일 10일 전)</span>
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6 bg-primary-50 rounded-xl border border-primary-200">
                <h4 className="text-2xl font-bold text-slate-900 mb-3">{currentEvent.title}</h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <Mountain className="w-5 h-5" />
                    <span className="text-base">{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{formatDate(currentEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-primary-600">참가비: {currentEvent.cost}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  * 신청 후 참가비 입금이 완료되어야 최종 신청이 확정됩니다. 입금 계좌는 승인 후 안내드립니다.
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="p-6 bg-amber-50 rounded-xl border-2 border-amber-300">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <h4 className="text-lg font-bold text-amber-900">게스트 신청 승인 절차 안내</h4>
              </div>
              <div className="ml-9 space-y-2 text-sm text-amber-900">
                <p className="font-semibold text-base">
                  ✓ 관리자 승인이 필요합니다
                </p>
                <p>
                  • 게스트 신청서를 제출하시면 <strong>운영진이 검토 후 승인</strong>합니다
                </p>
                <p>
                  • 승인은 통상 <strong>1~2일 이내</strong>에 처리됩니다
                </p>
                <p>
                  • 승인 완료 시 <strong>입금 계좌 및 금액을 문자/이메일로 안내</strong>드립니다
                </p>
                <p>
                  • <strong>입금 확인 후 최종 신청이 확정</strong>되며, 산행 세부 일정을 안내드립니다
                </p>
                <p className="pt-2 border-t border-amber-200 mt-3">
                  💡 정회원 가입을 원하시면 홈페이지에서 회원가입을 진행해주세요
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <Link
                to="/"
                className="flex-1 btn-secondary text-center"
              >
                돌아가기
              </Link>
              <button 
                type="submit" 
                disabled={applicationClosed}
                className={`flex-1 font-bold py-3 rounded-xl transition-all ${
                  applicationClosed
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {applicationClosed ? '신청 마감' : '신청하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestApplication;


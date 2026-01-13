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
                    직업 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                    placeholder="예: 회사 대표이사"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    회사/기관 <span className="text-red-400">*</span>
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
              </div>
            </div>

            {/* Referral Info */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                추천인 정보
              </h3>
              <div>
                <label className="block text-white font-semibold mb-2 text-sm">
                  누구의 추천으로 오셨나요? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
                  placeholder="추천인 이름을 입력해주세요"
                  required
                />
                <p className="mt-2 text-sm text-slate-400">
                  시애라 회원의 추천이 필요합니다
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
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{formatDate(currentEvent.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-emerald-400">참가비: {currentEvent.cost}</span>
                  </div>
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
                disabled={applicationClosed}
                className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg ${
                  applicationClosed
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                <UserPlus className="w-5 h-5" />
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


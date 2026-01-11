import { useState, useEffect } from 'react';
import { Mountain, User, Mail, Phone, Briefcase, Building, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
    // TODO: 실제 API 호출로 대체
    console.log('게스트 신청:', formData);
    alert('산행 신청이 완료되었습니다!\n담당자 확인 후 연락드리겠습니다.');
    navigate('/login');
  };

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
              <div className="p-6 bg-primary-50 rounded-xl border border-primary-200">
                <h4 className="text-2xl font-bold text-slate-900 mb-3">{currentEvent.title}</h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{currentEvent.date}</span>
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
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700">
                <strong>게스트 신청 안내</strong>
                <br />• 시애라는 매월 한 번 정기 산행을 진행합니다
                <br />• 게스트 신청 후 담당자 확인이 필요합니다
                <br />• <strong>승인 후 참가비 입금이 완료되어야 최종 신청이 확정됩니다</strong>
                <br />• 입금 계좌 및 금액은 승인 시 문자/이메일로 안내드립니다
                <br />• 정회원 가입을 원하시면 로그인 페이지에서 회원가입을 진행해주세요
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <Link
                to="/login"
                className="flex-1 btn-secondary text-center"
              >
                돌아가기
              </Link>
              <button type="submit" className="flex-1 btn-primary">
                신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestApplication;


import { useState } from 'react';
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

  // 이번 달 정기 산행
  const currentEvent = {
    id: '1',
    title: '북한산 백운대 등반',
    date: '2026-01-15',
    location: '북한산 국립공원',
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Mountain className="h-12 w-12 text-primary-600" />
            <h1 className="text-4xl font-bold text-gray-900">시애라</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게스트 산행 신청</h2>
          <p className="text-lg text-gray-600">
            회원이 아니어도 게스트로 산행에 참여하실 수 있습니다
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5 text-primary-600" />
                <span>기본 정보</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
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
                    <label className="block text-gray-700 font-medium mb-2">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="010-1234-5678"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      직업 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="예: 회사 대표이사"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      회사/기관 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="○○그룹"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Info */}
            <div className="pt-6 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-primary-600" />
                <span>추천인 정보</span>
              </h3>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
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
                <p className="mt-2 text-sm text-gray-500">
                  시애라 회원의 추천이 필요합니다
                </p>
              </div>
            </div>

            {/* Event Information */}
            <div className="pt-6 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Mountain className="h-5 w-5 text-primary-600" />
                <span>이번 달 정기 산행</span>
              </h3>
              <div className="p-6 bg-gradient-to-r from-primary-50 to-green-50 rounded-lg border-l-4 border-primary-600">
                <h4 className="text-2xl font-bold text-gray-900 mb-3">{currentEvent.title}</h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-5 w-5 text-primary-600" />
                    <span className="text-lg">{currentEvent.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-5 w-5 text-primary-600" />
                    <span className="text-lg">{currentEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-5 w-5 text-primary-600" />
                    <span className="text-lg font-bold text-primary-600">참가비: {currentEvent.cost}</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  * 참가비는 당일 현장에서 납부하시면 됩니다
                </p>
              </div>
            </div>

            {/* Notice */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>게스트 신청 안내</strong>
                <br />• 시애라는 매월 한 번 정기 산행을 진행합니다
                <br />• 게스트 신청 후 담당자 확인이 필요합니다
                <br />• 승인 완료 시 연락드리며, 산행 비용은 당일 현장에서 납부하시면 됩니다
                <br />• 정회원 가입을 원하시면 로그인 페이지에서 회원가입을 진행해주세요
              </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <Link
                to="/login"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium text-lg hover:bg-gray-300 transition-colors text-center flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>돌아가기</span>
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


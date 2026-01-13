import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phoneNumber: '',
    occupation: '',
    company: '',
    referredBy: '',
    hikingLevel: '',
    applicationMessage: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 페이지 로드 시 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = '전화번호를 입력해주세요.';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = '직업을 입력해주세요.';
    }

    if (!formData.company.trim()) {
      newErrors.company = '회사/기관을 입력해주세요.';
    }

    if (!formData.hikingLevel) {
      newErrors.hikingLevel = '산행능력을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      occupation: formData.occupation,
      company: formData.company,
    });

    if (success) {
      alert(
        '회원가입 신청이 완료되었습니다!\n\n' +
        '관리자 승인 후 이용 가능합니다.\n' +
        '승인 완료 시 이메일로 안내드립니다.'
      );
      navigate('/');
    }
  };

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
            <h1 className="text-4xl font-bold text-white mb-2">회원가입 신청</h1>
            <p className="text-lg text-slate-400">
              시애라 산악회에 오신 것을 환영합니다
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-1 text-white">가입 승인 안내</p>
              <p className="text-white">회원가입 신청 후 관리자 승인이 필요합니다. 승인 완료 시 이메일로 안내드립니다.</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
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
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.name ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="홍길동"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                  )}
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
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.email ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    비밀번호 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.password ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="최소 6자 이상"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    비밀번호 확인 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.passwordConfirm ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="비밀번호를 다시 입력하세요"
                  />
                  {errors.passwordConfirm && (
                    <p className="mt-2 text-sm text-red-400">{errors.passwordConfirm}</p>
                  )}
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
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="010-1234-5678"
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-400">{errors.phoneNumber}</p>
                  )}
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
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.occupation ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="예: 회사 대표이사"
                  />
                  {errors.occupation && (
                    <p className="mt-2 text-sm text-red-400">{errors.occupation}</p>
                  )}
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
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.company ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="○○그룹"
                  />
                  {errors.company && (
                    <p className="mt-2 text-sm text-red-400">{errors.company}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Hiking Info */}
            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-700">
                산행 정보
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    추천인
                  </label>
                  <input
                    type="text"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.referredBy ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all`}
                    placeholder="시애라 회원의 이름을 입력해주세요 (선택)"
                  />
                  {errors.referredBy && (
                    <p className="mt-2 text-sm text-red-400">{errors.referredBy}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-400">
                    시애라 회원의 추천이 있으면 더욱 좋습니다 (선택사항)
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    산행능력 <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="hikingLevel"
                    value={formData.hikingLevel}
                    onChange={handleChange}
                    className={`w-full px-5 py-4 rounded-xl border-2 ${
                      errors.hikingLevel ? 'border-red-500' : 'border-slate-700'
                    } bg-slate-800/50 text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all cursor-pointer`}
                  >
                    <option value="">산행능력을 선택해주세요</option>
                    <option value="beginner">초급 - 둘레길, 낮은 산 (2~3시간)</option>
                    <option value="intermediate">중급 - 일반 산행 (4~5시간)</option>
                    <option value="advanced">상급 - 장시간 산행 (6시간 이상)</option>
                  </select>
                  {errors.hikingLevel && (
                    <p className="mt-2 text-sm text-red-400">{errors.hikingLevel}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-400">
                    본인의 체력 수준에 맞는 산행능력을 선택해주세요
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    가입신청 문구
                  </label>
                  <textarea
                    name="applicationMessage"
                    value={formData.applicationMessage}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                    placeholder="시애라 산악회에 가입하고 싶은 이유나 자기소개를 자유롭게 작성해주세요."
                  />
                  <p className="mt-2 text-sm text-slate-400">
                    선택사항입니다. 가입 심사에 도움이 됩니다.
                  </p>
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
                className="flex-1 px-6 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                가입 신청하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

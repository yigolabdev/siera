import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../../components/ui/FadeIn';
import { ChevronDown, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContextEnhanced';
import Modal from '../../components/ui/Modal';

export const LandingHero: React.FC = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showMobileLoginModal, setShowMobileLoginModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setLoginFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginFormData.email, loginFormData.password);
    if (success) {
      if (rememberMe) {
        localStorage.setItem('savedEmail', loginFormData.email);
      } else {
        localStorage.removeItem('savedEmail');
      }
      setShowMobileLoginModal(false); // 모달 닫기
      navigate('/home');
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop" 
          alt="Majestic Mountain Range" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center">
          {/* Main Content */}
          <div className="text-center mb-28 md:mb-40">
            <FadeIn delay={200}>
              <h2 className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
                2005 ~ 2026 Heritage
              </h2>
            </FadeIn>
            
            <FadeIn delay={400}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                리더들을 위한<br />
                하이 트러스트 커뮤니티
              </h1>
            </FadeIn>

            <FadeIn delay={600}>
              <p className="text-gray-200 text-sm md:text-lg mb-10 max-w-2xl leading-relaxed font-light mx-auto">
                건강한 루틴과 검증된 네트워크. 전문직·CEO·임원들이 선택한 품격 있는 교류의 장, 시애라 클럽입니다.
              </p>
            </FadeIn>

            <FadeIn delay={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={scrollToAbout}
                  className="inline-block border-2 border-white text-white px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                >
                  더보기
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="inline-block border-2 border-white bg-white text-black px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-colors duration-300"
                >
                  시애라 소개 보기
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Login Form */}
          <FadeIn delay={1000} className="w-full max-w-4xl">
            {/* Desktop: 한 줄 레이아웃 */}
            <div className="hidden md:block bg-slate-900/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl w-full border border-slate-700">
              <form onSubmit={handleLoginSubmit}>
                <div className="flex items-center gap-3">
                  {/* Title */}
                  <div className="flex-shrink-0">
                    <h2 className="text-lg font-bold text-white whitespace-nowrap">
                      회원 로그인
                    </h2>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-8 bg-slate-700"></div>

                  {/* Email Input */}
                  <input
                    type="email"
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    className="w-52 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                    placeholder="이메일"
                    required
                  />
                  
                  {/* Password Input */}
                  <input
                    type="password"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    className="w-44 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                    placeholder="비밀번호"
                    required
                  />

                  {/* Remember Me Checkbox */}
                  <label className="flex items-center cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      id="rememberMeHero"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 text-slate-400 bg-slate-800 border-slate-600 rounded focus:ring-slate-400 cursor-pointer"
                    />
                    <span className="ml-1.5 text-white/80 text-xs">저장</span>
                  </label>
                  
                  {/* Login Button */}
                  <button 
                    type="submit" 
                    className="bg-white text-slate-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </button>
                  
                  {/* Quick Apply Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/quick-apply')}
                    className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-all whitespace-nowrap"
                  >
                    간편신청
                  </button>
                  
                  {/* Guest Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/guest-application')}
                    className="text-white text-sm font-medium px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-600 whitespace-nowrap"
                  >
                    게스트
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile: 3개 버튼만 표시 */}
            <div className="md:hidden bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl w-full border border-slate-700">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setShowMobileLoginModal(true)}
                  className="bg-white text-slate-900 py-3 rounded-lg font-bold text-base hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  회원 로그인
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/quick-apply')}
                  className="bg-green-600 text-white text-base font-bold py-3 rounded-lg hover:bg-green-700 transition-all"
                >
                  간편 산행 신청
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/guest-application')}
                  className="text-white text-base font-medium py-3 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-600"
                >
                  게스트로 신청하기
                </button>
              </div>
            </div>

            {/* Development Quick Login - 최소화 (관리자만) */}
            <div className="mt-3 ml-auto flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={async () => {
                  setIsLoggingIn(true);
                  setLoginStatus({ type: 'info', message: '로그인 중...' });
                  try {
                    const success = await login('choi@yigolab.com', 'chlgywns12#');
                    if (success) {
                      setLoginStatus({ type: 'success', message: '✅ 로그인 성공! 이동 중...' });
                      setTimeout(() => navigate('/home'), 1000);
                    } else {
                      setLoginStatus({ type: 'error', message: '❌ 로그인 실패: 잘못된 이메일 또는 비밀번호' });
                    }
                  } catch (error: any) {
                    setLoginStatus({ type: 'error', message: `❌ 오류: ${error.message}` });
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="px-3 py-1.5 bg-orange-100 text-orange-900 rounded-lg text-xs font-bold hover:bg-orange-200 transition-all border border-orange-300 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AlertCircle className="w-3 h-3" />
                {isLoggingIn ? '로그인 중...' : '개발용 임시 로그인'}
              </button>
              
              {/* 상태 메시지 */}
              {loginStatus && (
                <div className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  loginStatus.type === 'success' ? 'bg-green-100 text-green-900 border border-green-300' :
                  loginStatus.type === 'error' ? 'bg-red-100 text-red-900 border border-red-300' :
                  'bg-blue-100 text-blue-900 border border-blue-300'
                }`}>
                  {loginStatus.message}
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Mobile Login Modal */}
      {showMobileLoginModal && (
        <Modal onClose={() => setShowMobileLoginModal(false)} maxWidth="max-w-md">
          <div className="p-6">
            {/* Title - 중앙 정렬, X 버튼 제거 (Modal 컴포넌트 자체 제공) */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">회원 로그인</h2>
              <p className="text-slate-600 text-sm mt-1">시애라에 오신 것을 환영합니다</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">
                  이메일
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginFormData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 outline-none transition-all text-base"
                  placeholder="example@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 outline-none transition-all text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="rememberMeMobile"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-slate-600 bg-white border-slate-300 rounded focus:ring-slate-500 focus:ring-2 cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium text-slate-700">로그인 정보 저장</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('비밀번호 찾기 기능은 준비 중입니다.')}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  비밀번호 찾기
                </button>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-bold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-6"
              >
                <LogIn className="w-5 h-5" />
                로그인
              </button>
            </form>

            {/* 추가 옵션 */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-600 mb-3">
                아직 회원이 아니신가요?
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowMobileLoginModal(false);
                  navigate('/register');
                }}
                className="w-full text-slate-700 border-2 border-slate-300 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                회원가입
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70 cursor-pointer" onClick={scrollToAbout}>
        <ChevronDown size={32} strokeWidth={1} />
      </div>
    </section>
  );
};

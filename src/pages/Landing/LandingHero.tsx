import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../../components/ui/FadeIn';
import { ChevronDown, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LandingHero: React.FC = () => {
  const [loginFormData, setLoginFormData] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Main Content */}
          <div className="flex-1 text-center lg:text-left">
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
              <p className="text-gray-200 text-sm md:text-lg mb-10 max-w-2xl leading-relaxed font-light lg:mx-0 mx-auto">
                건강한 루틴과 검증된 네트워크.<br className="md:hidden" /> 
                전문직·CEO·임원들이 선택한 품격 있는 교류의 장,<br className="md:hidden" /> 
                시애라 산악회입니다.
              </p>
            </FadeIn>

            <FadeIn delay={800}>
              <button 
                onClick={scrollToAbout}
                className="inline-block border-2 border-white text-white px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                시애라 알아보기
              </button>
            </FadeIn>
          </div>

          {/* Right: Login Form */}
          <FadeIn delay={1000} className="w-full lg:w-auto flex flex-col gap-6">
            {/* Main Login Box */}
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 lg:px-16 lg:py-8 shadow-2xl max-w-3xl w-full border border-slate-700">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  회원 로그인
                </h2>
                <p className="text-white/90 text-base">
                  시애라에 오신 것을 환영합니다
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white placeholder-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-400/20 outline-none transition-all text-base"
                    placeholder="example@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    className="w-full px-5 py-3.5 rounded-xl border-2 border-slate-600 bg-slate-800/50 text-white placeholder-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-400/20 outline-none transition-all text-base"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMeHero"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-slate-400 bg-slate-800 border-slate-600 rounded focus:ring-slate-400 focus:ring-2 cursor-pointer"
                    />
                    <label htmlFor="rememberMeHero" className="ml-2 text-sm font-medium text-white cursor-pointer">
                      로그인 정보 저장
                    </label>
                  </div>
                  <a href="#" className="text-sm text-white/80 hover:text-white font-medium">
                    비밀번호 찾기
                  </a>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-white text-slate-900 py-3.5 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
                >
                  <LogIn className="w-6 h-6" />
                  로그인
                </button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-slate-900 text-white/70 font-medium">또는</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => navigate('/quick-apply')}
                  className="w-full bg-green-600 text-white text-base font-bold py-3 rounded-xl hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-md"
                >
                  간편 산행 신청
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/guest-application')}
                  className="w-full text-white hover:text-white text-base font-medium py-3 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  게스트로 산행 신청하기
                </button>
              </div>
            </div>

            {/* Development Quick Login Section */}
            <div className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-dashed border-orange-300 shadow-inner max-w-2xl w-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-900 font-bold uppercase tracking-wider">
                  ⚠️ 개발용 임시 로그인 ⚠️
                </p>
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('admin@siera.com', 'admin123');
                    if (success) navigate('/home');
                  }}
                  className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all transform hover:scale-105 shadow-md"
                >
                  👑 관리자
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('test@example.com', 'test123');
                    if (success) navigate('/home');
                  }}
                  className="px-4 py-3 bg-white border-2 border-orange-300 text-slate-900 rounded-xl text-sm font-bold hover:bg-orange-50 transition-all transform hover:scale-105 shadow-md"
                >
                  👤 일반회원
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70 cursor-pointer" onClick={scrollToAbout}>
        <ChevronDown size={32} strokeWidth={1} />
      </div>
    </section>
  );
};

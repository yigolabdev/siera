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
        <div className="flex flex-col items-center justify-center">
          {/* Main Content */}
          <div className="text-center mb-12">
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
                건강한 루틴과 검증된 네트워크.<br className="md:hidden" /> 
                전문직·CEO·임원들이 선택한 품격 있는 교류의 장,<br className="md:hidden" /> 
                시애라 산악회입니다.
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

          {/* Login Form - 최소화된 가로형 */}
          <FadeIn delay={1000} className="w-full max-w-5xl">
            {/* Compact Login Box */}
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl w-full border border-slate-700">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Left: Compact Title */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    회원 로그인
                  </h2>
                  <p className="text-white/80 text-sm">
                    시애라에 오신 것을 환영합니다
                  </p>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px h-20 bg-slate-700"></div>

                {/* Right: Compact Form */}
                <div className="flex-1 w-full">
                  <form onSubmit={handleLoginSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="email"
                        name="email"
                        value={loginFormData.email}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                        placeholder="이메일"
                        required
                      />
                      
                      <input
                        type="password"
                        name="password"
                        value={loginFormData.password}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                        placeholder="비밀번호"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="rememberMeHero"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 text-slate-400 bg-slate-800 border-slate-600 rounded focus:ring-slate-400 cursor-pointer"
                        />
                        <span className="ml-2 text-white/80">로그인 정보 저장</span>
                      </label>
                      <a href="#" className="text-white/70 hover:text-white">비밀번호 찾기</a>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        type="submit" 
                        className="bg-white text-slate-900 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="w-4 h-4" />
                        로그인
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => navigate('/quick-apply')}
                        className="bg-green-600 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-green-700 transition-all"
                      >
                        간편신청
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => navigate('/guest-application')}
                        className="text-white text-sm font-medium py-2.5 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-600"
                      >
                        게스트
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Development Quick Login - Compact */}
            <div className="mt-4 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-dashed border-orange-300 w-full">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <p className="text-xs text-orange-900 font-bold uppercase">
                  ⚠️ 개발용 임시 로그인 ⚠️
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('admin@siera.com', 'admin123');
                    if (success) navigate('/home');
                  }}
                  className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  👑 관리자
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('test@example.com', 'test123');
                    if (success) navigate('/home');
                  }}
                  className="px-3 py-2 bg-white border-2 border-orange-300 text-slate-900 rounded-lg text-xs font-bold hover:bg-orange-50 transition-all"
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

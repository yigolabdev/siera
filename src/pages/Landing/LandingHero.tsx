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

          {/* Login Form - 한 줄 레이아웃 */}
          <FadeIn delay={1000} className="w-full max-w-6xl">
            {/* Single Line Login Box */}
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl p-5 shadow-2xl w-full border border-slate-700">
              <form onSubmit={handleLoginSubmit}>
                <div className="flex flex-col md:flex-row items-center gap-3">
                  {/* Title */}
                  <div className="flex-shrink-0">
                    <h2 className="text-lg font-bold text-white whitespace-nowrap">
                      회원 로그인
                    </h2>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-8 bg-slate-700"></div>

                  {/* Email Input */}
                  <input
                    type="email"
                    name="email"
                    value={loginFormData.email}
                    onChange={handleLoginChange}
                    className="w-full md:flex-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
                    placeholder="이메일"
                    required
                  />
                  
                  {/* Password Input */}
                  <input
                    type="password"
                    name="password"
                    value={loginFormData.password}
                    onChange={handleLoginChange}
                    className="w-full md:flex-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800/50 text-white text-sm placeholder-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 outline-none transition-all"
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
                    className="w-full md:w-auto bg-white text-slate-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <LogIn className="w-4 h-4" />
                    로그인
                  </button>
                  
                  {/* Quick Apply Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/quick-apply')}
                    className="w-full md:w-auto bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-all whitespace-nowrap"
                  >
                    간편신청
                  </button>
                  
                  {/* Guest Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/guest-application')}
                    className="w-full md:w-auto text-white text-sm font-medium px-4 py-2 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-600 whitespace-nowrap"
                  >
                    게스트
                  </button>
                </div>
              </form>
            </div>

            {/* Development Quick Login - 최소화 (관리자만) */}
            <button
              type="button"
              onClick={async () => {
                const success = await login('admin@siera.com', 'admin123');
                if (success) navigate('/home');
              }}
              className="mt-3 ml-auto px-3 py-1.5 bg-orange-100 text-orange-900 rounded-lg text-xs font-bold hover:bg-orange-200 transition-all border border-orange-300 flex items-center gap-1.5"
            >
              <AlertCircle className="w-3 h-3" />
              DEV 관리자
            </button>
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

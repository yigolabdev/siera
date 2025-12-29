import { useState, useEffect } from 'react';
import { Mountain, Mail, Lock, UserPlus, Users, CalendarCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    occupation: '',
    company: '',
  });
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // 컴포넌트 마운트 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        // 로그인 정보 저장 처리
        if (rememberMe) {
          localStorage.setItem('savedEmail', formData.email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        navigate('/');
      } else {
        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        occupation: formData.occupation,
        company: formData.company,
      });
      if (success) {
        alert('회원가입 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.');
        setIsLogin(true);
      }
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=1000&fit=crop"
          alt="Mountain"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h1 className="text-6xl font-bold mb-4 tracking-tight">시애라</h1>
            <p className="text-xl text-white/80">시애라 문구 삽입 예정</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">시애라</h1>
          </div>
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {isLogin ? '로그인' : '회원가입'}
              </h2>
              <p className="text-slate-600">
                {isLogin ? '시애라에 오신 것을 환영합니다' : '회원 승인 후 이용 가능합니다'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      이름
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
                  
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      전화번호
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
                  
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">
                      직업
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
                      회사/기관
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
                </>
              )}
              
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  이메일
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
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-slate-900 bg-slate-100 border-slate-300 rounded focus:ring-slate-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-slate-700 cursor-pointer">
                    로그인 정보 저장
                  </label>
                </div>
              )}
              
              {!isLogin && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-900">
                    회원가입 신청 후 관리자 승인이 필요합니다. 승인 완료 시 이메일로 안내드립니다.
                  </p>
                </div>
              )}
              
              <button type="submit" className="btn-primary w-full">
                {isLogin ? '로그인' : '가입 신청'}
              </button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-slate-600 hover:text-slate-900 font-medium block w-full"
              >
                {isLogin ? '회원가입 하기' : '로그인으로 돌아가기'}
              </button>
              
              {isLogin && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">또는</span>
                    </div>
                  </div>
                  
                  <Link
                    to="/guest-application"
                    className="btn-secondary w-full block text-center"
                  >
                    게스트로 산행 신청하기
                  </Link>
                  
                  <Link
                    to="/quick-apply"
                    className="btn-primary w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CalendarCheck className="w-5 h-5" />
                    간편 산행 신청
                  </Link>
                  
                  <div className="mt-4 text-center">
                    <a href="#" className="text-slate-600 hover:text-slate-900 text-sm">
                      비밀번호를 잊으셨나요?
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Development Quick Login - Only show in login mode */}
          {isLogin && (
            <div className="mt-8 p-4 bg-slate-100 rounded-xl border border-slate-300">
              <p className="text-xs text-slate-600 mb-3 text-center font-medium">
                개발용 임시 로그인
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('admin@siera.com', 'admin123');
                    if (success) navigate('/');
                  }}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  관리자 로그인
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('test@example.com', 'test123');
                    if (success) navigate('/');
                  }}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  일반회원 로그인
                </button>
              </div>
            </div>
          )}
          
          <p className="text-center text-slate-500 mt-8 text-sm">
            &copy; 2026 시애라. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


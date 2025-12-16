import { useState, useEffect } from 'react';
import { Mountain, Mail, Lock, UserPlus, Users } from 'lucide-react';
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <Mountain className="h-20 w-20 mx-auto mb-6 text-primary-400" />
            <h1 className="text-5xl font-bold mb-4">시애라</h1>
            <p className="text-xl text-gray-300">함께 오르는 산, 함께 나누는 가치</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Mountain className="h-16 w-16 mx-auto mb-4 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">시애라</h1>
          </div>
          
          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? '로그인' : '회원가입'}
              </h2>
              <p className="text-gray-600 text-lg">
                {isLogin ? '시애라에 오신 것을 환영합니다' : '회원 승인 후 이용 가능합니다'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-base">
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
                    <label className="block text-gray-700 font-medium mb-2 text-base">
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
                    <label className="block text-gray-700 font-medium mb-2 text-base">
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
                    <label className="block text-gray-700 font-medium mb-2 text-base">
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
                <label className="block text-gray-700 font-medium mb-2 text-base">
                  이메일
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
                <label className="block text-gray-700 font-medium mb-2 text-base">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              {isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                    로그인 정보 저장
                  </label>
                </div>
              )}
              
              {!isLogin && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>안내:</strong> 회원가입 신청 후 관리자 승인이 필요합니다. 
                    승인 완료 시 이메일로 안내드립니다.
                  </p>
                </div>
              )}
              
              <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                {isLogin ? (
                  <>
                    <span>로그인</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>가입 신청</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-700 font-medium text-base block w-full"
              >
                {isLogin ? '회원가입 하기' : '로그인으로 돌아가기'}
              </button>
              
              {isLogin && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">또는</span>
                    </div>
                  </div>
                  
                  <Link
                    to="/guest-application"
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <Users className="h-5 w-5" />
                    <span>게스트로 산행 신청하기</span>
                  </Link>
                  
                  <div className="mt-4 text-center">
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      비밀번호를 잊으셨나요?
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Development Quick Login - Only show in login mode */}
          {isLogin && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-xs text-gray-600 mb-3 text-center font-medium">
                🔧 개발용 임시 로그인
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('admin@siera.com', 'admin123');
                    if (success) navigate('/');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  관리자 로그인
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const success = await login('test@example.com', 'test123');
                    if (success) navigate('/');
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  일반회원 로그인
                </button>
              </div>
            </div>
          )}
          
          <p className="text-center text-gray-500 mt-8 text-sm">
            &copy; 2026 시애라. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


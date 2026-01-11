import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mountain, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const navigation = [
    { name: '홈', path: '/home' },
    { name: '산행 일정', path: '/home/events' },
    { name: '사진 갤러리', path: '/home/gallery' },
    { name: '등산 정보', path: '/home/info' },
    { name: '게시판', path: '/home/board' },
    { name: '회원명부', path: '/home/members' },
    { name: '참여율', path: '/home/attendance' },
  ];
  
  const adminNavigation = [
    { name: '가입 승인', path: '/admin/approval' },
    { name: '산행 관리', path: '/admin/events' },
    { name: '조 편성 관리', path: '/admin/teams' },
    { name: '회원 관리', path: '/admin/members' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <h1 className="text-xl font-bold text-slate-900">시애라</h1>
          </Link>
          
          {/* User Menu */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/home/profile"
              className="flex items-center space-x-2 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              )}
              <span className="text-slate-700 text-sm font-medium">{user?.name || '게스트'}</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex justify-between items-center border-t border-slate-100 overflow-x-auto">
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors text-sm border-b-2 ${
                  isActive(item.path)
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Admin Navigation */}
          {isAdmin && (
            <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-slate-200">
              {adminNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors text-sm border-b-2 ${
                    isActive(item.path)
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;


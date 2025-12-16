import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mountain, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const navigation = [
    { name: '홈', path: '/' },
    { name: '산행 일정', path: '/events' },
    { name: '사진 갤러리', path: '/gallery' },
    { name: '등산 정보', path: '/info' },
    { name: '게시판', path: '/board' },
    { name: '회원명부', path: '/members' },
    { name: '참여율', path: '/attendance' },
  ];
  
  const adminNavigation = [
    { name: '산행 관리', path: '/admin/events' },
    { name: '회원 관리', path: '/admin/members' },
    { name: '조 편성 관리', path: '/admin/teams' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Mountain className="h-10 w-10 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">시애라</h1>
            </div>
          </Link>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-bold">관리자</span>
              </div>
            )}
            <Link 
              to="/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="text-gray-700 font-medium">{user?.name || '게스트'} 님</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex space-x-1 pb-3 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-base ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div className="border-l border-gray-300 mx-2"></div>
              {adminNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors text-base flex items-center space-x-1 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;


import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mountain, User, LogOut, Shield, Code, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDevMode } from '../../contexts/DevModeContext';
import { useState } from 'react';
import DevModePanel from '../DevModePanel';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { isDevMode, toggleDevMode } = useDevMode();
  const [showDevPanel, setShowDevPanel] = useState(false);
  
  const navigation = [
    { name: '홈', path: '/home' },
    { name: '산행 일정', path: '/home/events' },
    { name: '사진 갤러리', path: '/home/gallery' },
    { name: '게시판', path: '/home/board' },
    { name: '회원명부', path: '/home/members' },
    { name: '참여율', path: '/home/attendance' },
    { name: '이전 산행', path: '/home/hiking-history' },
    { name: '시애라(詩愛羅)', path: '/home/club-info' },
  ];
  
  const adminNavigation = [
    { name: '게시물 관리', path: '/admin/content' },
    { name: '입금 관리', path: '/admin/payment' },
    { name: '산행 관리', path: '/admin/events' },
    { name: '회원 관리', path: '/admin/members' },
    { name: '운영진 관리', path: '/admin/executives' },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <h1 className="flex items-baseline gap-2 text-slate-900">
              <span className="text-2xl md:text-3xl font-bold tracking-tight">시애라</span>
              <span className="text-lg md:text-xl font-medium tracking-wider">詩愛羅</span>
            </h1>
          </Link>
          
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dev & Test Buttons */}
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDevPanel(true)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs flex items-center gap-1.5 ${
                    isDevMode
                      ? 'bg-purple-600 text-white border-2 border-purple-700 shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-600 border-2 border-transparent'
                  }`}
                >
                  <Settings className={`w-3.5 h-3.5 ${isDevMode ? 'animate-spin-slow' : ''}`} />
                  DEV {isDevMode && '●'}
                </button>
                
                <Link
                  to="/dev/routing-test"
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs flex items-center gap-1.5 ${
                    isActive('/dev/routing-test')
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  TEST
                </Link>
              </div>
            )}
            
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
        <nav className="flex items-center justify-between border-t border-slate-100">
          <div className="flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors text-base border-b-2 ${
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
            <div className="flex items-center space-x-1 pl-4 border-l-2 border-blue-200">
              {adminNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2.5 font-semibold whitespace-nowrap transition-all text-sm border-b-2 ${
                    isActive(item.path)
                      ? 'border-blue-600 text-blue-700 bg-blue-50'
                      : 'border-transparent text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </div>
      
      {/* Dev Mode Panel */}
      {showDevPanel && <DevModePanel onClose={() => setShowDevPanel(false)} />}
    </header>
  );
};

export default Header;


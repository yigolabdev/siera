import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mountain, User, LogOut, Shield, Code, Settings, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          
          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
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
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100">
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
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200">
          <div className="px-4 py-3 space-y-1">
            {/* Mobile User Info */}
            <div className="flex items-center justify-between py-3 border-b border-slate-200 mb-2">
              <Link 
                to="/home/profile"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2"
              >
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-600" />
                  </div>
                )}
                <span className="text-slate-900 font-medium">{user?.name || '게스트'}</span>
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
            
            {/* Mobile Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Admin Navigation */}
            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-slate-200">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  관리자 메뉴
                </div>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Dev Buttons */}
                <div className="flex gap-2 mt-3 px-4">
                  <button
                    onClick={() => {
                      setShowDevPanel(true);
                      closeMobileMenu();
                    }}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 ${
                      isDevMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Settings className={`w-3.5 h-3.5 ${isDevMode ? 'animate-spin-slow' : ''}`} />
                    DEV {isDevMode && '●'}
                  </button>
                  
                  <Link
                    to="/dev/routing-test"
                    onClick={closeMobileMenu}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 ${
                      isActive('/dev/routing-test')
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    TEST
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Dev Mode Panel */}
      {showDevPanel && <DevModePanel onClose={() => setShowDevPanel(false)} />}
    </header>
  );
};

export default Header;


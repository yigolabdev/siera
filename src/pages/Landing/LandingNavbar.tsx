import React, { useState, useEffect } from 'react';
import { Menu, X, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // About 페이지에서는 메인 페이지로 이동
    if (location.pathname === '/about') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    // 현재 페이지가 랜딩 페이지가 아니면 먼저 홈으로 이동
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      // 이미 랜딩 페이지에 있으면 바로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4 text-slate-900' : 'bg-transparent py-6 text-white'
  }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <button onClick={scrollToTop} className="text-xl tracking-wide font-bold z-50">
          시애라클럽 <span className="text-sm font-normal">詩愛羅</span>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
          <button onClick={() => scrollToSection('heritage')} className="hover:opacity-70 transition-opacity">소개</button>
          <button onClick={() => scrollToSection('program')} className="hover:opacity-70 transition-opacity">프로그램</button>
          <button onClick={() => scrollToSection('trust')} className="hover:opacity-70 transition-opacity">멤버십</button>
          <button onClick={() => scrollToSection('faq')} className="hover:opacity-70 transition-opacity">FAQ</button>
        </div>

        {/* Desktop Signup Button */}
        <div className="hidden md:block">
           <button 
            onClick={() => navigate('/register')}
            className={`px-6 py-2 text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${isScrolled ? 'border-slate-900 hover:bg-slate-900 hover:text-white' : 'border-white hover:bg-white hover:text-slate-900'}`}
          >
           <UserPlus className="w-4 h-4" />
           입회신청
         </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={isScrolled ? 'text-slate-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-slate-900 text-white flex flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => { scrollToSection('heritage'); setIsMobileMenuOpen(false); }} className="text-2xl font-light">소개</button>
        <button onClick={() => { scrollToSection('program'); setIsMobileMenuOpen(false); }} className="text-2xl font-light">프로그램</button>
        <button onClick={() => { scrollToSection('trust'); setIsMobileMenuOpen(false); }} className="text-2xl font-light">멤버십</button>
        <button onClick={() => { scrollToSection('faq'); setIsMobileMenuOpen(false); }} className="text-2xl font-light">FAQ</button>
        <button 
          onClick={() => {
            setIsMobileMenuOpen(false);
            navigate('/register');
          }} 
          className="mt-8 px-8 py-3 bg-white text-slate-900 text-sm font-bold tracking-widest uppercase flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          입회신청하기
        </button>
      </div>
    </nav>
  );
};

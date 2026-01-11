import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LandingNavbar } from './Landing/LandingNavbar';
import { LandingHero } from './Landing/LandingHero';
import { LandingTargeting } from './Landing/LandingTargeting';
import { LandingProgram } from './Landing/LandingProgram';
import { LandingTrust } from './Landing/LandingTrust';
import { LandingHeritage } from './Landing/LandingHeritage';
import { LandingFAQCTA } from './Landing/LandingFAQCTA';
import { LandingFooter } from './Landing/LandingFooter';

export default function Landing() {
  const location = useLocation();

  useEffect(() => {
    // location.state에서 scrollTo 값을 확인
    const scrollTo = (location.state as { scrollTo?: string })?.scrollTo;
    
    if (scrollTo) {
      // 페이지 렌더링이 완료된 후 스크롤
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
      // state 초기화 (뒤로가기 시 다시 스크롤되지 않도록)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <main className="bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      <LandingNavbar />
      <LandingHero />
      <LandingTargeting />
      <LandingProgram />
      <LandingTrust />
      <LandingHeritage />
      <LandingFAQCTA />
      <LandingFooter />
    </main>
  );
}

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
import SEOHead from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContextEnhanced';

export default function Landing() {
  const location = useLocation();
  const { isLoading: authLoading } = useAuth();

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

  // 인증 세션 확인 중: 스플래시 스크린만 표시 (다른 섹션 렌더링 방지)
  if (authLoading) {
    return (
      <main className="bg-slate-900 min-h-screen">
        <LandingHero />
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      <SEOHead
        path="/"
        description="2005년 창립, 21년 전통의 하이 트러스트 등산 커뮤니티. CEO·임원·전문직 리더들이 산행을 통해 심신을 단련하고 신뢰 네트워크를 구축하는 품격 있는 교류의 장."
      />
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

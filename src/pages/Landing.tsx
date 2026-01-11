import React from 'react';
import { LandingNavbar } from './Landing/LandingNavbar';
import { LandingHero } from './Landing/LandingHero';
import { LandingTargeting } from './Landing/LandingTargeting';
import { LandingProgram } from './Landing/LandingProgram';
import { LandingTrust } from './Landing/LandingTrust';
import { LandingHeritage } from './Landing/LandingHeritage';
import { LandingFAQCTA } from './Landing/LandingFAQCTA';
import { LandingFooter } from './Landing/LandingFooter';

export default function Landing() {
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

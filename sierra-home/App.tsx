import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Targeting } from './components/Targeting';
import { Program } from './components/Program';
import { Trust } from './components/Trust';
import { Heritage } from './components/Heritage';
import { FAQCTA } from './components/FAQCTA';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <main className="bg-white min-h-screen selection:bg-slate-900 selection:text-white">
      <Navbar />
      <Hero />
      <Targeting />
      <Program />
      <Trust />
      <Heritage />
      <FAQCTA />
      <Footer />
    </main>
  );
};

export default App;
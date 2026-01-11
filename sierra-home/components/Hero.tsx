import React from 'react';
import { FadeIn } from './ui/FadeIn';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop" 
          alt="Majestic Mountain Range" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
        <FadeIn delay={200}>
          <h2 className="text-white/90 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
            2005 ~ 2026 Heritage
          </h2>
        </FadeIn>
        
        <FadeIn delay={400}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            리더들을 위한<br />
            하이 트러스트 커뮤니티
          </h1>
        </FadeIn>

        <FadeIn delay={600}>
          <p className="text-gray-200 text-sm md:text-lg mb-10 max-w-2xl leading-relaxed font-light">
            건강한 루틴과 검증된 네트워크.<br className="md:hidden" /> 
            전문직·CEO·임원들이 선택한 품격 있는 교류의 장,<br className="md:hidden" /> 
            시애라 산악회입니다.
          </p>
        </FadeIn>

        <FadeIn delay={800}>
          <a 
            href="#apply" 
            className="inline-block border-2 border-white text-white px-10 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            멤버십 가입 상담 신청하기
          </a>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 z-10 animate-bounce text-white/70">
        <ChevronDown size={32} strokeWidth={1} />
      </div>
    </section>
  );
};
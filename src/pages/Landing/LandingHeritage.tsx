import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../../components/ui/FadeIn';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const LandingHeritage: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 슬라이드 이미지들 (산행 관련 이미지)
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=500&fit=crop',
      alt: '산악회 단체 사진 1',
    },
    {
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
      alt: '산악회 산행 모습 1',
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
      alt: '산악회 산행 모습 2',
    },
    {
      url: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=500&fit=crop',
      alt: '산악회 산행 모습 3',
    },
  ];

  // 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4초마다 변경

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <section id="heritage" className="relative py-32 bg-slate-900 text-white overflow-hidden">
      {/* Background Texture/Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2670&auto=format&fit=crop" 
          alt="Misty Mountain Forest" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-12 md:mb-0">
          <FadeIn>
            <span className="block text-emerald-500 font-mono mb-4 text-sm tracking-widest">EST. 2005</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium leading-tight mb-8 text-white">
              2005년부터 이어온<br />
              리더들의 이야기
            </h2>
            <div className="w-20 h-1 bg-white mb-8"></div>
            <p className="text-white text-lg leading-relaxed max-w-md">
              시애라 산악회는 삼성경제연구소(SERI)의 CEO및 리더층 대상 지식 서비스 플랫폼인 SERICEO 에서 시작하여 각 분야의 리더들과 함께 성장해왔습니다.
              <br /><br />
              단순한 동호회가 아닙니다.<br />
              21년간 수천명의 리더들이 지켜온 신뢰와 존중의 문화를 이제 당신과 나눕니다.
            </p>
          </FadeIn>
        </div>

        <div className="md:w-1/2 flex justify-end">
           {/* Abstract Visual Representation of History */}
           <FadeIn delay={300} className="relative">
              <div className="border border-white/20 p-8 md:p-12 bg-white/5 backdrop-blur-sm max-w-sm">
                <p className="font-serif italic text-2xl mb-4 text-white">"High-Trust"</p>
                <p className="text-sm text-white mb-6">
                  우리가 지키는 가장 중요한 가치입니다. <br/>
                  역사는 하루아침에 만들어지지 않습니다.
                </p>
                <button
                  onClick={() => navigate('/about')}
                  className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  <span>자세히 알아보기</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full border border-white/10 -z-10"></div>
           </FadeIn>
        </div>
      </div>

      {/* Image Slider Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-20">
        <FadeIn delay={600}>
          <div className="relative group">
            {/* Slider Container */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full relative flex-shrink-0"
                  >
                    <img
                      src={slide.url}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="이전 슬라이드"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="다음 슬라이드"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`슬라이드 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-white/70 text-sm mt-4">
              시애라 산악회의 소중한 순간들
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

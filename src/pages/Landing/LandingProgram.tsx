import React from 'react';
import { FadeIn } from '../../components/ui/FadeIn';
import { Bus, Mountain, Wine, Home } from 'lucide-react';

const steps = [
  {
    time: '07:15',
    title: '전세버스 출발',
    desc: '종합운동장역 집결. 운전 피로 없이 편안하게 이동합니다.',
    icon: <Bus className="w-6 h-6" />,
  },
  {
    time: '10:00',
    title: '맞춤형 산행 (A/B조)',
    desc: '전문가 동행. 7~8km A코스 또는 가벼운 산책 B코스 선택.',
    icon: <Mountain className="w-6 h-6" />,
  },
  {
    time: '15:00',
    title: '품격 있는 교류',
    desc: '하산 후 로컬 맛집에서의 깔끔한 식사와 대화.',
    icon: <Wine className="w-6 h-6" />,
  },
  {
    time: '18:00',
    title: '서울 복귀',
    desc: '저녁 시간 보장. 주말을 완벽하게 마무리합니다.',
    icon: <Home className="w-6 h-6" />,
  },
];

export const LandingProgram: React.FC = () => {
  return (
    <section id="program" className="py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left: Text Content */}
          <div className="md:w-1/3 md:sticky md:top-32">
            <FadeIn>
              <h4 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-3">Solution</h4>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                서울 도심 집결부터<br />
                귀가까지,<br />
                완벽하게 설계된<br />
                시스템
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                복잡한 준비는 필요 없습니다.<br />
                바쁜 리더들을 위해 모든 과정을 최적화했습니다.<br />
                가벼운 복장으로 '몸'만 오십시오.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <h5 className="font-bold mb-2">Check Point</h5>
                <ul className="text-sm space-y-2 text-slate-600">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2"></span>
                    체력이 약해도 B코스로 참여 가능
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2"></span>
                    단독 이탈 금지 등 철저한 안전 시스템
                  </li>
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Right: Vertical Timeline */}
          <div className="md:w-2/3 w-full">
            <div className="relative border-l border-slate-200 ml-4 md:ml-8 space-y-12">
              {steps.map((step, index) => (
                <FadeIn key={index} delay={index * 150} direction="up">
                  <div className="relative pl-12 md:pl-16">
                    {/* Dot/Icon */}
                    <div className="absolute -left-5 top-0 bg-white border border-slate-200 p-2 rounded-full text-slate-900 shadow-sm">
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                      <span className="font-mono text-slate-400 font-medium">{step.time}</span>
                    </div>
                    <p className="text-slate-600">{step.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            
            <FadeIn delay={600} className="mt-16 pl-12 md:pl-16">
               <img 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1600&auto=format&fit=crop" 
                alt="Hiking Atmosphere" 
                className="w-full h-64 md:h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700"
               />
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

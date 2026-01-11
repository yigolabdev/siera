import React from 'react';
import { FadeIn } from './ui/FadeIn';
import { ShieldCheck, UserCheck, XCircle } from 'lucide-react';

export const Targeting: React.FC = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
              월 1회.<br />
              하루를 비우면, 삶이 다시 정렬됩니다.
            </h2>
            <p className="text-slate-400 text-sm md:text-base font-light">
              우리는 아무나 환영하지 않습니다. <br className="md:hidden"/> 오직 비슷한 결을 가진 리더들만의 리그를 지향합니다.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Card 1: WHO */}
          <FadeIn delay={100} className="flex flex-col items-center text-center p-6 border border-slate-800 bg-slate-900/50">
            <div className="mb-6 p-4 rounded-full bg-slate-900 border border-slate-700 text-emerald-400">
              <UserCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-white">WHO</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              의사, 변호사, 회계사, 교수,<br />
              기업 임원 및 대표.
            </p>
            <div className="mt-4 w-12 h-[1px] bg-slate-700"></div>
          </FadeIn>

          {/* Card 2: NOT */}
          <FadeIn delay={300} className="flex flex-col items-center text-center p-6 border border-slate-800 bg-slate-900/50">
            <div className="mb-6 p-4 rounded-full bg-slate-900 border border-slate-700 text-red-400">
              <XCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-white">NOT</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              과도한 영업 행위,<br />
              정치적 논쟁, 불편한 술자리<br />
              <span className="text-red-400 font-medium">절대 금지</span>
            </p>
            <div className="mt-4 w-12 h-[1px] bg-slate-700"></div>
          </FadeIn>

          {/* Card 3: ONLY */}
          <FadeIn delay={500} className="flex flex-col items-center text-center p-6 border border-slate-800 bg-slate-900/50">
            <div className="mb-6 p-4 rounded-full bg-slate-900 border border-slate-700 text-blue-400">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-white">ONLY</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              오직 서로를 존중하는<br />
              리더들의 '건강한 루틴'과<br />
              '편안한 섞임'만이 존재합니다.
            </p>
            <div className="mt-4 w-12 h-[1px] bg-slate-700"></div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { FadeIn } from './ui/FadeIn';

export const Trust: React.FC = () => {
  return (
    <section id="trust" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-4 text-slate-900">좋은 커뮤니티는 시스템으로 증명됩니다.</h2>
          <p className="text-slate-600 mb-16">
            모호한 운영은 불신을 낳습니다. <br className="md:hidden" />
            우리는 3가지 원칙(3-Trust)을 철저히 지킵니다.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Item 1 */}
          <FadeIn delay={100} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border-t-2 border-slate-900">
            <h3 className="text-lg font-bold mb-3">01. 투명한 정산</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              매 행사 직후 P&L(손익) 요약을 회원들에게 100% 공유합니다. 영수증 하나까지 투명하게 관리합니다.
            </p>
          </FadeIn>

          {/* Item 2 */}
          <FadeIn delay={200} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border-t-2 border-slate-900">
            <h3 className="text-lg font-bold mb-3">02. 엄격한 가드레일</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              영업, 투자 권유, 강매 적발 시 즉시 제명합니다. 회원의 개인정보는 운영 목적 외 절대 사용하지 않습니다.
            </p>
          </FadeIn>

          {/* Item 3 */}
          <FadeIn delay={300} className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border-t-2 border-slate-900">
            <h3 className="text-lg font-bold mb-3">03. 예측 가능한 비용</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              2026년 기준 연회비 25만원, 월 참가비 6만원. 모든 비용은 버스 대절, 답사, 안전 운영에만 사용됩니다.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
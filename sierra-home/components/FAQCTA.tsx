import React from 'react';
import { FadeIn } from './ui/FadeIn';
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';

export const FAQCTA: React.FC = () => {
  return (
    <section id="faq" className="py-24 bg-white text-slate-900">
      <div className="max-w-3xl mx-auto px-6">
        {/* FAQ */}
        <div className="mb-24">
          <FadeIn>
            <h2 className="text-2xl font-bold mb-8 border-b border-black pb-4">자주 묻는 질문</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-slate-400 mr-2">Q.</span> 
                  혼자 가도 되나요?
                </h3>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  A. 네, 그렇습니다. 등력에 맞는 A/B조 운영과 조별운영 시스템으로 자연스럽게 어울리도록 설계되어 있어 소외감 없이 참여하실 수 있습니다.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center">
                  <span className="text-slate-400 mr-2">Q.</span> 
                  체력이 약한데 괜찮나요?
                </h3>
                <p className="text-slate-600 pl-6 leading-relaxed">
                  A. 걱정하지 않으셔도 됩니다. 매 산행 시 난이도가 낮은 B조(둘레길 수준)를 별도로 운영하며, 전문 산악대장님이 안전을 책임집니다. 본인의 컨디션에 맞게 선택하시면 됩니다.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* CTA */}
        <div id="apply" className="text-center">
          <FadeIn delay={200}>
            <div className="bg-slate-900 text-white p-10 md:p-16 rounded-sm shadow-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                검증된 리더를 기다립니다.
              </h2>
              <p className="text-slate-300 mb-10">
                기존 회원 추천 및 운영진 확인 후 가입이 승인됩니다.<br />
                소수 정예 운영을 위한 절차이오니 양해 부탁드립니다.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <button className="flex items-center justify-center bg-white text-slate-900 px-8 py-4 font-bold uppercase tracking-wide hover:bg-slate-100 transition-colors">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  카카오톡 상담 신청
                </button>
                <button className="flex items-center justify-center border border-white text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5 mr-2" />
                  이메일 문의하기
                </button>
              </div>
              
              <p className="mt-6 text-xs text-slate-500">
                * 평일 09:00 - 18:00 순차 답변 드립니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
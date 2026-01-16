import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeIn } from '../../components/ui/FadeIn';
import { UserPlus, ArrowRight } from 'lucide-react';

export const LandingFAQCTA: React.FC = () => {
  const navigate = useNavigate();

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
                  등산초보자인데 괜찮나요?
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
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-12 md:p-16 rounded-xl shadow-2xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="inline-block px-4 py-2 bg-emerald-500/20 rounded-full mb-6">
                  <span className="text-emerald-400 text-sm font-bold tracking-wider">MEMBERSHIP</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  검증된 리더를 기다립니다.
                </h2>
                
                <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                  게스트로 산행 참여하신 후,<br />
                  운영진의 심의를 거쳐 회원 입회가 승인됩니다.<br />
                  소수 정예 운영을 위한 절차이오니 양해 부탁드립니다.
                </p>
                
                <button 
                  onClick={() => navigate('/register')}
                  className="group relative inline-flex items-center justify-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <UserPlus className="w-6 h-6" />
                  <span>입회신청하기</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-slate-400">
                    이미 회원이신가요?{' '}
                    <button 
                      onClick={() => navigate('/')}
                      className="text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-400/30 hover:decoration-emerald-300 transition-colors"
                    >
                      로그인하기
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

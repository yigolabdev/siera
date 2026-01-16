import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { LandingNavbar } from './Landing/LandingNavbar';
import { LandingFooter } from './Landing/LandingFooter';
import { FadeIn } from '../components/ui/FadeIn';

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingNavbar />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <FadeIn>
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-slate-600 hover:text-slate-900 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로 가기
          </button>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-slate-900 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">이용약관</h1>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제1조 (목적)</h2>
                <p className="text-slate-700 leading-relaxed">
                  본 약관은 시애라 클럽(이하 "본회")이 제공하는 산행 활동 및 관련 서비스의 이용과 관련하여 본회와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제2조 (회원의 정의)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>"회원"이라 함은 본회에 입회 신청을 하여 운영위원회의 승인을 받은 자를 말합니다.</li>
                  <li>"게스트"라 함은 정기산행에 2회까지 참여할 수 있는 비회원을 말합니다.</li>
                  <li>"운영진"이라 함은 본회의 운영을 담당하는 회장, 운영위원장, 등산대장, 운영감사, 재무감사 등을 말합니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제3조 (회원가입)</h2>
                <ol className="list-decimal list-inside space-y-3 text-slate-700">
                  <li>회원가입을 희망하는 자는 본회가 정한 가입신청서를 작성하여 제출하여야 합니다.</li>
                  <li>게스트로 정기산행에 2회 참여한 후, 운영위원회의 심의를 거쳐 입회가 승인됩니다.</li>
                  <li>본회는 다음 각 호에 해당하는 경우 회원가입을 승인하지 않을 수 있습니다:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>가입신청서의 내용을 허위로 기재한 경우</li>
                      <li>본회의 설립 목적과 활동에 부합하지 않는 경우</li>
                      <li>과거 제명 이력이 있는 경우</li>
                    </ul>
                  </li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제4조 (회원의 권리와 의무)</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">1. 회원의 권리</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>본회가 주최하는 정기산행 및 특별산행에 참여할 권리</li>
                      <li>본회의 운영에 관한 의견을 제시할 권리</li>
                      <li>본회의 시설 및 자료를 이용할 권리</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2. 회원의 의무</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                      <li>본회의 회칙 및 제 규정을 준수할 의무</li>
                      <li>연회비 및 산행 참가비를 납부할 의무</li>
                      <li>산행 시 안전수칙을 준수하고 다른 회원을 배려할 의무</li>
                      <li>본회의 명예를 훼손하는 행위를 하지 않을 의무</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제5조 (윤리규범)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  회원은 다음 각 호의 행위를 하여서는 안 됩니다:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>회원 간 영업 또는 투자 권유 행위</li>
                  <li>회원의 개인정보를 무단으로 수집하거나 이용하는 행위</li>
                  <li>종교, 정치 등 특정 목적을 위한 활동</li>
                  <li>다른 회원에게 불쾌감을 주는 언행</li>
                  <li>본회의 운영을 방해하는 행위</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제6조 (회비)</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>회원은 본회가 정한 연회비를 납부하여야 합니다.</li>
                  <li>산행 참가 시 참가비를 별도로 납부하여야 합니다.</li>
                  <li>납부된 회비는 원칙적으로 반환하지 않습니다. 단, 천재지변 등 불가항력적인 사유로 산행이 취소된 경우 참가비는 전액 환불합니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제7조 (안전관리)</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>본회는 산행의 안전을 위해 최선을 다하나, 개인의 부주의로 인한 사고에 대해서는 책임을 지지 않습니다.</li>
                  <li>회원은 자신의 건강 상태를 정확히 파악하고, 산행 참가 가능 여부를 스스로 판단하여야 합니다.</li>
                  <li>산행 중 등산대장 및 조장의 지시에 따라야 하며, 안전수칙을 준수하여야 합니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제8조 (징계)</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>본회는 회원이 본 약관 또는 회칙을 위반한 경우 징계할 수 있습니다.</li>
                  <li>징계의 종류는 경고, 활동정지, 제명으로 구분됩니다.</li>
                  <li>징계는 운영위원회의 심의를 거쳐 결정됩니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제9조 (탈퇴 및 자격상실)</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>회원은 언제든지 탈퇴를 신청할 수 있으며, 본회는 즉시 회원 탈퇴를 처리합니다.</li>
                  <li>회원이 다음 각 호에 해당하는 경우 자격을 상실합니다:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>제명 처분을 받은 경우</li>
                      <li>연회비를 2년 이상 체납한 경우</li>
                    </ul>
                  </li>
                  <li>탈퇴 또는 자격상실 시 개인정보는 즉시 파기됩니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제10조 (약관의 변경)</h2>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>본회는 필요한 경우 본 약관을 변경할 수 있습니다.</li>
                  <li>약관이 변경되는 경우, 변경 내용과 적용일자를 명시하여 적용일자 7일 전부터 공지합니다.</li>
                  <li>회원이 변경된 약관에 동의하지 않을 경우 탈퇴를 신청할 수 있습니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">부칙</h2>
                <p className="text-slate-700 leading-relaxed">
                  본 약관은 2005년 2월 1일부터 시행합니다.<br />
                  최종 개정일: 2026년 1월 1일
                </p>
              </section>
            </div>
          </div>
        </FadeIn>
      </div>

      <LandingFooter />
    </div>
  );
};

export default Terms;

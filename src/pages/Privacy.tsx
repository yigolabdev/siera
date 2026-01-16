import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { LandingNavbar } from './Landing/LandingNavbar';
import { LandingFooter } from './Landing/LandingFooter';
import { FadeIn } from '../components/ui/FadeIn';

const Privacy = () => {
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
              <div className="p-3 bg-blue-600 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">개인정보처리방침</h1>
            </div>

            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <p className="text-slate-700 leading-relaxed mb-4">
                  시애라 클럽(이하 "본회")은 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제1조 (개인정보의 처리 목적)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  본회는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>회원 입회 심사 및 관리</li>
                  <li>산행 신청 접수 및 참가자 관리</li>
                  <li>산행 관련 연락 및 공지사항 전달</li>
                  <li>회비 수납 및 정산</li>
                  <li>비상 상황 발생 시 긴급 연락</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제2조 (개인정보의 처리 및 보유 기간)</h2>
                <ol className="list-decimal list-inside space-y-3 text-slate-700">
                  <li>본회는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</li>
                  <li>구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>회원 정보: 회원 탈퇴 시까지</li>
                      <li>산행 참가 기록: 참가일로부터 1년</li>
                      <li>회비 납부 기록: 관계 법령에 따라 5년</li>
                    </ul>
                  </li>
                  <li>회원 탈퇴 시 개인정보는 즉시 파기됩니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관합니다.</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제3조 (처리하는 개인정보의 항목)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  본회는 다음의 개인정보 항목을 처리하고 있습니다:
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">1. 회원가입 및 관리</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                      <li>필수항목: 이름, 성별, 출생연도, 이메일, 연락처, 소속, 직책</li>
                      <li>선택항목: 프로필 사진, 자기소개, 산행 경력</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2. 산행 신청 및 참가</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                      <li>필수항목: 이름, 연락처, 비상연락처</li>
                      <li>선택항목: 산행 능력, 특이사항</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">3. 회비 납부</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                      <li>필수항목: 이름, 입금자명</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제4조 (개인정보의 제3자 제공)</h2>
                <p className="text-slate-700 leading-relaxed">
                  본회는 원칙적으로 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제5조 (개인정보처리의 위탁)</h2>
                <p className="text-slate-700 leading-relaxed">
                  본회는 현재 개인정보 처리업무를 외부에 위탁하고 있지 않습니다. 향후 개인정보 처리업무를 위탁하는 경우, 위탁 업체와 위탁 업무 내용을 본 개인정보처리방침에 공개하도록 하겠습니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제6조 (정보주체의 권리·의무 및 행사방법)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  정보주체는 본회에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>개인정보 열람 요구</li>
                  <li>오류 등이 있을 경우 정정 요구</li>
                  <li>삭제 요구</li>
                  <li>처리정지 요구</li>
                </ol>
                <p className="text-slate-700 leading-relaxed mt-3">
                  위 권리 행사는 본회에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 본회는 이에 대해 지체없이 조치하겠습니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제7조 (개인정보의 파기)</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">1. 파기 절차</h3>
                    <p className="text-slate-700 leading-relaxed ml-4">
                      회원이 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">2. 파기 방법</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4">
                      <li>전자적 파일 형태: 복구 및 재생되지 않도록 기술적 방법을 사용하여 완전히 삭제</li>
                      <li>종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제8조 (개인정보의 안전성 확보조치)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  본회는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                  <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 보안프로그램 설치</li>
                  <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제9조 (개인정보 보호책임자)</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  본회는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
                </p>
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <p className="text-slate-700 space-y-1">
                    <strong>개인정보 보호책임자</strong><br />
                    성명: 이응정 (운영위원장)<br />
                    연락처: 문의는 회원 로그인 후 게시판을 통해 가능합니다.<br />
                  </p>
                </div>
                <p className="text-slate-700 leading-relaxed mt-4">
                  정보주체는 본회의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 본회는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">제10조 (개인정보 처리방침의 변경)</h2>
                <p className="text-slate-700 leading-relaxed">
                  이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-200">부칙</h2>
                <p className="text-slate-700 leading-relaxed">
                  본 방침은 2005년 2월 1일부터 시행합니다.<br />
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

export default Privacy;

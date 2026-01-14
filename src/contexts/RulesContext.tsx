import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

interface RulesContextType {
  rulesContent: string;
  updateRules: (content: string) => void;
}

const RulesContext = createContext<RulesContextType | undefined>(undefined);

// 초기 회칙 내용 (이미지 기반)
const initialRulesContent = `제 1장. 총칙

제 1조 (명칭): 본회는 '시애라 산악회'(영문명: Sierra 또는 詩愛羅)를 연다.

제 2조 (목적): 본회는 대한민국의 산업계, 학계/연구계, 및 정부/공공부문의 리더들이 등산활동을 통하여 심신의 산업인으로서 회원들의 산행에 따른 기초체력 산양한 전문적 지식을 도모함을 그 목적으로 한다.

제 3조 (사업): 본회는 그 목적을 달성하기 위하여 다음의 사업을 수행한다.
(1) 정기산행은 매월 1회 당일 산행으로 실시하며, 이 중 1회는 1박2일 일정으로 실시한다.
(2) 해외산행은 연 1회 실시할 수 있다.
(3) 산행 목적에 부합하는 문화행사, 친목행사, 또는 사회봉사활동을 실시할 수 있다.
(4) 재 3조 제 1항 내지 3항의 사업은 회칙에 정하는 철차에 따라 기획시행하며, 그 결과를 회원에게 보고한다.


제 2장. 회원

제 4조 (자격 및 입회절차):
(1) 본회의 회원은 본회의 목적에 공감하고 이를 실행하며, 본회가 정하는 바에 따라 입회한 만 25세 이상의 성인을 말한다.
(2) 회원의 자격은 매월 1일 및 제 4조 1항에 정한 기준을 충족하여 정산된다.
(3) 입회를 희망하는 자는 본회의 정기산행에 1회 이상 참가한 후, 운영위원회의 심의를 거쳐 그 입회여부가 결정된다. 산업위원회는 입회절차 중에 심의적 이유 또는 위임할 필요가 없을 경우 이유를 밝혀 그 결정을 위임할 수 있으며, 최종 결과 그 취지를 회장에 보고한다. 본회의 불합격은 1월 및 타당성이 없는 사유에 신입회원을 입회시키기 거기 제 회윈의 권리 거지 및 그 취소를 그 법정하여야 한다.

제 5조 (권리):
(1) 본회가 주최하는 산행 및 대회 행사에 참여할 권리
(2) 본회의 운영에 관하여 권리 및 발언권
(3) 본회의 문서 내용에 대한 열람 권리
(4) 본회의 목적에 부합할 기타 해택을 받을 권리

제 6조 (의무):
(1) 본회의 회칙 및 대외업무위의 운영위원회의 제 의결사항을 준수하여야 한다.
(2) 본회가 주최하는 사업에 능동적으로 참여하여야 한다.
(3) 소정의 회비를 납부하여야 한다.`;

export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const [rulesContent, setRulesContent] = useState(initialRulesContent);

  const updateRules = useCallback((content: string) => {
    setRulesContent(content);
  }, []);

  const value = useMemo(
    () => ({
      rulesContent,
      updateRules,
    }),
    [rulesContent, updateRules]
  );

  return (
    <RulesContext.Provider value={value}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = () => {
  const context = useContext(RulesContext);
  if (context === undefined) {
    throw new Error('useRules must be used within a RulesProvider');
  }
  return context;
};

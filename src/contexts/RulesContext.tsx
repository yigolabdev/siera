import { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { getDocuments, setDocument, updateDocument } from '../lib/firebase/firestore';
import { logError, ErrorLevel, ErrorCategory } from '../utils/errorHandler';
import { RulesData, RulesAmendment } from '../types';
import { waitForFirebase } from '../lib/firebase/config';

interface RulesContextType {
  rulesData: RulesData;
  isLoading: boolean;
  error: string | null;
  updateRules: (content: string, version: string, effectiveDate: string) => Promise<void>;
  addAmendment: (amendment: RulesAmendment) => Promise<void>;
  refreshRules: () => Promise<void>;
}

const RulesContext = createContext<RulesContextType | undefined>(undefined);

// 초기 회칙 내용 (완전판) - Firebase에 없을 때 사용
const initialRulesContent = `# 제 1장. 총칙

## 제 1조 (명칭)
본회는 '시애라'라 칭하며, 한문명은 '詩愛羅,' 영문명은 'Sierra'로 한다.

## 제 2조 (목적)
본회는 대한민국의 산업계, 학계/연구기관, 및 정부/공공기관 리더들의 등산동호회로서 회원들이 산행을 통하여 심신을 단련하고 회원 상호간 친목과 협력을 도모함을 그 목적으로 한다.

## 제 3조 (사업)
본회는 그 목적을 달성하기 위하여 다음의 사업을 추진한다.

1. 정기산행을 매월 1회 당일 산행으로 실시하되, 이 중 1회는 1박2일 일정으로 실시한다.
2. 해외산행을 연 1회 실시할 수 있다.
3. 본회의 목적에 부합하는 문화행사, 친목행사, 또는 사회공헌활동을 실시할 수 있다.
4. 제3조 1항 내지 3항의 사업은 회칙이 정하는 절차에 따라 기획·시행하며, 그 결과를 회원에게 보고한다.

---

# 제 2장. 회원

## 제 4조 (자격 및 입회절차)
1. 본회의 회원은 본회의 목적에 공감하고 이를 실행하며, 본회가 정하는 바에 따른 연회비를 납부한 자로 한다.
2. 회원의 자격은 매해 1월 1일 제 4조 1항에 정한 기준을 적용하여 갱신된다.
3. 입회를 희망하는 자는 본회의 정기산행에 1회 이상 참여한 후, 운영위원회의 심의를 거쳐 그 입회여부가 결정된다. 신입회원의 연령은 입회일 기준 만 25세 이상, 만 65세 이하로 한정한다. 본회의 활동을 1월 정기산행 이후 시작한 신입회원은 입회시기에 따라 월할 계산된 연회비를 납부한다.

## 제 5조 (권리)
1. 본회가 주최하는 산행 및 여타 행사에 참여할 권리
2. 본회의 운영에 참여할 권리 및 발언권
3. 본회의 운영 내용에 대한 알 권리
4. 본회의 목적에 부합된 기타 혜택을 받을 권리

## 제 6조 (의무)
1. 본회의 회칙 및 대의원회의와 운영위원회의 제 의결사항을 준수하여야 한다.
2. 본회가 주최하는 사업에 능동적으로 참여하여야 한다.
3. 소정의 회비를 납부하여야 한다.

## 제 7조 (징계 및 제명)
본회의 회원 중 제 2조에 명시된 본회의 목적을 위배하거나 제 4조의 자격 요건 또는 제 6조의 의무를 이행하지 않는 경우 대의원회의의 결의에 의해 징계 또는 제명할 수 있다.

---

# 제 3장. 운영조직 구성

## 제 8조 (임원)
1. 회장은 본회를 대표하며, 회무를 총괄하고, 운영위원회와 대의원회의의 의장이 된다.
2. 운영감사는 업무집행 전반과 회원의 의무이행 여부를 감사하며, 재무감사는 회계 정보를 평가하고 감사한다.
3. 운영위원장은 회장을 보좌하며, 회장 부재 시 그 직무를 대행한다. 본회의 운영 전반에 관한 실무를 총괄한다.
4. 등산대장은 등산 전문가로서 산행지 및 산행코스를 선정하고, 위험을 예측하고 대비하며, 산행 중 회원들을 통솔하고 안전을 책임지는 역할을 한다. 등산대장은 운영위원회에 산행 계획안 및 준비상황을 사전에 공유하고 업무집행에 적극 협조한다.
5. 재무위원은 본회의 재무업무를 총괄하고 회칙이 정하는 바에 따라 회계보고를 한다.
6. 기타 운영위원(5인 내외)은 회장과 운영위원장을 도와 사업기획과 업무집행에 적극 참여한다.

## 제 9조 (운영위원회)
1. 운영위원회는 본회의 운영 주체로서 주요 사업, 회원관리, 및 예산집행을 심의하고 집행한다. 운영위원회는 연초에 연간 사업계획과 일정을 전체 회원들에게 공지한다.
2. 운영위원회는 회장, 운영위원장, 등산대장, 재무위원, 및 기타 운영위원 5명 내외로 구성된다. 감사 2인은 운영위원회에 참석할 권리와 의무를 지닌다. 운영위원회 구성원은 수시로 의견을 조율하며, 업무분담이 원활하게 되도록 노력한다.

## 제 10조 (선출 및 임기)
1. 회장, 감사 2인, 및 운영위원장은 대의원회의의 선거를 통해 선출한다.
2. 회장 및 감사 2인의 임기는 2년이고, 1년 단위로 연임할 수 있다. 운영위원장의 임기는 1년이고, 1년 단위로 연임할 수 있다.
3. 등산대장은 운영위원회에서 위촉하고 대의원회의에서 인준하며, 임기는 2년이고, 1년 단위로 연임할 수 있다.
4. 재무위원과 기타 운영위원은 회장과 운영위원장이 회원의 대표성을 고려하여 협의한 후 위촉하며, 대의원회의에서 인준한다.

---

# 제 4장. 대의원회의

## 제 11조 (구성과 성립)
1. 대의원회의는 본회의 최고 의결 기구이며, 회장, 감사, 및 운영위원장을 선출하고, 재무위원과 기타 운영위원의 선임을 인준하며, 본회의 예산집행, 결산보고, 및 제반 사업을 심의하고 의결하며, 필요한 경우 회칙을 개정할 수 있다.
2. 대의원은 회원 중 최근 12개월(전년도 11월부터 당해연도 10월까지)의 정기산행 참여율이 40% (당일 정기산행은 1회, 1박2일 산행은 2회, 해외산행은 3회로 산술하여 총 15회 중 6회) 이상인 회원으로 한다. 회장은 매해 10월 정기산행 직후 이 기준을 적용하여 각 회원의 대의원 자격여부를 구분하여 새로운 대의원회의를 구성하며, 그 임기는 1년이다.
3. 대의원은 대의원회의에서 발언권, 발의권, 의결권, 및 임원 선거권을 갖는다.

## 제 12조 (의결)
1. 회장은 연 1회, 10월에 대의원회의 정기총회를 소집하며, 필요한 경우 임시총회를 소집할 수 있다. 대의원 5인 이상의 발의가 있을 때 회장은 임시총회를 소집하여야 한다.
2. 정기총회 및 임시총회는 최소 2주 전에 대의원 전원에게 공지되어야 한다. 총회는 오프라인 또는 온라인으로 진행 가능하다.
3. 회칙의 개정은 대의원 과반수 이상의 출석과 출석대의원 2/3이상의 찬성으로 하며, 기타 제반 사항은 과반수 이상의 출석과 출석대의원 과반수 이상의 찬성으로 의결한다. 의결정족수가 미달되는 경우 소집된 총회에서는 심의만 하고, 의결은 SNS 단체대화방을 통하여 실시한다.
4. 회장은 대의원회의 총회 결과를 전체 회원들에게 공지한다.

---

# 제 5장. 재정

## 제 13조 (수입)
1. 회비는 연회비와 정기산행 참가비로 구분된다. 정기산행 참가비는 수익자 부담을 원칙으로 한다. 해외산행 경비는 별도로 관리하며, 참가비는 수익자 부담으로 한다.
2. 산행 불참 시 납부된 정기산행 참가비는 산행 3일 전까지 운영위원장에게 통지하는 경우에 한해 반납된다.
3. 회비는 당해연도의 운영위원회가 결정한다. 전년도 결산 후 잉여금 또는 부족금의 정도에 따라 당해연도의 연회비 및 참가비를 증감할 수 있다. 회원은 1월 정기산행 이전까지 연회비를 납부하여야 한다.
4. 그 외에 회원의 자발적 찬조금/기부금은 그 뜻에 따라 적합하게 사용한다.

## 제 14조 (지출)
1. 지출은 본회의 목적에 부합되는 범위 내에서 사용한다. 연회비 수입의 일정 부분을 정기산행과 해외산행의 지원에 사용한다.
2. 모든 지출 용도는 사전에 운영위원회의 심의를 거쳐야 하며, 지출 내역을 재무위원에게 제출하여야 한다.

## 제 15조 (회계 및 결산)
1. 본회의 수입과 지출은 재무위원 명의의 시중은행 모임통장으로 관리하며, 운영위원 전원을 모임멤버로 등록한다.
2. 재무위원은 각 산행 및 여타행사 이후 회원들에게 SNS를 통해 수입과 지출 내역을 보고한다.
3. 재무위원은 회계연도 결산을 당해 12월 정기산행 직후 운영위원회에 보고하고, 감사는 회계감사를 실시한다. 운영위원회는 회계연도 결산 및 감사 결과를 12월 24일까지 전체 회원들에게 SNS를 통해 보고한다.
4. 본회의 회계연도는 매년 1월 1일부터 12월 31일까지로 한다.

---

# 제 6장. 기타

## 제 16조 (SNS 단체대화방)
회원 간의 친목과 협력을 도모할 목적으로 회원 대상의 SNS 단체대화방을, 대의원 간의 원활한 의견교환을 위하여 대의원회의의 SNS 단체대화방을 각각 운영한다. 단체대화방의 구성원은 세칙에 정한 가이드라인을 철저히 준수하여야 한다.

## 제 17조 (비회원의 산행참가)
회원 가족을 포함한 비회원은 회원의 초청에 의해 정기산행에 연 2회에 한정하여 참가가 허용되며, 해당 산행 참가비를 납부하여야 한다.

## 제 18조 (수익의 분배)
본회의 잉여금은 회원에 분배하지 아니한다. 본회를 해산하는 경우 잉여금은 대의원회의에서 결정하는 공익단체에 기부한다.

---

# 부칙

## 제 19조 (회칙 준용)
본 회칙에 규정되지 않은 사항은 내규 및 일반관례에 따르며, 내규는 운영위원회의 의결로 정한다.

## 제 20조 (시행일)
본 회칙은 대의원회의에서 통과한 날(2025년 10월 30일)부터 시행한다.

---

# 단체대화방 가이드라인

1. 단체대화방에는 회원 모두에게 유익하고 관심 있을 내용만을 게재한다.
2. 정치적 또는 종교적 성향이 드러나는 글을 올리지 않는다.
3. 아침 6시 이전, 밤 11시 이후에는 글을 올리지 않는다.
4. 회원동향 및 경조사 소식은 운영위원장에게 전달하며, 운영위원장은 그 적합성 여부를 판단하여 게재한다. 경조사에 대한 답글은 해당 회원에게 개별로 전달한다.
5. 일부 회원들에게 국한되는 내용은 별도의 대화방에서 소통한다.
6. 운영위원장은 단체대화방의 멤버 관리 및 메시지 관리 권한을 갖는다.
7. 본 가이드라인을 현저히 또는 반복하여 어기는 경우에는 운영위원회의 의결을 거쳐 제재한다.`;

const RULES_DOC_ID = 'current_rules';

const initialRulesData: RulesData = {
  id: RULES_DOC_ID,
  content: initialRulesContent,
  version: '2025.10.30',
  effectiveDate: '2025년 10월 30일',
  amendments: [
    {
      version: '2025.10.30',
      date: '2025년 10월 30일',
      description: '회칙 제정 (대의원회의 통과)'
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const [rulesData, setRulesData] = useState<RulesData>(initialRulesData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getDocuments<RulesData>('rules');
      if (result.success && result.data && result.data.length > 0) {
        // 첫 번째 문서를 현재 회칙으로 사용
        setRulesData(result.data[0]);
        console.log('✅ Firebase에서 회칙 데이터 로드:', result.data[0].version);
      } else {
        console.log('ℹ️ Firebase에 회칙 데이터가 없습니다. 초기 데이터를 생성합니다.');
        // 초기 데이터를 Firebase에 저장
        await setDocument('rules', RULES_DOC_ID, initialRulesData);
        console.log('✅ 초기 회칙 데이터 저장 완료');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Firebase 회칙 데이터 로드 실패:', message);
      setError(message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'RulesContext.loadRules',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Firebase에서 회칙 데이터 로드
  useEffect(() => {
    const initializeData = async () => {
      // Firebase는 동기적으로 초기화됨
      await loadRules();
    };
    initializeData();
  }, []); // loadRules를 dependency에서 제거하여 무한 루프 방지

  const updateRules = useCallback(async (content: string, version: string, effectiveDate: string) => {
    try {
      const updatedData = {
        ...rulesData,
        content,
        version,
        effectiveDate,
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('rules', RULES_DOC_ID, updatedData);
      
      if (result.success) {
        setRulesData(updatedData);
        console.log('✅ 회칙 업데이트 완료:', version);
      } else {
        throw new Error(result.error || '회칙 업데이트 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 회칙 업데이트 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'RulesContext.updateRules',
        version,
      });
      throw error;
    }
  }, [rulesData]);

  const addAmendment = useCallback(async (amendment: RulesAmendment) => {
    try {
      const updatedData = {
        ...rulesData,
        amendments: [...rulesData.amendments, amendment],
        updatedAt: new Date().toISOString(),
      };

      const result = await updateDocument('rules', RULES_DOC_ID, updatedData);
      
      if (result.success) {
        setRulesData(updatedData);
        console.log('✅ 개정 이력 추가 완료:', amendment.version);
      } else {
        throw new Error(result.error || '개정 이력 추가 실패');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ 개정 이력 추가 실패:', message);
      logError(error, ErrorLevel.ERROR, ErrorCategory.DATABASE, {
        context: 'RulesContext.addAmendment',
        version: amendment.version,
      });
      throw error;
    }
  }, [rulesData]);

  const refreshRules = useCallback(async () => {
    await loadRules();
  }, [loadRules]);

  const value = useMemo(
    () => ({
      rulesData,
      isLoading,
      error,
      updateRules,
      addAmendment,
      refreshRules,
    }),
    [rulesData, isLoading, error, updateRules, addAmendment, refreshRules]
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

import { useState } from 'react';
import { 
  BookOpen, 
  Award, 
  FileText, 
  Users, 
  Calendar,
  Shield,
  Mountain,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useRules } from '../contexts/RulesContext';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

type TabType = 'rules' | 'history' | 'organization' | 'membership';

const ClubInfo = () => {
  const [activeTab, setActiveTab] = useState<TabType>('rules');
  const { rulesContent } = useRules();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs */}
      <div className="mb-8 border-b border-slate-200">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'rules'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            회칙
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'history'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            연혁
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'organization'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            조직 구성
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-6 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'membership'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            회원 혜택
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* 회칙 내용 표시 */}
          <Card>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-slate-100 rounded-xl flex-shrink-0">
                <BookOpen className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">시애라 산악회 회칙</h2>
                <p className="text-slate-600 mt-1">클럽 운영의 기본 규정</p>
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                {rulesContent}
              </pre>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">시애라 산악회 연혁</h2>
            <p className="text-slate-600 mb-8">2005년 창립 이래 걸어온 발자취</p>

            {/* Timeline */}
            <div className="space-y-8">
              <div className="relative pl-8 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-900">2005년</span>
                    <Badge variant="primary">창립</Badge>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>2005년 3월, 등산을 사랑하는 기업 임원들이 모여 '시애라 산악회' 창립</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>창립 회원 15명으로 시작</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>첫 정기 산행: 북한산 백운대 코스</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-900">2010년</span>
                    <Badge variant="primary">회원 확대 및 조직화</Badge>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>회원 수 50명 돌파</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>운영위원회 제도 도입</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>첫 해외 산행: 일본 후지산 등정</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-900">2015년</span>
                    <Badge variant="primary">10주년 기념</Badge>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>창립 10주년 기념 대축제 개최</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>회원 수 100명 달성</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>10주년 기념 해외 특별 산행: 네팔 히말라야 트레킹</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-slate-200">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-700 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-900">2025년</span>
                    <Badge variant="primary">20주년 맞이</Badge>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>회원 수 150명 돌파</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>20주년 기념 특별 산행 준비</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>새로운 웹 플랫폼 론칭</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-900 rounded-full"></div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-slate-900">2026년</span>
                    <Badge variant="primary">디지털 전환</Badge>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>온라인 회원 관리 시스템 도입</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>산행 신청 및 관리 시스템 구축</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>사진 갤러리 및 커뮤니티 플랫폼 오픈</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* 주요 성과 */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">주요 성과</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-4xl font-bold text-slate-900 mb-2">240+</p>
                <p className="text-slate-600 font-medium">누적 산행 횟수</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-4xl font-bold text-slate-900 mb-2">150+</p>
                <p className="text-slate-600 font-medium">현재 회원 수</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-4xl font-bold text-slate-900 mb-2">15+</p>
                <p className="text-slate-600 font-medium">해외 산행 횟수</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'organization' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">시애라 운영진</h2>
            <p className="text-slate-600 mb-8">2026 시애라 운영진을 소개합니다.</p>

            {/* 회장단 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-slate-900">회장단</h3>
                <Badge variant="primary">최고 의사 결정 기구</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">회장</p>
                      <p className="font-bold text-slate-900">정호철</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">전체 회무 총괄</p>
                  <p className="text-sm text-slate-600">대외 업무 대표</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">운영위원장</p>
                      <p className="font-bold text-slate-900">이응정</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">운영위원회 주재</p>
                  <p className="text-sm text-slate-600">전체 운영 관리</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mountain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">등산대장</p>
                      <p className="font-bold text-slate-900">최원호</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">산행 계획 및 진행</p>
                  <p className="text-sm text-slate-600">안전 관리</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">운영감사</p>
                      <p className="font-bold text-slate-900">신영인</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">운영 감사</p>
                  <p className="text-sm text-slate-600">제반 업무 검토</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">재무감사</p>
                      <p className="font-bold text-slate-900">유희찬</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">재무 감사</p>
                  <p className="text-sm text-slate-600">회계 검토</p>
                </div>
              </div>
            </div>

            {/* 운영위원 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-slate-900">운영위원</h3>
                <Badge variant="primary">실무 운영 조직</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">부위원장</p>
                      <p className="font-bold text-slate-900">김용훈</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">위원장 업무 보좌</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">재무</p>
                      <p className="font-bold text-slate-900">이현희</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">회비 관리</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">기획</p>
                      <p className="font-bold text-slate-900">심경택</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">행사 기획</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">홍보/청년</p>
                      <p className="font-bold text-slate-900">권택준</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">대외 홍보</p>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">홍보/청년</p>
                      <p className="font-bold text-slate-900">한재우</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">청년 회원 관리</p>
                </div>
              </div>
            </div>
          </Card>

          {/* 조직 운영 방식 */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">조직 운영 방식</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-6 h-6 text-slate-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">정기 운영위원회</h3>
                  <p className="text-slate-700">매월 첫째 주 개최, 주요 안건 논의 및 의결</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-6 h-6 text-slate-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">정기 총회</h3>
                  <p className="text-slate-700">연 1회 개최, 전년도 결산 및 당해 연도 운영 계획 승인</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle className="w-6 h-6 text-slate-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">임원 선출</h3>
                  <p className="text-slate-700">2년 임기, 총회에서 선출 (연임 가능)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">회원 혜택</h2>
            <p className="text-slate-600 mb-8">시애라 산악회 회원만의 특별한 혜택</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-900 rounded-xl flex-shrink-0">
                    <Mountain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">월 1회 정기 산행</h3>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>매월 셋째 주 토요일 정기 산행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>전문 등산대장의 안전한 산행 진행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>다양한 난이도의 코스 선택 가능</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-900 rounded-xl flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">네트워킹</h3>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>다양한 분야 임원들과의 친목 도모</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>비즈니스 네트워크 확장 기회</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>정기 친목 행사 참여</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-900 rounded-xl flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">특별 산행</h3>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>연 2회 1박 이상 특별 산행</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>국내외 명산 등반 기회</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>힐링과 친목을 겸한 특별 프로그램</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-900 rounded-xl flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">회원 서비스</h3>
                </div>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>온라인 산행 신청 시스템</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>사진 갤러리 및 후기 공유</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>회원 전용 게시판 이용</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 가입 안내 */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">가입 안내</h2>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">가입 자격</h3>
                    <p className="text-slate-700">
                      건전한 등산 문화를 추구하며, 본 회의 목적에 찬동하는 만 25세 이상 성인
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">가입 절차</h3>
                    <p className="text-slate-700">
                      기존 회원 추천 → 게스트 참가 (최대 3회) → 가입 신청 → 운영위원회 심의 → 승인
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">회비 안내</h3>
                    <div className="text-slate-700 space-y-1">
                      <p>• 연회비: ₩100,000 (매년 1월)</p>
                      <p>• 월별 산행비: ₩30,000~₩50,000 (산행마다 상이)</p>
                      <p>• 특별 산행비: 별도 책정</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-slate-900 text-white rounded-full text-sm font-bold flex-shrink-0 mt-1">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-2">문의</h3>
                    <p className="text-slate-700">
                      가입 문의: 운영위원장 이응정 (010-8876-0605)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClubInfo;

import React, { useState } from 'react';
import { 
  Book, 
  ChevronDown, 
  ChevronRight, 
  Mountain, 
  Users, 
  CreditCard, 
  FileText, 
  Calendar, 
  Settings,
  CheckCircle,
  Circle,
  AlertCircle,
  Info,
  UserPlus,
  LogIn,
  ArrowRight,
  Printer,
  Shield,
  DollarSign,
  Lightbulb
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const AdminManual = () => {
  const [expandedSection, setExpandedSection] = useState<string>('overview');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  // 산행 관리 7단계 프로세스 시각화
  const EventProcessFlow = () => (
    <div className="hidden md:block space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <h4 className="font-bold text-lg mb-4 text-blue-900 flex items-center gap-2">
          <Mountain className="w-5 h-5" />
          산행 관리 7단계 프로세스
        </h4>
        <div className="space-y-3">
          {[
            { step: 1, status: 'draft', label: '새 산행 등록 (작성중)', color: 'bg-gray-100 text-gray-700 border-gray-300' },
            { step: 2, status: 'open', label: '신청 접수 시작 (접수중)', color: 'bg-green-100 text-green-700 border-green-300' },
            { step: 3, status: 'payment', label: '입금 관리 (입금 확인)', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
            { step: 4, status: 'closed', label: '신청 마감 (마감)', color: 'bg-orange-100 text-orange-700 border-orange-300' },
            { step: 5, status: 'team', label: '조편성 생성', color: 'bg-purple-100 text-purple-700 border-purple-300' },
            { step: 6, status: 'ongoing', label: '산행 진행 (당일)', color: 'bg-blue-100 text-blue-700 border-blue-300' },
            { step: 7, status: 'completed', label: '산행 완료 (자동/수동)', color: 'bg-slate-100 text-slate-700 border-slate-300' }
          ].map((stage, idx) => (
            <div key={stage.step} className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${stage.color.split(' ')[0]} border-2 ${stage.color.split(' ')[2]} flex items-center justify-center font-bold`}>
                {stage.step}
              </div>
              <div className={`flex-1 p-3 rounded-lg border-2 ${stage.color}`}>
                <span className="font-semibold">{stage.label}</span>
              </div>
              {idx < 6 && (
                <ArrowRight className="flex-shrink-0 w-5 h-5 text-slate-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 상태 배지 예시 */}
      <div className="bg-white p-6 rounded-xl border-2 border-slate-200">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          상태 배지 표시 예시
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">작성중</Badge>
          <Badge variant="success">접수중</Badge>
          <Badge variant="warning">마감</Badge>
          <Badge variant="info">진행중</Badge>
          <Badge variant="default">완료</Badge>
        </div>
      </div>
    </div>
  );

  const sections: Section[] = [
    {
      id: 'overview',
      title: '시스템 개요',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-xl border-2 border-primary-200">
            <h3 className="text-2xl font-bold mb-2 text-primary-900">시애라클럽 (詩愛羅) 웹사이트</h3>
            <p className="text-slate-700 mb-4">Sierra Hiking Club - 산행 운영 및 회원 관리 통합 플랫폼</p>
            
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  관리자 역할
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>회장단</strong>: 모든 기능 + 최종 승인 권한</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>운영위원</strong>: 산행/회원/입금/조편성 관리</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  주요 기능
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 text-primary-600 fill-current" />
                    산행 관리 (7단계 프로세스)
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 text-primary-600 fill-current" />
                    입금 관리 연동
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 text-primary-600 fill-current" />
                    실시간 조편성
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 text-primary-600 fill-current" />
                    프린트 출력 (A4 2페이지)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'login',
      title: '1. 관리자 로그인',
      icon: <LogIn className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-bold mb-2">로그인 방법</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>웹사이트 접속</li>
              <li>상단 <strong>"로그인"</strong> 버튼 클릭</li>
              <li>관리자 이메일 및 비밀번호 입력</li>
              <li><strong>"로그인"</strong> 버튼 클릭</li>
              <li>자동으로 관리자 대시보드로 이동</li>
            </ol>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              관리자 메뉴 접근
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                로그인 후 상단에 <Badge variant="primary">관리자</Badge> 메뉴 표시
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                또는 URL 직접 접근: <code className="bg-white px-2 py-1 rounded">/admin/</code>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'event-management',
      title: '2. 산행 관리 (핵심)',
      icon: <Mountain className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <EventProcessFlow />

          {/* 1단계: 새 산행 등록 */}
          <Card className="border-l-4 border-l-gray-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold">1</div>
              <h4 className="text-lg font-bold">새 산행 등록 (draft)</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 산행 이벤트 기본 정보 등록</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">핵심 입력 항목</h5>
                <ul className="space-y-2">
                  <li>🏷️ <strong>기본 정보:</strong> 제목, 날짜, 신청마감일, 최대인원, 장소, 산, 고도, 난이도, 설명</li>
                  <li>☎️ <strong>비상연락처:</strong> 운영진 선택 → 자동 입력</li>
                  <li>💳 <strong>참가비:</strong> 참가비, 은행, 계좌, 예금주, 담당자</li>
                  <li>🧭 <strong>당일 동선:</strong> 시간 + 장소 + 유형(출발/경유/점심/네트워킹/귀환/도착)</li>
                  <li>🥾 <strong>산행 코스:</strong> 코스명, 거리, 설명</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-800 mb-1">⚠️ 주의사항</p>
                <ul className="text-yellow-700 text-xs space-y-1">
                  <li>• draft 상태에서는 회원들이 신청할 수 없습니다</li>
                  <li>• 신청 마감일은 산행 날짜 이전으로 설정해야 합니다</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 2단계: 신청 접수 시작 */}
          <Card className="border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center font-bold">2</div>
              <h4 className="text-lg font-bold">신청 접수 시작 (open)</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 회원에게 산행 공개, 신청 가능 상태로 전환</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">실행 방법</h5>
                <ol className="list-decimal list-inside space-y-1">
                  <li>산행 목록에서 대상 산행 선택</li>
                  <li><strong>"신청 접수 시작"</strong> 버튼 클릭</li>
                  <li>확인 메시지에서 "확인" 클릭</li>
                </ol>
              </div>

              <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                <p className="font-semibold mb-1">✅ 결과</p>
                <ul className="text-xs space-y-1">
                  <li>• 상태: <Badge variant="success">접수중</Badge></li>
                  <li>• 회원 페이지에 산행 표시</li>
                  <li>• 회원들이 산행 신청 가능</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* 3단계: 입금 관리 */}
          <Card className="border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center font-bold">3</div>
              <h4 className="text-lg font-bold">입금 관리</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 신청자 입금 확인 → 조편성 대상 확정</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">입금 상태</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded border">
                    <Badge variant="default" className="mb-2">대기중</Badge>
                    <p className="text-xs">신청만 완료<br/>조편성 불가</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <Badge variant="success" className="mb-2">입금완료</Badge>
                    <p className="text-xs">입금 확인 완료<br/>조편성 가능 ✅</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                <p className="font-semibold text-red-800 mb-1">🔑 중요!</p>
                <p className="text-red-700 text-xs">입금 완료 처리된 회원만 조편성에 포함할 수 있습니다</p>
              </div>
            </div>
          </Card>

          {/* 4단계: 신청 마감 */}
          <Card className="border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-bold">4</div>
              <h4 className="text-lg font-bold">신청 마감 (closed)</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 추가 신청 차단, 조편성 단계로 전환</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">실행 방법</h5>
                <ol className="list-decimal list-inside space-y-1">
                  <li>산행 목록에서 대상 산행 선택</li>
                  <li><strong>"신청 마감"</strong> 버튼 클릭</li>
                  <li>확인 후 상태 변경</li>
                </ol>
              </div>

              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="font-semibold mb-1">💡 팁</p>
                <p className="text-xs">입금 관리는 마감 후에도 계속 처리 가능합니다</p>
              </div>
            </div>
          </Card>

          {/* 5단계: 조편성 */}
          <Card className="border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold">5</div>
              <h4 className="text-lg font-bold">조편성</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 입금완료자를 조로 배정, 조장 지정</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">실행 절차</h5>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold mb-1">A) 산행 선택</p>
                    <p className="text-xs">관리자 &gt; 산행 관리 &gt; 조편성 탭 &gt; 산행 선택</p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold mb-1">B) 조 편집</p>
                    <ol className="text-xs list-decimal list-inside space-y-1">
                      <li>편집 버튼 클릭</li>
                      <li><strong>조장 선택</strong> (입금완료자만 표시)</li>
                      <li><strong>조원 추가</strong> (입금완료자만, 중복 불가)</li>
                      <li>저장</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                <p className="font-semibold text-red-800 mb-1">⚠️ 필수 조건</p>
                <p className="text-red-700 text-xs font-bold">입금 완료된 회원만 조편성 가능!</p>
              </div>

              <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                <p className="font-semibold mb-1">💡 조원 선택 모달</p>
                <p className="text-xs">각 회원 카드에 <Badge variant="success" className="text-xs">입금완료</Badge> 배지 표시됨</p>
              </div>
            </div>
          </Card>

          {/* 프린트 출력 */}
          <Card className="border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2 mb-4">
              <Printer className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-bold">프린트 출력</h4>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700"><strong>목적:</strong> 산행 당일 배포용 A4 2페이지 출력</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-bold mb-2">구성</h5>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold mb-1">1페이지</p>
                    <ul className="text-xs space-y-1">
                      <li>• 산행 정보 + 일정/코스</li>
                      <li>• 비상연락처</li>
                      <li>• <strong>조편성 명단</strong></li>
                    </ul>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-semibold mb-1">2페이지</p>
                    <p className="text-xs">이달의 시 (산행 월 기준 자동 선택)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 6-7단계 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-sm">6</div>
                <h4 className="font-bold">산행 시작</h4>
              </div>
              <p className="text-xs text-slate-600">당일 "산행 시작" 클릭 → <Badge variant="info">진행중</Badge></p>
            </Card>

            <Card className="border-l-4 border-l-slate-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-sm">7</div>
                <h4 className="font-bold">산행 완료</h4>
              </div>
              <p className="text-xs text-slate-600">다음날 자동 완료 또는 수동 "산행 완료" → <Badge variant="default">완료</Badge></p>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'member-management',
      title: '3. 회원 관리',
      icon: <Users className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              가입 신청 관리
            </h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">실행 방법</h5>
                <ol className="list-decimal list-inside space-y-1">
                  <li>관리자 &gt; 회원 관리 &gt; <strong>가입 신청</strong></li>
                  <li>신청자 카드 클릭 → 상세 정보 확인</li>
                  <li><strong>승인</strong> 또는 <strong>반려</strong></li>
                </ol>
              </div>

              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
                <p className="font-semibold text-yellow-800 text-xs mb-1">💡 참고</p>
                <p className="text-yellow-700 text-xs">반려 시 시스템 자동 통지가 없으므로 별도 연락 필요</p>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-3">전체 회원 관리</h4>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded text-center">
                  <p className="font-semibold text-blue-900">조회</p>
                  <p className="text-xs text-blue-700">회원 정보 확인</p>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <p className="font-semibold text-green-900">수정</p>
                  <p className="text-xs text-green-700">정보 업데이트</p>
                </div>
                <div className="bg-red-50 p-3 rounded text-center">
                  <p className="font-semibold text-red-900">삭제</p>
                  <p className="text-xs text-red-700">복구 불가</p>
                </div>
              </div>

              <div className="bg-red-50 p-3 rounded border-l-4 border-red-500">
                <p className="font-semibold text-red-800 text-xs mb-1">⚠️ 주의</p>
                <p className="text-red-700 text-xs">회원 삭제 시 참여 이력도 함께 삭제됩니다 (복구 불가)</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'content-management',
      title: '4. 콘텐츠 관리',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card>
            <h4 className="font-bold mb-3">회칙 관리</h4>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700">회칙 수정 및 개정 이력 관리</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">개정판 저장</h5>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>콘텐츠 관리 &gt; 회칙 관리</li>
                  <li>내용 수정 (Markdown 지원)</li>
                  <li><strong>개정판 저장</strong> 클릭</li>
                  <li>개정일 선택 + 개정 사유 입력</li>
                  <li>저장</li>
                </ol>
              </div>

              <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
                <p className="font-semibold text-xs mb-1">✅ 자동 반영</p>
                <p className="text-xs">회원 페이지 "클럽 정보"에 최신 회칙 및 개정 이력 자동 표시</p>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-3">이달의 시 관리</h4>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700">프린트 2페이지에 표시될 시 등록/관리</p>
              
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">등록 방법</h5>
                <ul className="space-y-1 text-xs">
                  <li>• 월: YYYY-MM 형식 (예: 2026-01)</li>
                  <li>• 제목: 시 제목</li>
                  <li>• 작가: 시인 이름</li>
                  <li>• 내용: 시 전문</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-xs mb-1">🔗 프린트 연동</p>
                <p className="text-xs">산행 날짜의 월에 해당하는 시 자동 선택</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'payment-fee',
      title: '5. 입금 & 연회비',
      icon: <DollarSign className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card>
            <h4 className="font-bold mb-3">입금 관리</h4>
            <p className="text-sm text-slate-600 mb-3">
              ※ 상세 내용은 "산행 관리 - 3단계" 참조
            </p>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900 mb-2">핵심 요약</p>
              <ul className="text-xs space-y-1 text-yellow-800">
                <li>• 산행별 신청자 입금 여부 확인</li>
                <li>• 입금 확인 처리 → 조편성 가능</li>
                <li>• 입금 미확인 → 조편성 제외</li>
              </ul>
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-3">연회비 관리</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">기능</h5>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    연도별 납부 확인/취소
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    납부율 통계
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    이전 연도 내역 조회
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ & 문제해결',
      icon: <AlertCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <Card>
            <h4 className="font-bold mb-4">자주 묻는 질문</h4>
            <div className="space-y-3">
              {[
                {
                  q: '입금 확인은 언제 해야 하나요?',
                  a: '수시로 확인하며, 조편성 전까지 완료하는 것을 권장합니다.'
                },
                {
                  q: '조편성은 언제 하나요?',
                  a: '신청 마감 후, 입금 확인이 완료된 후 진행합니다.'
                },
                {
                  q: '산행 정보 수정은 언제까지 가능한가요?',
                  a: '산행 완료 전까지는 언제든 수정 가능합니다.'
                },
                {
                  q: '조편성을 수정할 수 있나요?',
                  a: '네, 여러 번 수정 가능하며 최종 저장 내용이 반영됩니다.'
                },
                {
                  q: '프린트 페이지에 조편성이 안 나와요.',
                  a: '조편성을 먼저 완료하고 저장해야 프린트에 표시됩니다.'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-lg">
                  <p className="font-semibold text-sm mb-1 text-slate-900">Q. {item.q}</p>
                  <p className="text-xs text-slate-600">A. {item.a}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              문제 해결
            </h4>
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <p className="font-bold text-sm text-red-900 mb-2">🚨 조원 선택 모달에 회원이 안 나옵니다</p>
                <p className="text-xs text-red-800 mb-2"><strong>원인:</strong> 입금 완료된 회원이 없거나 모두 배정됨</p>
                <p className="text-xs text-red-700"><strong>해결:</strong> 입금 관리 페이지에서 입금 확인 처리</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <p className="font-bold text-sm text-orange-900 mb-2">🚨 프린트 페이지가 비어있습니다</p>
                <p className="text-xs text-orange-800 mb-2"><strong>원인:</strong> 조편성이 완료되지 않음</p>
                <p className="text-xs text-orange-700"><strong>해결:</strong> 조편성 페이지에서 조편성 완료 및 저장</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                <p className="font-bold text-sm text-yellow-900 mb-2">🚨 신청 버튼이 비활성화되어 있습니다</p>
                <p className="text-xs text-yellow-800 mb-2"><strong>원인:</strong> 신청 마감일 경과 또는 최대 인원 도달</p>
                <p className="text-xs text-yellow-700"><strong>해결:</strong> 신청 기간 및 인원 확인</p>
              </div>
            </div>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 탭 스타일 헤더 */}
      <div className="mb-8">
        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <div className="py-4 px-1 border-b-2 border-primary-600 text-primary-600 font-bold text-lg flex items-center gap-2">
              <Book className="w-5 h-5" />
              관리자 매뉴얼
            </div>
          </nav>
        </div>
      </div>

      {/* 목차 */}
      <Card className="mb-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            목차
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                  expandedSection === section.id
                    ? 'bg-primary-50 border-2 border-primary-500 text-primary-900'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className={`flex-shrink-0 ${expandedSection === section.id ? 'text-primary-600' : 'text-slate-400'}`}>
                  {section.icon}
                </div>
                <span className="font-medium text-sm">{section.title}</span>
              </button>
          ))}
        </div>
      </Card>

      {/* 섹션 내용 */}
      <div className="space-y-4">
        {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow overflow-hidden border border-slate-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary-600">{section.icon}</div>
                  <h3 className="text-xl font-bold">{section.title}</h3>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="w-6 h-6 text-primary-600" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                )}
              </button>
              
              {expandedSection === section.id && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  {section.content}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* 푸터 */}
      <div className="mt-8 text-center text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
        <p>이 매뉴얼은 시스템 업데이트에 따라 지속적으로 개선됩니다.</p>
        <p className="mt-1">최종 업데이트: 2026년 1월</p>
      </div>
    </div>
  );
};

export default AdminManual;

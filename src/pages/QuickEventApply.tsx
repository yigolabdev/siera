import { useState, useMemo } from 'react';
import { Calendar, MapPin, Users, AlertCircle, CheckCircle, Mountain, UserCheck, Clock } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';
import { mockEvents, mockParticipants } from '../data/mockEvents';
import { mockUsers } from '../data/mockUsers';
import { formatDate, formatDeadline, getDaysUntilDeadline, isApplicationClosed } from '../utils/format';

interface ApplicationResult {
  success: boolean;
  message: string;
  userName?: string;
  eventTitle?: string;
}

export default function QuickEventApply() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApplicationResult | null>(null);

  // 이번 달 산행 (월 1회만 있음)
  const currentEvent = useMemo(() => {
    const now = new Date();
    
    // 현재부터 2개월 이내의 산행 찾기
    const twoMonthsLater = new Date(now.getFullYear(), now.getMonth() + 2, 0);
    
    const events = mockEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= twoMonthsLater;
    });

    // 가장 가까운 산행 반환 (월 1회이므로)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  }, []);

  // 신청자 목록
  const participants = useMemo(() => {
    if (!currentEvent) return [];
    return mockParticipants[currentEvent.id] || [];
  }, [currentEvent]);

  // 상태별 신청자 수
  const participantStats = useMemo(() => {
    const confirmed = participants.filter((p) => p.status === 'confirmed').length;
    const pending = participants.filter((p) => p.status === 'pending').length;
    return { confirmed, pending, total: participants.length };
  }, [participants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setResult({
        success: false,
        message: '이름을 입력해주세요.',
      });
      return;
    }

    if (!currentEvent) {
      setResult({
        success: false,
        message: '현재 신청 가능한 산행이 없습니다.',
      });
      return;
    }

    // 신청 마감 확인
    if (isApplicationClosed(currentEvent.date)) {
      setResult({
        success: false,
        message: `신청 기간이 마감되었습니다. (${formatDeadline(currentEvent.date)} 마감)`,
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    // 시뮬레이션: 서버 통신 지연
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // DB에서 이름으로 회원 찾기
    const user = mockUsers.find(
      (u) => u.name.trim() === name.trim() && u.isApproved && u.role !== 'guest'
    );

    if (!user) {
      setResult({
        success: false,
        message: '등록된 회원을 찾을 수 없습니다. 이름을 정확히 입력해주세요.',
      });
      setIsLoading(false);
      return;
    }

    // 정원 확인
    if (currentEvent.currentParticipants >= currentEvent.maxParticipants) {
      setResult({
        success: false,
        message: `${currentEvent.title}은(는) 정원이 마감되었습니다.`,
      });
      setIsLoading(false);
      return;
    }

    // 신청 처리 (실제로는 서버에 저장)
    // TODO: 실제 백엔드 API 호출로 교체
    console.log('산행 신청:', { userId: user.id, userName: user.name, eventId: currentEvent.id });

    setResult({
      success: true,
      message: '산행 신청이 완료되었습니다!',
      userName: user.name,
      eventTitle: currentEvent.title,
    });
    setIsLoading(false);
    setName('');
  };

  const handleReset = () => {
    setResult(null);
    setName('');
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
    };
    return labels[difficulty] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  // 산행이 없는 경우
  if (!currentEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Mountain className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">간편 산행 신청</h1>
            <p className="text-gray-600">
              로그인 없이 이름만 입력하면 빠르게 산행을 신청할 수 있습니다
            </p>
          </div>

          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                현재 신청 가능한 산행이 없습니다
              </h3>
              <p className="text-gray-600">다음 달 산행 일정을 기다려주세요.</p>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <Mountain className="w-5 h-5" />
              홈페이지로 이동
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Mountain className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">간편 산행 신청</h1>
          <p className="text-gray-600">
            로그인 없이 이름만 입력하면 빠르게 산행을 신청할 수 있습니다
          </p>
        </div>

        {/* 이번 달 산행 정보 */}
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{currentEvent.title}</h2>
            <Badge variant={currentEvent.difficulty === 'easy' ? 'success' : currentEvent.difficulty === 'hard' ? 'danger' : 'warning'}>
              {getDifficultyLabel(currentEvent.difficulty)}
            </Badge>
          </div>

          <div className="space-y-3 text-gray-700">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{formatDate(currentEvent.date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{currentEvent.location}</span>
            </div>
            {currentEvent.mountain && (
              <div className="flex items-center gap-3">
                <Mountain className="w-5 h-5 text-gray-500" />
                <span>
                  {currentEvent.mountain}
                  {currentEvent.altitude && ` (${currentEvent.altitude})`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <span>
                {currentEvent.currentParticipants} / {currentEvent.maxParticipants}명 신청
                {currentEvent.currentParticipants >= currentEvent.maxParticipants && (
                  <Badge variant="danger" className="ml-2">정원 마감</Badge>
                )}
              </span>
            </div>
            
            {/* 신청 마감일 정보 */}
            <div className="pt-3 border-t border-gray-200">
              {isApplicationClosed(currentEvent.date) ? (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">
                    신청 마감됨 ({formatDeadline(currentEvent.date)} 마감)
                  </span>
                </div>
              ) : getDaysUntilDeadline(currentEvent.date) <= 3 ? (
                <div className="flex items-center gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 flex-shrink-0 animate-pulse" />
                  <span className="font-semibold">
                    마감 {getDaysUntilDeadline(currentEvent.date)}일 전 · {formatDeadline(currentEvent.date)}까지
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  <span>
                    신청 마감: <strong>{formatDeadline(currentEvent.date)}</strong>
                    <span className="text-blue-600 text-sm ml-2">(출발일 10일 전)</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 일정 */}
          {currentEvent.schedule.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">산행 일정</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {currentEvent.schedule.map((item, index) => (
                  <li key={index}>
                    • {item.time} - {item.location}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 참가비 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">참가비</span>
              <span className="text-lg font-bold text-green-600">{currentEvent.cost}</span>
            </div>
          </div>
        </Card>

        {/* 신청 결과 표시 */}
        {result && (
          <Card className="mb-6">
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h3
                  className={`font-semibold mb-1 ${
                    result.success ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {result.success ? '신청 완료' : '신청 실패'}
                </h3>
                <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.message}
                </p>
                {result.success && result.userName && result.eventTitle && (
                  <div className="mt-3 text-sm text-green-600 bg-white rounded p-3 space-y-2">
                    <p>
                      <strong>{result.userName}</strong>님의 <strong>{result.eventTitle}</strong> 신청이
                      접수되었습니다.
                    </p>
                    <p className="mt-1">자세한 내용은 등록하신 연락처로 안내드립니다.</p>
                    <div className="pt-2 border-t border-green-200">
                      <p className="font-semibold text-green-700">⚠️ 중요: 입금 완료 후 신청 확정</p>
                      <p className="mt-1">참가비 입금이 완료되어야 최종 신청이 확정됩니다. 입금 계좌는 문자/이메일로 안내드립니다.</p>
                    </div>
                  </div>
                )}
                {result.success && (
                  <Button onClick={handleReset} variant="secondary" className="mt-3 text-sm">
                    신청 완료
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* 신청 폼 */}
        {!result?.success && (
          <Card className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">산행 신청하기</h3>
            
            {/* 입금 안내 박스 */}
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">입금 완료 후 신청 확정</p>
                  <p>신청 후 안내받으신 계좌로 참가비를 입금해야 최종 신청이 확정됩니다.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="name"
                  type="text"
                  label="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="등록된 회원 이름을 입력하세요"
                  disabled={isLoading}
                  required
                  helperText="※ 동호회에 등록된 정확한 이름을 입력해주세요"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading || 
                  !name.trim() || 
                  currentEvent.currentParticipants >= currentEvent.maxParticipants ||
                  isApplicationClosed(currentEvent.date)
                }
                className="w-full py-3 text-lg"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    처리 중...
                  </span>
                ) : isApplicationClosed(currentEvent.date) ? (
                  '신청 마감'
                ) : currentEvent.currentParticipants >= currentEvent.maxParticipants ? (
                  '정원 마감'
                ) : (
                  '신청하기'
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* 신청자 통계 (리스트는 보안상 비공개) */}
        {participants.length > 0 && (
          <Card className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-lg">현재 신청 현황</h3>
            </div>

            {/* 신청 통계만 표시 */}
            <div className="flex gap-2 mb-4">
              <Badge variant="success">
                확정: {participantStats.confirmed}명
              </Badge>
              <Badge variant="warning">
                대기: {participantStats.pending}명
              </Badge>
              <Badge variant="primary">
                전체: {participantStats.total}명
              </Badge>
            </div>

            {/* 개인정보 보호 안내 */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">개인정보 보호</span><br />
                  신청자 명단은 회원 보호를 위해 비공개입니다. 로그인 후 회원 전용 페이지에서 확인하실 수 있습니다.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 안내 문구 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            안내사항
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 등록된 회원만 신청 가능합니다.</li>
            <li>• 이름은 동호회에 등록된 정확한 이름을 입력해주세요.</li>
            <li>• <strong>신청 후 참가비 입금이 완료되어야 최종 신청이 확정됩니다.</strong></li>
            <li>• 입금 계좌 및 금액은 신청 후 등록하신 연락처로 안내드립니다.</li>
            <li>• 문의사항은 동호회 관리자에게 연락주세요.</li>
          </ul>
        </div>

        {/* 홈페이지 바로가기 */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Mountain className="w-5 h-5" />
            홈페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
}

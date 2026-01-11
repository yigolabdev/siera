import { useState } from 'react';
import { Search, CreditCard, CheckCircle, Clock, Users, AlertCircle, Calendar, Filter } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Applicant {
  id: number;
  name: string;
  isGuest: boolean;
  company: string;
  occupation: string;
  phone: string;
  email: string;
  applicationDate: string;
  paymentStatus: 'completed' | 'pending' | 'confirmed';
  paymentDate?: string;
  amount: number;
}

interface HikingEvent {
  id: string;
  title: string;
  mountain: string;
  date: string;
  cost: number;
  maxParticipants: number;
  currentParticipants: number;
}

const PaymentManagement = () => {
  // Mock 데이터
  const [events] = useState<HikingEvent[]>([
    {
      id: '1',
      title: '1월 정기 산행',
      mountain: '북한산',
      date: '2025-01-25',
      cost: 60000,
      maxParticipants: 40,
      currentParticipants: 28,
    },
    {
      id: '2',
      title: '2월 정기 산행',
      mountain: '설악산',
      date: '2025-02-15',
      cost: 60000,
      maxParticipants: 40,
      currentParticipants: 15,
    },
    {
      id: '3',
      title: '1박 2일 특별 산행',
      mountain: '지리산',
      date: '2025-03-08',
      cost: 150000,
      maxParticipants: 30,
      currentParticipants: 12,
    },
  ]);

  const [applicants] = useState<Applicant[]>([
    {
      id: 1,
      name: '김대한',
      isGuest: false,
      company: '테크코리아',
      occupation: '대표이사',
      phone: '010-1234-5678',
      email: 'kim@example.com',
      applicationDate: '2025-01-10',
      paymentStatus: 'completed',
      paymentDate: '2025-01-11',
      amount: 60000,
    },
    {
      id: 2,
      name: '이민국',
      isGuest: false,
      company: '글로벌산업',
      occupation: '부사장',
      phone: '010-2345-6789',
      email: 'lee@example.com',
      applicationDate: '2025-01-10',
      paymentStatus: 'completed',
      paymentDate: '2025-01-10',
      amount: 60000,
    },
    {
      id: 3,
      name: '박세계',
      isGuest: true,
      company: '프리랜서',
      occupation: '컨설턴트',
      phone: '010-3456-7890',
      email: 'park@example.com',
      applicationDate: '2025-01-11',
      paymentStatus: 'pending',
      amount: 60000,
    },
    {
      id: 4,
      name: '최지구',
      isGuest: false,
      company: '미래기획',
      occupation: '이사',
      phone: '010-4567-8901',
      email: 'choi@example.com',
      applicationDate: '2025-01-11',
      paymentStatus: 'confirmed',
      paymentDate: '2025-01-12',
      amount: 60000,
    },
    {
      id: 5,
      name: '정우주',
      isGuest: true,
      company: '스타트업',
      occupation: '대표',
      phone: '010-5678-9012',
      email: 'jung@example.com',
      applicationDate: '2025-01-12',
      paymentStatus: 'pending',
      amount: 60000,
    },
  ]);

  const [selectedEventId, setSelectedEventId] = useState<string>('1');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'completed' | 'pending' | 'confirmed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [applicantsList, setApplicantsList] = useState<Applicant[]>(applicants);

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // 필터링된 신청자 목록
  const filteredApplicants = applicantsList.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = paymentFilter === 'all' || applicant.paymentStatus === paymentFilter;
    return matchesSearch && matchesFilter;
  });

  // 통계 계산
  const stats = {
    total: applicantsList.length,
    completed: applicantsList.filter(a => a.paymentStatus === 'completed').length,
    pending: applicantsList.filter(a => a.paymentStatus === 'pending').length,
    teamEligible: applicantsList.filter(a => a.paymentStatus === 'completed').length,
  };

  // 입금 확인 처리
  const handleConfirmPayment = (id: number) => {
    setApplicantsList(prev =>
      prev.map(applicant =>
        applicant.id === id
          ? {
              ...applicant,
              paymentStatus: 'completed',
              paymentDate: new Date().toISOString().split('T')[0],
            }
          : applicant
      )
    );
  };

  // 입금 취소 처리
  const handleCancelPayment = (id: number) => {
    if (confirm('입금 확인을 취소하시겠습니까?')) {
      setApplicantsList(prev =>
        prev.map(applicant =>
          applicant.id === id
            ? {
                ...applicant,
                paymentStatus: 'pending',
                paymentDate: undefined,
              }
            : applicant
        )
      );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">입금 완료</Badge>;
      case 'pending':
        return <Badge variant="warning">입금 대기</Badge>;
      case 'confirmed':
        return <Badge variant="primary">확인됨</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">입금 관리</h1>
        <p className="text-xl text-slate-600">
          산행 신청자의 참가비 입금 여부를 확인하고 관리합니다.
        </p>
      </div>

      {/* 산행 이벤트 선택 */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              산행 이벤트 선택
            </h3>
            <p className="text-sm text-slate-600">
              입금 현황을 확인할 산행을 선택하세요
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedEventId === event.id
                  ? 'border-blue-600 bg-white shadow-lg'
                  : 'border-blue-200 bg-white/50 hover:border-blue-400 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-slate-900">{event.title}</h4>
                {selectedEventId === event.id && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-slate-600 mb-1">{event.mountain}</p>
              <p className="text-sm text-slate-500 mb-2">{event.date}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  {event.currentParticipants} / {event.maxParticipants}명
                </span>
                <span className="font-bold text-blue-600">
                  ₩{event.cost.toLocaleString()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 통계 대시보드 */}
      {selectedEvent && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">총 신청자</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}명</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">입금 완료</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.completed}명</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">입금 대기</p>
              <p className="text-3xl font-bold text-amber-600">{stats.pending}명</p>
            </Card>

            <Card className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-slate-600 text-sm mb-1">팀 편성 가능</p>
              <p className="text-3xl font-bold text-purple-600">{stats.teamEligible}명</p>
            </Card>
          </div>

          {/* 필터 및 검색 */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* 필터 */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700 mr-2">상태:</span>
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setPaymentFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  입금 완료
                </button>
                <button
                  onClick={() => setPaymentFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  입금 대기
                </button>
              </div>

              {/* 검색 */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="이름 또는 회사 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* 신청자 목록 */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">신청자 입금 현황</h3>
                <p className="text-sm text-slate-600">
                  {filteredApplicants.length}명의 신청자
                </p>
              </div>
            </div>

            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* 신청자 정보 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-slate-900">
                            {applicant.name}
                            {applicant.isGuest && (
                              <span className="ml-2 text-amber-600 font-bold">(G)</span>
                            )}
                          </h4>
                          {getPaymentStatusBadge(applicant.paymentStatus)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                          <div>
                            <span className="font-medium">직급:</span> {applicant.occupation}
                          </div>
                          <div>
                            <span className="font-medium">회사:</span> {applicant.company}
                          </div>
                          <div>
                            <span className="font-medium">연락처:</span> {applicant.phone}
                          </div>
                          <div>
                            <span className="font-medium">신청일:</span> {applicant.applicationDate}
                          </div>
                          {applicant.paymentDate && (
                            <div className="md:col-span-2">
                              <span className="font-medium">입금일:</span> {applicant.paymentDate}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 금액 및 액션 버튼 */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-sm text-slate-600 mb-1">참가비</p>
                          <p className="text-2xl font-bold text-slate-900">
                            ₩{applicant.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {applicant.paymentStatus === 'pending' ? (
                            <button
                              onClick={() => handleConfirmPayment(applicant.id)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              입금 확인
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCancelPayment(applicant.id)}
                              className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                              <AlertCircle className="w-4 h-4" />
                              입금 취소
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default PaymentManagement;

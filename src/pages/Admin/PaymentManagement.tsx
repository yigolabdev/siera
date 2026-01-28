import { useState, useMemo } from 'react';
import { Search, CreditCard, CheckCircle, Clock, Users, AlertCircle, Calendar, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../contexts/EventContext';
import { usePayments } from '../../contexts/PaymentContext';
import { useDevMode } from '../../contexts/DevModeContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

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
  const { currentEvent, specialEvent, events: allEvents } = useEvents();
  const { payments, isLoading: isPaymentsLoading, confirmPayment, cancelPayment, getPaymentsByEvent } = usePayments();
  const { specialApplicationStatus } = useDevMode();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'completed' | 'pending' | 'confirmed' | 'cancelled'>('all');
  
  // 실제 이벤트 목록 생성 (정기산행 + 특별산행)
  const events = useMemo(() => {
    const eventList: HikingEvent[] = [];
    
    // 정기 산행 추가
    if (currentEvent) {
      eventList.push({
        id: currentEvent.id,
        title: currentEvent.title,
        mountain: currentEvent.mountain || currentEvent.location,
        date: currentEvent.date,
        cost: parseInt(currentEvent.cost.replace(/[^0-9]/g, '')),
        maxParticipants: currentEvent.maxParticipants,
        currentParticipants: currentEvent.currentParticipants || 0,
      });
    }
    
    // 특별 산행 추가 (신청 기간일 때만)
    if (specialEvent && specialApplicationStatus !== 'no-event') {
      eventList.push({
        id: specialEvent.id,
        title: `${specialEvent.title} (특별산행)`,
        mountain: specialEvent.mountain || specialEvent.location,
        date: specialEvent.date,
        cost: parseInt(specialEvent.cost.replace(/[^0-9]/g, '')),
        maxParticipants: specialEvent.maxParticipants,
        currentParticipants: specialEvent.currentParticipants || 0,
      });
    }
    
    return eventList;
  }, [currentEvent, specialEvent, specialApplicationStatus]);

  // 첫 번째 이벤트를 기본 선택
  if (!selectedEventId && events.length > 0) {
    setSelectedEventId(events[0].id);
  }

  const selectedEvent = events.find(e => e.id === selectedEventId);

  // 선택된 이벤트의 결제 목록
  const eventPayments = useMemo(() => {
    if (!selectedEventId) return [];
    return getPaymentsByEvent(selectedEventId);
  }, [payments, selectedEventId, getPaymentsByEvent]);

  // 필터링된 결제 목록
  const filteredPayments = useMemo(() => {
    return eventPayments.filter(payment => {
      const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = paymentFilter === 'all' || payment.paymentStatus === paymentFilter;
      return matchesSearch && matchesFilter;
    });
  }, [eventPayments, searchTerm, paymentFilter]);

  // 통계 계산 (선택된 이벤트 기준)
  const stats = useMemo(() => ({
    total: eventPayments.length,
    completed: eventPayments.filter(a => a.paymentStatus === 'completed').length,
    pending: eventPayments.filter(a => a.paymentStatus === 'pending').length,
    confirmed: eventPayments.filter(a => a.paymentStatus === 'confirmed').length,
    cancelled: eventPayments.filter(a => a.paymentStatus === 'cancelled').length,
    totalAmount: eventPayments.reduce((sum, a) => sum + a.amount, 0),
  }), [eventPayments]);

  // 입금 확인 처리
  const handleConfirmPayment = async (id: string) => {
    try {
      await confirmPayment(id);
      alert('입금 확인이 완료되었습니다.');
    } catch (error) {
      alert('입금 확인 처리 중 오류가 발생했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />입금완료</Badge>;
      case 'confirmed':
        return <Badge variant="primary"><CheckCircle className="w-3 h-3 mr-1" />확인완료</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />입금대기</Badge>;
      case 'cancelled':
        return <Badge variant="danger"><AlertCircle className="w-3 h-3 mr-1" />취소</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (isPaymentsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">결제 관리</h1>
        <p className="text-slate-600">산행 참가비 결제 현황을 관리합니다.</p>
      </div>

      {events.length === 0 ? (
        <Card className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">진행 중인 산행이 없습니다</h3>
          <p className="text-slate-600 mb-6">새로운 산행을 등록하면 결제 관리를 시작할 수 있습니다.</p>
          <Link 
            to="/admin/events" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            산행 관리로 이동
          </Link>
        </Card>
      ) : (
        <>
          {/* Event Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              산행 선택
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} - {event.mountain} ({new Date(event.date).toLocaleDateString('ko-KR')})
                </option>
              ))}
            </select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">총 신청자</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}명</p>
                </div>
                <Users className="w-8 h-8 text-slate-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">입금완료</p>
                  <p className="text-2xl font-bold text-success-600 mt-1">{stats.completed}명</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">확인완료</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">{stats.confirmed}명</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">입금대기</p>
                  <p className="text-2xl font-bold text-warning-600 mt-1">{stats.pending}명</p>
                </div>
                <Clock className="w-8 h-8 text-warning-600" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">총 금액</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {(stats.totalAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-slate-600" />
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="이름 또는 회사명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">전체</option>
                  <option value="completed">입금완료</option>
                  <option value="confirmed">확인완료</option>
                  <option value="pending">입금대기</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Payments Table */}
          {filteredPayments.length === 0 ? (
            <Card className="text-center py-16">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">결제 내역이 없습니다</h3>
              <p className="text-slate-600">
                {searchTerm || paymentFilter !== 'all' 
                  ? '검색 조건에 맞는 결제 내역이 없습니다.' 
                  : '이 산행에 대한 결제 내역이 아직 없습니다.'}
              </p>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        회사/직책
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        연락처
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        구분
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        신청일
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{payment.userName}</div>
                          <div className="text-sm text-slate-500">{payment.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-900">{payment.company}</div>
                          <div className="text-sm text-slate-500">{payment.occupation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-900">
                          {payment.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge variant={payment.isGuest ? 'warning' : 'info'}>
                            {payment.isGuest ? '게스트' : '회원'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-900 font-semibold">
                          {payment.amount.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-slate-600">
                          {new Date(payment.applicationDate).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getStatusBadge(payment.paymentStatus)}
                          {payment.paymentDate && (
                            <div className="text-xs text-slate-500 mt-1">
                              {new Date(payment.paymentDate).toLocaleDateString('ko-KR')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {payment.paymentStatus === 'completed' && (
                            <button
                              onClick={() => handleConfirmPayment(payment.id)}
                              className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                            >
                              확인완료
                            </button>
                          )}
                          {payment.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handleConfirmPayment(payment.id)}
                              className="px-3 py-1 bg-success-600 text-white text-sm rounded hover:bg-success-700 transition-colors"
                            >
                              입금확인
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentManagement;

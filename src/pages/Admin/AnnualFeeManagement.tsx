import { useState } from 'react';
import { Search, CheckCircle, Clock, Users, AlertCircle, Filter, ArrowLeft, DollarSign, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

interface Member {
  id: number;
  name: string;
  company: string;
  occupation: string;
  phone: string;
  email: string;
  joinDate: string;
  paymentStatus: 'completed' | 'pending';
  paymentDate?: string;
  amount: number;
  year: number;
}

const AnnualFeeManagement = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  // Mock 데이터 - 전체 회원 목록
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: '김산행',
      company: '○○그룹',
      occupation: '회장',
      phone: '010-1234-5678',
      email: 'kim@example.com',
      joinDate: '2025-01-10',
      paymentStatus: 'completed',
      paymentDate: '2026-01-05',
      amount: 120000,
      year: 2026,
    },
    {
      id: 2,
      name: '이등산',
      company: '△△건설',
      occupation: '대표이사',
      phone: '010-2345-6789',
      email: 'lee@example.com',
      joinDate: '2025-01-10',
      paymentStatus: 'completed',
      paymentDate: '2026-01-03',
      amount: 120000,
      year: 2026,
    },
    {
      id: 3,
      name: '박트레킹',
      company: '□□금융',
      occupation: '부사장',
      phone: '010-3456-7890',
      email: 'park@example.com',
      joinDate: '2025-01-11',
      paymentStatus: 'pending',
      amount: 120000,
      year: 2026,
    },
    {
      id: 4,
      name: '최하이킹',
      company: '◇◇제약',
      occupation: '전무이사',
      phone: '010-4567-8901',
      email: 'choi@example.com',
      joinDate: '2025-01-11',
      paymentStatus: 'pending',
      amount: 120000,
      year: 2026,
    },
    {
      id: 5,
      name: '정봉우리',
      company: '☆☆병원',
      occupation: '원장',
      phone: '010-5678-9012',
      email: 'jung@example.com',
      joinDate: '2025-01-12',
      paymentStatus: 'completed',
      paymentDate: '2026-01-10',
      amount: 120000,
      year: 2026,
    },
    {
      id: 6,
      name: '홍정상',
      company: '※※법률사무소',
      occupation: '대표변호사',
      phone: '010-6789-0123',
      email: 'hong@example.com',
      joinDate: '2025-01-13',
      paymentStatus: 'pending',
      amount: 120000,
      year: 2026,
    },
    {
      id: 7,
      name: '강백운',
      company: '◎◎IT',
      occupation: '대표',
      phone: '010-7890-1234',
      email: 'kang@example.com',
      joinDate: '2025-01-14',
      paymentStatus: 'completed',
      paymentDate: '2026-01-07',
      amount: 120000,
      year: 2026,
    },
    {
      id: 8,
      name: '윤설악',
      company: '▽▽건축',
      occupation: '사장',
      phone: '010-8901-2345',
      email: 'yoon@example.com',
      joinDate: '2025-01-15',
      paymentStatus: 'pending',
      amount: 120000,
      year: 2026,
    },
  ]);

  const [paymentFilter, setPaymentFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 필터링된 회원 목록
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = paymentFilter === 'all' || member.paymentStatus === paymentFilter;
    const matchesYear = member.year === selectedYear;
    return matchesSearch && matchesFilter && matchesYear;
  });

  // 통계 계산
  const stats = {
    total: members.filter(m => m.year === selectedYear).length,
    completed: members.filter(m => m.year === selectedYear && m.paymentStatus === 'completed').length,
    pending: members.filter(m => m.year === selectedYear && m.paymentStatus === 'pending').length,
    totalAmount: members.filter(m => m.year === selectedYear && m.paymentStatus === 'completed')
                        .reduce((sum, m) => sum + m.amount, 0),
  };

  // 입금 확인 처리
  const handleConfirmPayment = (id: number) => {
    setMembers(prev =>
      prev.map(member =>
        member.id === id
          ? {
              ...member,
              paymentStatus: 'completed',
              paymentDate: new Date().toISOString().split('T')[0],
            }
          : member
      )
    );
  };

  // 입금 취소 처리
  const handleCancelPayment = (id: number) => {
    if (confirm('입금 확인을 취소하시겠습니까?')) {
      setMembers(prev =>
        prev.map(member =>
          member.id === id
            ? {
                ...member,
                paymentStatus: 'pending',
                paymentDate: undefined,
              }
            : member
        )
      );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">납부 완료</Badge>;
      case 'pending':
        return <Badge variant="warning">납부 대기</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/payment"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          월별 산행 회비 관리로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 mb-3">연회비 관리</h1>
        <p className="text-xl text-slate-600">
          전체 회원의 연회비 납부 여부를 확인하고 관리합니다.
        </p>
      </div>

      {/* 연도 선택 */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              납부 연도 선택
            </h3>
            <p className="text-sm text-slate-600">
              확인할 연도를 선택하세요
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                selectedYear === year
                  ? 'border-purple-600 bg-white shadow-lg text-purple-600'
                  : 'border-purple-200 bg-white/50 hover:border-purple-400 hover:bg-white text-slate-600'
              }`}
            >
              {year}년
            </button>
          ))}
        </div>
      </Card>

      {/* 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-slate-600 text-sm mb-1">총 회원</p>
          <p className="text-3xl font-bold text-slate-900">{stats.total}명</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-slate-600 text-sm mb-1">납부 완료</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.completed}명</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-slate-600 text-sm mb-1">납부 대기</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}명</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-slate-600 text-sm mb-1">총 납부액</p>
          <p className="text-2xl font-bold text-purple-600">₩{stats.totalAmount.toLocaleString()}</p>
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
              납부 완료
            </button>
            <button
              onClick={() => setPaymentFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                paymentFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              납부 대기
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
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </Card>

      {/* 회원 목록 */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{selectedYear}년 연회비 납부 현황</h3>
            <p className="text-sm text-slate-600">
              {filteredMembers.length}명의 회원
            </p>
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* 회원 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">
                        {member.name}
                      </h4>
                      {getPaymentStatusBadge(member.paymentStatus)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">직급:</span> {member.occupation}
                      </div>
                      <div>
                        <span className="font-medium">회사:</span> {member.company}
                      </div>
                      <div>
                        <span className="font-medium">연락처:</span> {member.phone}
                      </div>
                      <div>
                        <span className="font-medium">가입일:</span> {member.joinDate}
                      </div>
                      {member.paymentDate && (
                        <div className="md:col-span-2">
                          <span className="font-medium">납부일:</span> {member.paymentDate}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 금액 및 액션 버튼 */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-1">연회비</p>
                      <p className="text-2xl font-bold text-slate-900">
                        ₩{member.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {member.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => handleConfirmPayment(member.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          납부 확인
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelPayment(member.id)}
                          className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          납부 취소
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
    </div>
  );
};

export default AnnualFeeManagement;

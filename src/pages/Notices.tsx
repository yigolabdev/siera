import { Bell, Pin, CreditCard, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notices = () => {
  const notices = [
    {
      id: 1,
      title: '2024년 1월 정기산행 안내',
      content: '1월 15일(월) 북한산 백운대 등반을 진행합니다. 오전 8시 우이동 입구 집결 예정이오니 참석하실 회원님들은 미리 신청 부탁드립니다.',
      date: '2024-01-01',
      isPinned: true,
    },
    {
      id: 2,
      title: '2024년 연회비 납부 안내',
      content: '2024년도 연회비 납부를 시작합니다. 계좌번호: 국민은행 123-456-789012 (예금주: 시애라)',
      date: '2024-01-02',
      isPinned: true,
    },
    {
      id: 3,
      title: '신년 하례식 일정 공지',
      content: '2024년 신년 하례식을 1월 5일(금) 저녁 7시에 진행합니다. 장소는 강남 ○○호텔입니다.',
      date: '2024-01-03',
      isPinned: false,
    },
    {
      id: 4,
      title: '겨울철 산행 안전 수칙',
      content: '겨울철 산행 시 미끄럼 방지 아이젠과 보온 의류를 반드시 준비해주시기 바랍니다.',
      date: '2023-12-28',
      isPinned: false,
    },
    {
      id: 5,
      title: '12월 정기산행 결과 보고',
      content: '12월 정기산행이 성황리에 마무리되었습니다. 참석해주신 35명의 회원님들께 감사드립니다.',
      date: '2023-12-20',
      isPinned: false,
    },
  ];
  
  const payments = [
    {
      id: 1,
      title: '2024년 연회비',
      amount: '200,000원',
      dueDate: '2024-01-31',
      status: 'pending' as const,
    },
    {
      id: 2,
      title: '1월 정기산행 회비',
      amount: '50,000원',
      dueDate: '2024-01-10',
      status: 'completed' as const,
    },
  ];
  
  const pinnedNotices = notices.filter(n => n.isPinned);
  const regularNotices = notices.filter(n => !n.isPinned);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">공지사항</h1>
        <p className="text-xl text-gray-600">
          시애라의 주요 소식과 입금 정보를 확인하세요.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Notices */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Pin className="h-6 w-6 text-red-600" />
                <span>중요 공지</span>
              </h2>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <div key={notice.id} className="card border-l-4 border-red-600 bg-red-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                          필독
                        </span>
                        <h3 className="text-xl font-bold text-gray-900">{notice.title}</h3>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Notices */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Bell className="h-6 w-6 text-primary-600" />
              <span>일반 공지</span>
            </h2>
            <div className="space-y-4">
              {regularNotices.map((notice) => (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className="card block hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 flex-grow">{notice.title}</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                      {notice.date}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">{notice.content}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Payment Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="card bg-gradient-to-br from-primary-50 to-green-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-primary-600" />
                <span>입금 정보</span>
              </h2>
              
              <div className="space-y-4 mb-6">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 bg-white rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">{payment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status === 'completed' ? '완료' : '대기'}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-lg font-bold text-primary-600">{payment.amount}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>납부기한: {payment.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">계좌 정보</h3>
                <div className="space-y-1 text-gray-700">
                  <p className="text-base"><span className="font-medium">은행:</span> 국민은행</p>
                  <p className="text-base"><span className="font-medium">계좌번호:</span> 123-456-789012</p>
                  <p className="text-base"><span className="font-medium">예금주:</span> 시애라</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>입금 시 주의:</strong> 입금자명에 회원님의 성함을 정확히 기재해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notices;


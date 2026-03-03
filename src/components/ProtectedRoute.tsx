import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';
import { Clock, Mountain, LogOut, Mail, Phone, MapPin } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading, user, logout } = useAuth();

  // 로딩 중에는 로딩 화면 표시 (깜빡임 방지)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-700 mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">로그인 중입니다. 잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 미승인 사용자 → 승인 대기 중 페이지 표시
  if (user && !user.isApproved) {
    const handleLogout = async () => {
      await logout();
      window.location.href = '/';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* 로고 & 상태 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <Mountain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              시애라 클럽
            </h1>
          </div>

          {/* 승인 대기 카드 */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* 상태 배너 */}
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 text-base">승인 대기 중</p>
                  <p className="text-amber-700 text-sm">관리자가 가입 신청을 검토하고 있습니다</p>
                </div>
              </div>
            </div>

            {/* 내용 */}
            <div className="px-6 py-6">
              {/* 사용자 정보 */}
              {user.name && (
                <div className="mb-5 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-1">신청자</p>
                  <p className="font-semibold text-slate-900 text-lg">{user.name}</p>
                  {user.email && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-sm text-slate-500">{user.phoneNumber}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 안내 메시지 */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">1</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">가입 신청 완료</p>
                    <p className="text-xs text-slate-500">신청 정보가 접수되었습니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold animate-pulse">2</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">관리자 승인 대기</p>
                    <p className="text-xs text-slate-500">관리자가 신청을 확인하고 승인합니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">3</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-400">승인 완료 후 이용</p>
                    <p className="text-xs text-slate-400">모든 서비스를 자유롭게 이용하세요</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                <p className="text-xs text-blue-800 text-center leading-relaxed">
                  승인이 완료되면 다시 로그인하시면<br/>
                  홈페이지를 이용하실 수 있습니다.
                </p>
              </div>

              {/* 간편산행 신청 버튼 */}
              <Link
                to="/quick-apply"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-emerald-600/20 mb-3"
              >
                <MapPin className="w-4 h-4" />
                간편산행 신청하기
              </Link>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="card">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h2>
          <p className="text-xl text-gray-600 mb-6">
            관리자만 접근 가능한 페이지입니다.
          </p>
          <a href="/" className="btn-primary inline-block">
            홈으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
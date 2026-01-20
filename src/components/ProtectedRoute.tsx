import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContextEnhanced';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // 로딩 중에는 아무것도 렌더링하지 않음 (깜빡임 방지)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
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
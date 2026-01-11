import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

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


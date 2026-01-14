import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DevModeProvider } from './contexts/DevModeContext';
import { EventProvider } from './contexts/EventContext';
import { MemberProvider } from './contexts/MemberContext';
import { PoemProvider } from './contexts/PoemContext';
import { RulesProvider } from './contexts/RulesContext';
import { NoticeProvider } from './contexts/NoticeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// 코드 스플리팅 적용
const Landing = lazy(() => import('./pages/Landing'));
const AboutSierra = lazy(() => import('./pages/AboutSierra'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Board = lazy(() => import('./pages/Board'));
const Members = lazy(() => import('./pages/Members'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Profile = lazy(() => import('./pages/Profile'));
const ClubInfo = lazy(() => import('./pages/ClubInfo'));
const HikingHistory = lazy(() => import('./pages/HikingHistory'));
const GuestApplication = lazy(() => import('./pages/GuestApplication'));
const QuickEventApply = lazy(() => import('./pages/QuickEventApply'));
const EventManagement = lazy(() => import('./pages/Admin/EventManagement'));
const EventPrintView = lazy(() => import('./pages/Admin/EventPrintView'));
const MemberManagement = lazy(() => import('./pages/Admin/MemberManagement'));
const PaymentManagement = lazy(() => import('./pages/Admin/PaymentManagement'));
const AnnualFeeManagement = lazy(() => import('./pages/Admin/AnnualFeeManagement'));
const ExecutiveManagement = lazy(() => import('./pages/Admin/ExecutiveManagement'));
const ContentManagement = lazy(() => import('./pages/Admin/ContentManagement'));

// 로딩 컴포넌트
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

function App() {
  return (
    <DevModeProvider>
      <AuthProvider>
        <EventProvider>
          <MemberProvider>
            <PoemProvider>
              <RulesProvider>
                <NoticeProvider>
                  <Router>
                    <ScrollToTop />
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<AboutSierra />} />
            <Route path="/register" element={<Register />} />
            <Route path="/guest-application" element={<GuestApplication />} />
            <Route path="/quick-apply" element={<QuickEventApply />} />
            
            {/* Protected Member Routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Home />} />
              <Route path="events" element={<Events />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="board" element={<Board />} />
              <Route path="members" element={<Members />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="club-info" element={<ClubInfo />} />
              <Route path="hiking-history" element={<HikingHistory />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/members" replace />} />
              <Route path="members" element={<MemberManagement />} />
              <Route path="payment" element={<PaymentManagement />} />
              <Route path="annual-fee" element={<AnnualFeeManagement />} />
              <Route path="executives" element={<ExecutiveManagement />} />
              <Route path="events" element={<EventManagement />} />
              <Route path="content" element={<ContentManagement />} />
            </Route>
            
            {/* Print View - 별도 레이아웃 없이 */}
            <Route path="/admin/events/print/:eventId" element={
              <ProtectedRoute requireAdmin>
                <EventPrintView />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
                </Suspense>
              </Router>
                </NoticeProvider>
              </RulesProvider>
            </PoemProvider>
          </MemberProvider>
        </EventProvider>
      </AuthProvider>
    </DevModeProvider>
  );
}

export default App;

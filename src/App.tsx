import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DevModeProvider } from './contexts/DevModeContext';
import { EventProvider } from './contexts/EventContext';
import { MemberProvider } from './contexts/MemberContext';
import { PoemProvider } from './contexts/PoemContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import AboutSierra from './pages/AboutSierra';
import Register from './pages/Register';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Board from './pages/Board';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import ClubInfo from './pages/ClubInfo';
import HikingHistory from './pages/HikingHistory';
import GuestApplication from './pages/GuestApplication';
import QuickEventApply from './pages/QuickEventApply';
import EventManagement from './pages/Admin/EventManagement';
import EventPrintView from './pages/Admin/EventPrintView';
import MemberManagement from './pages/Admin/MemberManagement';
import PaymentManagement from './pages/Admin/PaymentManagement';
import AnnualFeeManagement from './pages/Admin/AnnualFeeManagement';
import ExecutiveManagement from './pages/Admin/ExecutiveManagement';
import PoemManagement from './pages/Admin/PoemManagement';
import RoutingTest from './pages/RoutingTest';

function App() {
  return (
    <DevModeProvider>
      <AuthProvider>
        <EventProvider>
          <MemberProvider>
            <PoemProvider>
              <Router>
                <ScrollToTop />
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
              <Route path="poems" element={<PoemManagement />} />
            </Route>
            
            {/* Print View - 별도 레이아웃 없이 */}
            <Route path="/admin/events/print/:eventId" element={
              <ProtectedRoute requireAdmin>
                <EventPrintView />
              </ProtectedRoute>
            } />
            
            {/* Dev Tools - 개발용 라우팅 테스트 */}
            <Route path="/dev" element={
              <ProtectedRoute requireAdmin>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="routing-test" element={<RoutingTest />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
            </PoemProvider>
          </MemberProvider>
        </EventProvider>
      </AuthProvider>
    </DevModeProvider>
  );
}

export default App;

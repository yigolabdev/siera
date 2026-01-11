import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import AboutSierra from './pages/AboutSierra';
import Register from './pages/Register';
import Home from './pages/Home';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import HikingInfo from './pages/HikingInfo';
import Board from './pages/Board';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import GuestApplication from './pages/GuestApplication';
import QuickEventApply from './pages/QuickEventApply';
import EventManagement from './pages/Admin/EventManagement';
import MemberManagement from './pages/Admin/MemberManagement';
import TeamManagement from './pages/Admin/TeamManagement';
import MembershipApproval from './pages/Admin/MembershipApproval';

function App() {
  return (
    <AuthProvider>
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
            <Route path="info" element={<HikingInfo />} />
            <Route path="board" element={<Board />} />
            <Route path="members" element={<Members />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/approval" replace />} />
            <Route path="approval" element={<MembershipApproval />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="teams" element={<TeamManagement />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

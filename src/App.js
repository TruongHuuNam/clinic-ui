import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from '@mui/material';

// --- Import Layout & Common Components ---
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// --- Import Page Components (ĐÃ ĐƯỢC CẬP NHẬT TÊN) ---
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage"; // Dùng SearchPage thay cho DoctorsPage
import DoctorDetailPage from "./pages/DoctorDetailPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage"; // Dùng BookingSuccessPage thay cho ConfirmationPage
import BookingFailurePage from "./pages/BookingFailurePage"; // Trang cho thanh toán thất bại
import UserProfilePage from "./pages/UserProfilePage";
import BookingHistory from "./pages/BookingHistory";

// --- Import Auth Components ---
import AuthPage from "./components/Auth/AuthPage";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";

// Component Layout chính
const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ paddingTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      {children}
    </main>
    <Footer />
  </>
);

// Component "Người Gác Cổng" cho các trang cần đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

// Component chứa toàn bộ logic định tuyến
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route element={<AppLayout><Outlet /></AppLayout>}>
        {/* =============================== */}
        {/* CÁC ROUTE CÔNG KHAI */}
        {/* =============================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/doctor/:id" element={<DoctorDetailPage />} />

        {/* =============================== */}
        {/* ROUTE XÁC THỰC */}
        {/* =============================== */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/profile" replace /> : <AuthPage />}
        />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* =============================== */}
        {/* CÁC ROUTE ĐƯỢC BẢO VỆ */}
        {/* =============================== */}
        <Route
          path="/booking/:doctorId"
          element={<ProtectedRoute><BookingPage /></ProtectedRoute>}
        />
        <Route
          path="/booking-success"
          element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>}
        />
        <Route
          path="/booking-failure"
          element={<ProtectedRoute><BookingFailurePage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><BookingHistory /></ProtectedRoute>}
        />

        {/* Route mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default App;
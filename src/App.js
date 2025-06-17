import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Box, CircularProgress } from '@mui/material';

// --- Import Layout & Common Components ---
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// --- Import Page Components ---
import HomePage from "./pages/HomePage";
import DoctorsPage from "./pages/DoctorsPage";          // TRANG DANH SÁCH BÁC SĨ (KẾT QUẢ TÌM KIẾM)
import DoctorDetailPage from "./pages/DoctorDetailPage";            // TRANG CHI TIẾT 1 BÁC SĨ (GIỮ NGUYÊN TÊN FILE)
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import BookingHistory from "./pages/BookingHistory";
import Review from "./pages/Review";
import SearchPage from "./pages/SearchPage";
// --- Import Auth Components ---
import AuthPage from "./components/Auth/AuthPage";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";

// Component Layout chính
const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content" style={{ paddingTop: '64px', minHeight: 'calc(100vh - 64px)' }}>
      {children}
    </main>
    <Footer />
  </>
);

// Component "Người Gác Cổng"
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

        {/* THÊM ROUTE CHO TRANG DANH SÁCH BÁC SĨ */}
        <Route path="/doctors" element={<DoctorsPage />} />

        {/* Giữ nguyên route chi tiết của bạn */}
        <Route path="/doctor/:id" element={<DoctorDetailPage />} />


        <Route path="/search" element={<SearchPage />} />
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
          path="/confirmation"
          element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><BookingHistory /></ProtectedRoute>}
        />
        <Route
          path="/review/:doctorId"
          element={<ProtectedRoute><Review /></ProtectedRoute>}
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

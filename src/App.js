// File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Page Components
import HomePage from "./pages/HomePage";
import DoctorPage from "./pages/DoctorPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import BookingHistory from "./pages/BookingHistory";
import Review from "./pages/Review";

// Auth Components
import AuthPage from "./components/Auth/AuthPage";
import OAuth2RedirectHandler from "./components/Auth/OAuth2RedirectHandler";
import "./services/authService";

// Component Layout chính, bao gồm Navbar và Footer
const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
    <Footer />
  </>
);

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ROUTE CÔNG KHAI */}
      <Route path="/" element={<HomePage />} />
      <Route path="/doctor/:id" element={<DoctorPage />} />

      {/* ROUTE XÁC THỰC */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/profile" /> : <AuthPage />} // Nếu đã đăng nhập, đá về trang profile
      />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* ROUTE ĐƯỢC BẢO VỆ */}
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

      {/* Route mặc định: nếu đã đăng nhập thì về profile, nếu chưa thì về trang chủ */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/"} />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AuthProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </AuthProvider>
  </Router>
);

export default App;
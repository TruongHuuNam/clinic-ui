import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import HomePage from "./pages/HomePage";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import BookingHistory from "./pages/BookingHistory";
import Review from "./pages/Review";
import DoctorPage from "./pages/DoctorPage";

const App = () => (
  <Router>
    <Navbar />
    <main className="main-content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/booking/:doctorId" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/history" element={<BookingHistory />} />
        <Route path="/review/:doctorId" element={<Review />} />
        <Route path="/doctor/:id" element={<DoctorPage />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

export default App;
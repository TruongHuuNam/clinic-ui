import api from './api'; // Sử dụng instance đã cấu hình

// Các API này không cần token nên có thể dùng trực tiếp
const requestOtp = (email) => {
    return api.post('/auth/request-otp', { email });
};

const registerAndSendOtp = (hoTen, email) => {
    return api.post('/auth/register-and-send-otp', { hoTen, email });
};

const verifyOtp = (email, otp) => {
    return api.post('/auth/verify-otp', { email, otp });
};

const loginInternal = (email, matKhau) => {
    return api.post('/auth/internal/login', { email, matKhau });
};

const initiateGoogleLogin = () => {
    // Đây là điều hướng trực tiếp, không phải là một API call bằng axios
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

const authService = {
    requestOtp,
    registerAndSendOtp,
    verifyOtp,
    loginInternal,
    initiateGoogleLogin,
};

export default authService;
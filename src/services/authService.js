// File: src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

const requestOtp = (email) => {
    return axios.post(`${API_URL}/request-otp`, { email });
};

const registerAndSendOtp = (hoTen, email) => {
    return axios.post(`${API_URL}/register-and-send-otp`, { hoTen, email });
};

const verifyOtp = (email, otp) => {
    return axios.post(`${API_URL}/verify-otp`, { email, otp });
};

const authService = {
    requestOtp,
    registerAndSendOtp,
    verifyOtp,
};

export default authService;
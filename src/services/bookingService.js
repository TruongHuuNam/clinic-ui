// src/services/bookingService.js
import api from './api';

/**
 * Tạo lịch hẹn và lấy URL thanh toán VNPAY.
 * Gọi đến: POST /api/bookings/create-and-initiate-payment
 */
const createBookingAndInitiatePayment = (bookingData) => {
    return api.post('/bookings/create-and-initiate-payment', bookingData);
};

/**
 * Lấy lịch sử đặt lịch của người dùng hiện tại.
 * Gọi đến: GET /api/bookings/my-history
 */
const getBookingHistory = () => {
    return api.get('/bookings/my-history');
};

/**
 * Lấy thông tin chi tiết của một lịch hẹn bằng mã code.
 * Gọi đến: GET /api/bookings/details-by-code/{bookingCode}
 */
const getDetailsByCode = (bookingCode) => {
    return api.get(`/bookings/details-by-code/${bookingCode}`);
};

const bookingService = {
    createBookingAndInitiatePayment,
    getBookingHistory,
    getDetailsByCode,
};

export default bookingService;
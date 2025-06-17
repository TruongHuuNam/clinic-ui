import api from './api';

const createProvisionalBooking = (bookingData) => {
    return api.post('/bookings', bookingData);
};

const initiatePayment = (bookingId) => {
    return api.post(`/bookings/${bookingId}/initiate-payment`);
};

const bookingService = { createProvisionalBooking, initiatePayment };
export default bookingService;
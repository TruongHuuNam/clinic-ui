import api from './api';
import { format } from 'date-fns';

const doctorService = {
    // API để lấy danh sách tóm tắt tất cả bác sĩ
    getAllDoctors: () => {
        return api.get('/doctors');
    },

    // API để lấy thông tin chi tiết của một bác sĩ
    getDoctorById: (id) => {
        return api.get(`/doctors/${id}`);
    },

    // API để lấy các slot giờ chi tiết trong một ngày
    getAvailableSlots: (id, date) => {
        // Luôn đảm bảo date là đối tượng Date hợp lệ
        const dateString = format(new Date(date), 'yyyy-MM-dd');
        return api.get(`/doctors/${id}/available-slots?date=${dateString}`);
    },

    // API mới để lấy số lượng lịch trống trong các ngày tới
    getUpcomingAvailability: (id, days = 30) => {
        return api.get(`/doctors/${id}/upcoming-availability?days=${days}`);
    }
};

export default doctorService;

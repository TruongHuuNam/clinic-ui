import api from './api'; // Sử dụng instance đã cấu hình

const getAllSpecialties = () => {
    return api.get('/chuyen-khoa');
};

const specialtyService = {
    getAllSpecialties,
};

export default specialtyService;
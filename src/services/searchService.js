// src/services/searchService.js

import api from './api';

// Hàm tìm kiếm bác sĩ đa năng (đã có, không đổi)
const searchDoctors = (params) => {
    // ... logic chuyển đổi params nếu cần ...
    return api.get('/search/doctors', { params });
};

// HÀM MỚI: Tìm kiếm chuyên khoa
const searchSpecialties = (params) => {
    return api.get('/search/specialties', { params });
};

const searchService = {
    searchDoctors,
    searchSpecialties, // Thêm hàm mới vào export
};

export default searchService;
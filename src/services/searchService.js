// src/services/searchService.js
import api from './api';

const searchDoctors = (filters) => {
    // Tạo một đối tượng params sạch, chỉ chứa các giá trị hợp lệ
    const cleanFilters = {};
    for (const key in filters) {
        const value = filters[key];
        // Chỉ thêm vào params nếu giá trị có thật (không null, undefined, rỗng)
        if (value !== null && value !== undefined && value !== '') {
            cleanFilters[key] = value;
        }
    }

    // Axios sẽ tự động xử lý việc chuyển đổi object thành query string đúng chuẩn
    // mà Spring Boot có thể hiểu được (ví dụ: lặp lại key cho mảng)
    return api.get('/search/doctors', { params: cleanFilters });
};

const searchService = {
    searchDoctors,
};

export default searchService;
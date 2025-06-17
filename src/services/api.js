import axios from 'axios';

const API_URL = "http://localhost:8080/api";
const TOKEN_KEY = "accessToken";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Interceptor chạy trước MỌI request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(TOKEN_KEY);

        console.log(`%c[Interceptor] Chuẩn bị gửi request tới: ${config.url}`, "color: purple; font-weight: bold;");

        if (token) {
            console.log(`   -> Đã tìm thấy token trong localStorage. Sẽ đính kèm vào header.`);
            config.headers['Authorization'] = 'Bearer ' + token;
        } else {
            // Đây là lý do chính gây ra lỗi 401
            console.error(`   -> LỖI: Không tìm thấy token! Request sẽ được gửi đi mà không có xác thực.`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
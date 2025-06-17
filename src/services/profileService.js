import api from './api'; // Đảm bảo import từ api.js

const getMyProfiles = () => {
    // Không cần truyền header nữa, interceptor sẽ tự làm
    return api.get('/patient/profiles');
};

const createProfile = (profileData) => {
    return api.post('/patient/profiles', profileData);
};

const profileService = { getMyProfiles, createProfile };
export default profileService;
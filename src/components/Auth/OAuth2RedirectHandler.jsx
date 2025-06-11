// File: src/components/auth/OAuth2RedirectHandler.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (token) {
            login(token);
            navigate('/dashboard'); // Chuyển đến trang chính
        } else {
            // Xử lý lỗi nếu có
            navigate('/login', { state: { error: error || 'Đăng nhập Google thất bại.' } });
        }
    }, [location, navigate, login]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang xử lý đăng nhập...</Typography>
        </Box>
    );
};

export default OAuth2RedirectHandler;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import từ AuthContext
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    // isLoading giúp tránh việc bị đá ra ngoài trong khi token đang được kiểm tra
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        // Lưu lại trang người dùng đang cố gắng truy cập
        // để sau khi đăng nhập có thể quay lại đúng trang đó.
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Nếu đã đăng nhập, cho phép truy cập
    return children;
};

export default ProtectedRoute;
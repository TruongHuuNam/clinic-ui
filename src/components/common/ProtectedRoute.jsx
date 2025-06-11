// File: src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth(); // Giả sử context có trạng thái loading
    const location = useLocation();

    // Nếu đang trong quá trình kiểm tra token từ localStorage, hiển thị loading
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Nếu không được xác thực, chuyển hướng đến trang đăng nhập
    if (!isAuthenticated) {
        // Lưu lại trang người dùng định đến để sau khi đăng nhập có thể quay lại
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Nếu đã xác thực, hiển thị component con
    return children;
};

export default ProtectedRoute;
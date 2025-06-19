// src/pages/BookingFailurePage.jsx

import React from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const BookingFailurePage = () => {
    const [searchParams] = useSearchParams();
    const errorReason = searchParams.get('error');

    const getErrorMessage = () => {
        if (errorReason === 'invalid_signature') {
            return "Đã có lỗi bảo mật xảy ra. Vui lòng không thay đổi đường dẫn thanh toán.";
        }
        return "Đã có lỗi xảy ra trong quá trình thanh toán hoặc giao dịch đã bị hủy. Lịch hẹn của bạn chưa được xác nhận.";
    }

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <ErrorOutline color="error" sx={{ fontSize: 70, mb: 2 }} />
                <Typography variant="h4" component="h1" fontWeight={700} color="error.main" gutterBottom>
                    Thanh toán thất bại
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {getErrorMessage()}
                </Typography>
                <Button component={RouterLink} to="/" variant="contained">
                    Quay về trang chủ
                </Button>
            </Paper>
        </Container>
    );
}

export default BookingFailurePage;
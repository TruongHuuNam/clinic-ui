// src/pages/BookingSuccessPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress, Alert, Button, Divider } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
// SỬA LẠI: Import service thật
import bookingService from '../services/bookingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BookingSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const bookingCode = searchParams.get('bookingCode');

    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!bookingCode) {
            setError('Không tìm thấy mã đặt lịch.');
            setLoading(false);
            return;
        }

        // SỬA LẠI: Gọi API backend thật sự
        bookingService.getDetailsByCode(bookingCode)
            .then(response => {
                setBookingDetails(response.data);
            })
            .catch(err => {
                console.error("Lỗi khi tải chi tiết lịch hẹn:", err);
                setError('Không thể tải thông tin lịch hẹn của bạn.');
            })
            .finally(() => {
                setLoading(false);
            });

    }, [bookingCode]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
    }

    if (!bookingDetails) {
        return <Container sx={{ py: 5 }}><Alert severity="warning">Không có thông tin chi tiết cho lịch hẹn này.</Alert></Container>;
    }

    return (
        <Container maxWidth="sm" sx={{ my: 4 }}>
            <Paper sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center', borderRadius: 3 }}>
                <CheckCircleOutline color="success" sx={{ fontSize: 70, mb: 2 }} />
                <Typography variant="h4" component="h1" fontWeight={700} color="success.main" gutterBottom>
                    Đặt lịch thành công!
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Một email xác nhận kèm mã QR đã được gửi đến bạn. Vui lòng đưa mã QR này cho nhân viên tại quầy lễ tân khi đến khám.
                </Typography>

                <Paper variant="outlined" sx={{ p: 2, my: 2, display: 'inline-block' }}>
                    {/* Sửa lại: Dùng URL QR code từ API */}
                    <img src={bookingDetails.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingDetails.maDatLich}`} alt={`QR Code for booking ${bookingDetails.maDatLich}`} style={{ maxWidth: '180px', height: 'auto' }} />
                    <Typography fontWeight="bold" variant="h6" letterSpacing={1}>{bookingDetails.maDatLich}</Typography>
                </Paper>

                <Divider sx={{ my: 3 }}>Thông tin lịch hẹn</Divider>

                <Box sx={{ textAlign: 'left', '& p': { mb: 1.5 } }}>
                    {/* SỬA LẠI: Hiển thị dữ liệu thật từ state */}
                    <Typography><strong>Bệnh nhân:</strong> {bookingDetails.hoTenBenhNhan}</Typography>
                    <Typography><strong>Bác sĩ:</strong> {bookingDetails.hoTenBacSi} ({bookingDetails.chuyenKhoa})</Typography>
                    <Typography><strong>Thời gian:</strong> {format(new Date(bookingDetails.thoiGianHen), 'HH:mm - EEEE, dd/MM/yyyy', { locale: vi })}</Typography>
                    <Typography><strong>Địa điểm:</strong> {bookingDetails.diaChiPhongKham}</Typography>
                </Box>

                <Button component={RouterLink} to="/history" variant="contained" sx={{ mt: 3, mr: 1 }}>
                    Xem lịch sử đặt lịch
                </Button>
                <Button component={RouterLink} to="/" variant="outlined" sx={{ mt: 3 }}>
                    Về trang chủ
                </Button>
            </Paper>
        </Container>
    );
};

export default BookingSuccessPage;
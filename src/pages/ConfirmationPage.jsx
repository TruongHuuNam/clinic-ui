import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate, useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Dữ liệu mẫu, thực tế lấy từ location.state hoặc context
  const appointment = location.state?.appointment || {
    id: 'ABC123',
    doctor: { name: 'GS.TS.BS Lê Văn Cường', specialty: 'Nội tổng quát' },
    date: '2025-05-27',
    time: '09:00',
    clinic: { name: 'Phòng khám Tư Hello Clinic', address: '180 Cao Lỗ, Phường 4, Q.8, TP.HCM' },
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
          Đặt lịch thành công!
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Thông tin lịch hẹn đã được gửi về email của bạn. Vui lòng trình mã QR này khi đến phòng khám.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <QRCodeSVG value={`appointment:${appointment.id}`} size={180} />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Thông tin lịch hẹn</Typography>
        <Typography>Bác sĩ: {appointment.doctor.name} ({appointment.doctor.specialty})</Typography>
        <Typography>Thời gian: {appointment.date} - {appointment.time}</Typography>
        <Typography>Địa điểm: {appointment.clinic.name}</Typography>
        <Typography>Địa chỉ: {appointment.clinic.address}</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>Về trang chủ</Button>
      </Paper>
    </Container>
  );
};

export default ConfirmationPage;

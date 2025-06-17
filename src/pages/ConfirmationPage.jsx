// File: src/pages/ConfirmationPage.jsx (Phiên bản đã sửa lỗi)
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Box, Button, Divider,
  CircularProgress, Alert, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
// ✅ FIX: Import thêm các Icon bị thiếu
import { Person, MedicalServices, CalendarMonth, AccessTime, Payments, EditNote } from '@mui/icons-material';
import { format } from 'date-fns';
import bookingService from '../services/bookingService';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: Bỏ `setSummary` không cần thiết
  const [summary] = useState(location.state?.summary);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!summary) {
      navigate('/');
    }
  }, [summary, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bookingService.initiatePayment(summary.maLichHen);
      window.location.href = response.data.paymentUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Không thể khởi tạo thanh toán.");
      setLoading(false);
    }
  };

  if (!summary) return null;

  return (
    <Container maxWidth="sm" sx={{ my: 5 }}>
      <Paper elevation={5} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Xác nhận Thông tin Lịch hẹn
          </Typography>
          <Typography color="text.secondary">
            Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi thanh toán.
          </Typography>
        </Box>
        <Divider sx={{ my: 3 }} />

        <Box mb={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Thông tin Bệnh nhân</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><Person color="primary" /></ListItemIcon>
              <ListItemText primary="Họ và tên" secondary={summary.hoTenBenhNhan} />
            </ListItem>
            <ListItem>
              {/* ✅ FIX: Component EditNote đã được import */}
              <ListItemIcon><EditNote color="primary" /></ListItemIcon>
              <ListItemText primary="Lý do khám" secondary={summary.lyDoKham || "Không có"} />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box mb={3}>
          <Typography variant="h6" fontWeight={600} gutterBottom>Thông tin Buổi khám</Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><MedicalServices color="primary" /></ListItemIcon>
              <ListItemText primary={summary.hoTenBacSi} secondary={summary.chuyenKhoa} />
            </ListItem>
            <ListItem>
              <ListItemIcon><CalendarMonth color="primary" /></ListItemIcon>
              <ListItemText primary="Ngày khám" secondary={format(new Date(summary.thoiGianHen), 'EEEE, dd/MM/yyyy')} />
            </ListItem>
            <ListItem>
              <ListItemIcon><AccessTime color="primary" /></ListItemIcon>
              <ListItemText primary="Giờ khám" secondary={format(new Date(summary.thoiGianHen), 'HH:mm')} />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="primary.lighter" borderRadius={2}>
          <Typography variant="h6" fontWeight={700}>Tổng chi phí</Typography>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            {summary.chiPhi.toLocaleString('vi-VN')} VNĐ
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={loading}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Payments />}
            onClick={handlePayment}
            disabled={loading}
          >
            Xác nhận & Thanh toán
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ConfirmationPage;
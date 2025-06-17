import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext'; // Import từ AuthContext của bạn
import doctorService from '../services/doctorService';
import bookingService from '../services/bookingService';
import { Box, Typography, Button, Grid, CircularProgress, Container, Paper, TextField, Divider } from '@mui/material';

// --- Dữ liệu giả lập cho Demo ---
const DEMO_DOCTOR_ID = 1; // ID của bác sĩ bạn đã tạo trong DB
const DEMO_PATIENT_PROFILE_ID = 1; // ID hồ sơ bệnh nhân của user test

const BookingDemoPage = () => {
    const { isAuthenticated, user, login, logout } = useAuth(); // Lấy từ context

    // State cho việc chọn lịch
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    // State cho form xác nhận
    const [lyDoKham, setLyDoKham] = useState('');
    const [error, setError] = useState('');
    const [loadingBooking, setLoadingBooking] = useState(false);

    // Hàm để tải các slot trống
    const fetchSlots = async (date) => {
        setLoadingSlots(true);
        try {
            const response = await doctorService.getAvailableSlots(DEMO_DOCTOR_ID, date);
            setSlots(response.data);
        } catch (error) {
            console.error("Lỗi khi tải lịch khám:", error);
            setSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    // Tải slot lần đầu khi component được mount
    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    // Hàm xử lý khi chọn một slot
    const handleSlotClick = (slot) => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để tiếp tục!");
            // TODO: Có thể chuyển hướng đến trang /auth
            return;
        }
        setSelectedSlot(slot);
    };

    // Hàm xử lý khi xác nhận đặt lịch
    const handleConfirmBooking = async () => {
        if (!lyDoKham) {
            setError("Vui lòng nhập lý do khám.");
            return;
        }
        setLoadingBooking(true);
        setError('');
        try {
            const bookingData = {
                maSlot: selectedSlot.maSlot,
                maHoSoBenhNhan: DEMO_PATIENT_PROFILE_ID,
                lyDoKham: lyDoKham,
            };
            const response = await bookingService.createBooking(bookingData);
            alert("Khởi tạo đặt lịch thành công! Chuẩn bị chuyển đến trang thanh toán...");
            console.log("URL thanh toán:", response.data.paymentUrl);
            // Chuyển hướng đến cổng thanh toán
            window.location.href = response.data.paymentUrl;
        } catch (err) {
            setError(err.response?.data?.message || "Đặt lịch thất bại.");
        } finally {
            setLoadingBooking(false);
        }
    };

    // UI cho phần đăng nhập (nếu cần)
    // Để đơn giản, bạn có thể đăng nhập ở trang /auth trước rồi vào trang demo này
    if (!isAuthenticated) {
        return <Typography sx={{ p: 4 }}>Vui lòng đăng nhập với tài khoản bệnh nhân `patient.test@gmail.com` tại trang `/auth` để bắt đầu demo.</Typography>
    }

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Đặt lịch</Typography>
                <Typography>Bác sĩ: GS.TS Nguyễn Văn B (Khoa Tim mạch)</Typography>
                <Divider sx={{ my: 3 }} />

                {!selectedSlot ? (
                    <>
                        <Typography variant="h6">1. Chọn ngày và giờ khám</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} />
                        </Box>
                        {loadingSlots ? <CircularProgress /> : (
                            <Grid container spacing={1} sx={{ mt: 2 }}>
                                {slots.length > 0 ? slots.map(slot => (
                                    <Grid item xs={3} sm={2} key={slot.maSlot}>
                                        <Button variant={selectedSlot?.maSlot === slot.maSlot ? "contained" : "outlined"} fullWidth onClick={() => handleSlotClick(slot)}>
                                            {format(new Date(slot.thoiGianBatDau), 'HH:mm')}
                                        </Button>
                                    </Grid>
                                )) : <Typography sx={{ p: 2 }}>Không có lịch trống cho ngày này.</Typography>}
                            </Grid>
                        )}
                    </>
                ) : (
                    <>
                        <Typography variant="h6">2. Xác nhận thông tin</Typography>
                        <Box my={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                            <Typography><strong>Bệnh nhân:</strong> {user.fullName} (Hồ sơ mặc định)</Typography>
                            <Typography><strong>Bác sĩ:</strong> GS.TS Nguyễn Văn B</Typography>
                            <Typography><strong>Thời gian:</strong> {format(new Date(selectedSlot.thoiGianBatDau), 'HH:mm, dd/MM/yyyy')}</Typography>
                            <Typography><strong>Chi phí:</strong> {selectedSlot.chiPhi.toLocaleString('vi-VN')} VNĐ</Typography>
                        </Box>
                        <TextField
                            label="Lý do khám hoặc triệu chứng"
                            fullWidth
                            multiline
                            rows={3}
                            value={lyDoKham}
                            onChange={(e) => setLyDoKham(e.target.value)}
                            sx={{ my: 2 }}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button variant="text" onClick={() => setSelectedSlot(null)}>Chọn lại giờ khác</Button>
                            <Button variant="contained" size="large" onClick={handleConfirmBooking} disabled={loadingBooking}>
                                {loadingBooking ? <CircularProgress size={24} /> : `Thanh toán & Hoàn tất`}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default BookingDemoPage;
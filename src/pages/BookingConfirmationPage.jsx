// File: src/pages/BookingConfirmationPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import bookingService from '../services/bookingService';
import { Container, Paper, Typography, Box, Grid, TextField, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, Divider, Alert } from '@mui/material';
import { format } from 'date-fns';

const BookingConfirmationPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [bookingIntent, setBookingIntent] = useState(() => {
        if (location.state?.bookingIntent) return location.state.bookingIntent;
        const savedIntent = sessionStorage.getItem('bookingIntent');
        return savedIntent ? JSON.parse(savedIntent) : null;
    });

    const [profiles, setProfiles] = useState([]);
    const [selectedProfileId, setSelectedProfileId] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newProfileData, setNewProfileData] = useState({ hoTenBenhNhan: '', ngaySinh: '', gioiTinh: '', soDienThoai: '' });
    const [lyDoKham, setLyDoKham] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sessionStorage.getItem('bookingIntent')) {
            sessionStorage.removeItem('bookingIntent');
        }
        if (!bookingIntent) {
            navigate('/');
            return;
        }

        profileService.getMyProfiles()
            .then(response => {
                setProfiles(response.data);
                if (response.data.length > 0) {
                    setSelectedProfileId(response.data[0].maHoSo);
                    setFormDataFromProfile(response.data[0]);
                } else {
                    setIsCreatingNew(true);
                    setNewProfileData(prev => ({ ...prev, hoTenBenhNhan: user.fullName }));
                }
            })
            .catch(err => setError("Lỗi khi tải hồ sơ."))
            .finally(() => setLoading(false));
    }, [bookingIntent, navigate, user.fullName]);

    const setFormDataFromProfile = (profile) => {
        setNewProfileData({
            hoTenBenhNhan: profile.hoTenBenhNhan || '',
            ngaySinh: profile.ngaySinh ? format(new Date(profile.ngaySinh), 'yyyy-MM-dd') : '',
            gioiTinh: profile.gioiTinh || '',
            soDienThoai: profile.soDienThoai || ''
        });
    };

    const handleProfileChange = (e) => {
        const id = e.target.value;
        setSelectedProfileId(id);
        if (id === 'new') {
            setIsCreatingNew(true);
            setNewProfileData({ hoTenBenhNhan: '', ngaySinh: '', gioiTinh: '', soDienThoai: '' });
        } else {
            setIsCreatingNew(false);
            const selected = profiles.find(p => p.maHoSo === id);
            if (selected) setFormDataFromProfile(selected);
        }
    };

    const handleConfirmAndPay = async () => {
        setLoading(true);
        setError('');
        let profileIdToUse = selectedProfileId;

        try {
            if (isCreatingNew) {
                // TODO: Thêm validation cho form
                const newProfileResponse = await profileService.createProfile(newProfileData);
                profileIdToUse = newProfileResponse.data.maHoSo;
            }

            if (!profileIdToUse) {
                throw new Error("Vui lòng chọn hoặc tạo hồ sơ bệnh nhân.");
            }

            const bookingData = {
                maSlot: bookingIntent.slotInfo.maSlot,
                maHoSoBenhNhan: profileIdToUse,
                lyDoKham: lyDoKham,
            };
            const bookingResponse = await bookingService.createBooking(bookingData);

            // Chuyển hướng đến cổng thanh toán
            window.location.href = bookingResponse.data.paymentUrl;
        } catch (err) {
            setError(err.response?.data?.message || "Đã có lỗi xảy ra khi đặt lịch.");
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (!bookingIntent) return null;

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>Xác nhận & Hoàn tất Thông tin</Typography>
                <Divider sx={{ my: 2 }} />

                <Box mb={4} p={2} border={1} borderColor="grey.200" borderRadius={2}>
                    <Typography variant="h6">1. Thông tin buổi khám</Typography>
                    <Typography><strong>Bác sĩ:</strong> {bookingIntent.doctorName}</Typography>
                    <Typography><strong>Thời gian:</strong> {format(new Date(bookingIntent.slotInfo.thoiGianBatDau), 'HH:mm - dd/MM/yyyy')}</Typography>
                    <Typography><strong>Chi phí đặt lịch:</strong> {bookingIntent.slotInfo.chiPhi?.toLocaleString('vi-VN')} VNĐ</Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>2. Thông tin người đến khám</Typography>
                    {profiles.length > 0 && (
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Chọn hồ sơ bệnh nhân</InputLabel>
                            <Select value={selectedProfileId} label="Chọn hồ sơ bệnh nhân" onChange={handleProfileChange}>
                                {profiles.map(p => <MenuItem key={p.maHoSo} value={p.maHoSo}>{p.hoTenBenhNhan} ({p.quanHeVoiNguoiDat})</MenuItem>)}
                                <MenuItem value="new">+ Tạo hồ sơ mới cho người thân</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {isCreatingNew && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}><TextField label="Họ tên bệnh nhân" fullWidth name="hoTenBenhNhan" value={newProfileData.hoTenBenhNhan} onChange={e => setNewProfileData({ ...newProfileData, hoTenBenhNhan: e.target.value })} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Ngày sinh" type="date" fullWidth name="ngaySinh" value={newProfileData.ngaySinh} onChange={e => setNewProfileData({ ...newProfileData, ngaySinh: e.target.value })} InputLabelProps={{ shrink: true }} /></Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField select label="Giới tính" fullWidth name="gioiTinh" value={newProfileData.gioiTinh} onChange={e => setNewProfileData({ ...newProfileData, gioiTinh: e.target.value })}>
                                    <MenuItem value="Nam">Nam</MenuItem><MenuItem value="Nữ">Nữ</MenuItem><MenuItem value="Khác">Khác</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}><TextField label="Số điện thoại" fullWidth name="soDienThoai" value={newProfileData.soDienThoai} onChange={e => setNewProfileData({ ...newProfileData, soDienThoai: e.target.value })} /></Grid>
                        </Grid>
                    )}
                </Box>

                <Box mt={3}>
                    <Typography variant="h6" gutterBottom>3. Lý do khám</Typography>
                    <TextField label="Nhập triệu chứng sơ bộ (không bắt buộc)" fullWidth multiline rows={3} value={lyDoKham} onChange={(e) => setLyDoKham(e.target.value)} />
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <Box mt={4} sx={{ textAlign: 'right' }}>
                    <Button variant="contained" size="large" onClick={handleConfirmAndPay} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Xác nhận & Thanh toán'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default BookingConfirmationPage;
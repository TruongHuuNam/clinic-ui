import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Button, TextField, MenuItem, Stack, Alert, Avatar, Paper, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

const specialties = [
  { id: 1, name: 'Nội tổng quát' },
  { id: 2, name: 'Nhi khoa' },
  { id: 3, name: 'Tai mũi họng' },
];
const doctors = [
  { id: 1, name: 'GS.TS.BS Lê Văn Cường', specialtyId: 1 },
  { id: 2, name: 'BS. Nguyễn Thị Hoa', specialtyId: 2 },
];
const slots = [
  '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45',
];
const clinicInfo = {
  name: 'HelloClinic',
  address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh',
};

const BookingPage = () => {
  const location = useLocation();
  const doctorState = location.state?.doctor;
  const [step, setStep] = useState(1);
  const [specialty, setSpecialty] = useState(doctorState ? doctorState.specialty : '');
  const [doctor, setDoctor] = useState(doctorState ? doctorState.id : '');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [slot, setSlot] = useState('');
  const [softLockedSlot, setSoftLockedSlot] = useState(null);
  const [info, setInfo] = useState({ name: '', phone: '', email: '', dob: '', gender: '', reason: '' });
  const [error, setError] = useState('');

  // Lọc bác sĩ theo chuyên khoa
  const filteredDoctors = specialty ? doctors.filter(d => d.specialtyId === Number(specialty)) : doctors;

  // Nếu có doctorState thì lấy schedule từ đó, ngược lại dùng slots mẫu
  const availableSchedule = doctorState?.schedule || [];
  const availableDates = availableSchedule.map(s => s.date);
  const slotsForDate = availableSchedule.find(s => s.date === date)?.slots || slots;

  // Disable ngày trước ngày hiện tại
  const today = dayjs().format('YYYY-MM-DD');
  const isPastDate = (d) => dayjs(d).isBefore(today, 'day');
  // Disable slot đã qua nếu là ngày hôm nay
  const isPastSlot = (slotTime) => {
    if (date !== today) return false;
    const now = dayjs();
    const [h, m] = slotTime.split(':');
    const slotDate = dayjs().hour(Number(h)).minute(Number(m));
    return now.isAfter(slotDate);
  };

  const handleSlotChange = (s) => {
    setSlot(s);
    setSoftLockedSlot(s);
    setError('');
  };

  const handleNext = () => {
    if (step === 1 && (!date || !slot)) {
      setError('Vui lòng chọn đầy đủ thông tin.');
      return;
    }
    if (step === 2 && (!info.name || !info.phone || !info.email || !info.dob || !info.gender)) {
      setError('Vui lòng nhập đầy đủ thông tin cá nhân.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Đặt lịch khám</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {step === 1 && (
        <Box>
          {doctorState && (
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', gap: 3, bgcolor: '#f5faff', border: '1px solid #e3eafc', borderRadius: 3 }}>
              <Avatar src={doctorState.avatar} sx={{ width: 80, height: 80, mr: 3 }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>{doctorState.name}</Typography>
                <Typography variant="body1" color="primary.main" fontWeight={600}>{doctorState.specialty}</Typography>
                <Typography variant="body2" color="text.secondary">{clinicInfo.name} - {clinicInfo.address}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip label="★ 4.9" color="warning" size="small" />
                  <Chip label="120 lượt đặt" color="info" size="small" />
                  <Chip label="Giá 400.000 đ" color="success" size="small" />
                </Stack>
              </Box>
            </Paper>
          )}
          <Grid container spacing={2}>
            {!doctorState && (
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Chuyên khoa"
                  value={specialty}
                  onChange={e => { setSpecialty(e.target.value); setDoctor(''); }}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {specialties.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </TextField>
                <TextField
                  select
                  label="Bác sĩ"
                  value={doctor}
                  onChange={e => setDoctor(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  disabled={!specialty}
                >
                  {filteredDoctors.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12} sm={doctorState ? 12 : 8}>
              <TextField
                type="date"
                label="Ngày khám"
                value={date}
                onChange={e => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
                inputProps={{ min: today, ...(doctorState && { max: availableDates[availableDates.length - 1] }) }}
                select={!!doctorState}
              >
                {doctorState && availableDates.map(d => (
                  <MenuItem key={d} value={d} disabled={isPastDate(d)}>{d}</MenuItem>
                ))}
              </TextField>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>Chọn khung giờ khám:</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {slotsForDate.map(s => (
                  <Button
                    key={s}
                    variant={slot === s ? 'contained' : 'outlined'}
                    color={softLockedSlot === s ? 'primary' : 'inherit'}
                    onClick={() => handleSlotChange(s)}
                    disabled={isPastSlot(s)}
                    sx={{ mb: 1 }}
                  >
                    {s}
                  </Button>
                ))}
              </Stack>
              {softLockedSlot && <Typography color="primary" sx={{ mt: 1 }}>Khung giờ {softLockedSlot} đang được giữ cho bạn trong 5 phút.</Typography>}
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" size="large" onClick={handleNext}>Tiếp tục</Button>
          </Box>
        </Box>
      )}
      {step === 2 && (
        <Box maxWidth={500} mx="auto">
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Thông tin cá nhân</Typography>
          <TextField label="Họ và tên" fullWidth sx={{ mb: 2 }} value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} />
          <TextField label="Số điện thoại" fullWidth sx={{ mb: 2 }} value={info.phone} onChange={e => setInfo({ ...info, phone: e.target.value })} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={info.email} onChange={e => setInfo({ ...info, email: e.target.value })} />
          <TextField label="Ngày sinh" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={info.dob} onChange={e => setInfo({ ...info, dob: e.target.value })} />
          <TextField select label="Giới tính" fullWidth sx={{ mb: 2 }} value={info.gender} onChange={e => setInfo({ ...info, gender: e.target.value })}>
            <MenuItem value="male">Nam</MenuItem>
            <MenuItem value="female">Nữ</MenuItem>
            <MenuItem value="other">Khác</MenuItem>
          </TextField>
          <TextField label="Lý do khám / Triệu chứng" fullWidth multiline rows={3} sx={{ mb: 2 }} value={info.reason} onChange={e => setInfo({ ...info, reason: e.target.value })} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" sx={{ mr: 2 }} onClick={() => setStep(1)}>Quay lại</Button>
            <Button variant="contained" onClick={handleNext}>Xác nhận & Thanh toán</Button>
          </Box>
        </Box>
      )}
      {step === 3 && (
        <Box textAlign="center" sx={{ py: 6 }}>
          <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>Đặt lịch thành công!</Typography>
          <Typography>Thông tin đặt lịch đã được gửi về email của bạn. Vui lòng kiểm tra email để nhận mã QR khi đến khám.</Typography>
          <Button variant="contained" sx={{ mt: 3 }} href="/">Về trang chủ</Button>
        </Box>
      )}
    </Container>
  );
};

export default BookingPage;

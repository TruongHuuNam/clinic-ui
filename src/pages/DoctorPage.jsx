// pages/DoctorPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Container, Paper, Tabs, Tab, Button, Avatar, Grid, Chip, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const mockDoctor = {
  id: 1,
  name: 'GS.TS.BS Lê Văn Cường',
  specialty: 'Nội tổng quát',
  degree: 'Giáo sư, Tiến sĩ, Bác sĩ',
  experience: 22,
  bio: 'Bác sĩ chuyên khoa Nội tổng quát với hơn 20 năm kinh nghiệm. Tốt nghiệp Đại học Y Dược TP.HCM, từng công tác tại các bệnh viện lớn. Chuyên khám, tư vấn, điều trị các bệnh nội khoa, tim mạch, tiểu đường, huyết áp.',
  avatar: 'https://cdn-healthcare.hellohealthgroup.com/2023/09/1695530410_650fbdaa21ee74.98331766.jpg',
  rating: 4.9,
  bookingCount: 120,
  clinic: 'HelloClinic',
  address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh',
  services: [
    { id: 1, name: 'Khám tổng quát' },
    { id: 2, name: 'Khám tim mạch' },
    { id: 3, name: 'Tư vấn tiểu đường' },
  ],
  schedule: [
    { date: '2025-06-03', slots: ['09:00', '09:15', '09:30', '10:00', '10:15'] },
    { date: '2025-06-04', slots: ['09:00', '09:15', '09:30', '10:00', '10:15'] },
  ],
  reviews: [
    { user: 'Nguyen Van A', rating: 5, comment: 'Bác sĩ rất tận tâm!' },
    { user: 'Le Thi B', rating: 4, comment: 'Khám kỹ, tư vấn rõ ràng.' },
  ],
};

const DoctorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const doctor = mockDoctor;
  const today = dayjs().format('YYYY-MM-DD');
  const now = dayjs();

  // Disable slot đã qua nếu là ngày hôm nay
  const isPastSlot = (date, slotTime) => {
    if (date !== today) return false;
    const [h, m] = slotTime.split(':');
    const slotDate = dayjs().hour(Number(h)).minute(Number(m));
    return now.isAfter(slotDate);
  };
  // Disable ngày đã qua
  const isPastDate = (date) => dayjs(date).isBefore(today, 'day');

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={doctor.avatar} sx={{ width: 120, height: 120, mr: 4 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>{doctor.name}</Typography>
            <Typography color="text.secondary" fontWeight={600}>{doctor.degree}</Typography>
            <Typography color="primary.main" fontWeight={600}>{doctor.specialty}</Typography>
            <Typography color="text.secondary">Kinh nghiệm: {doctor.experience} năm</Typography>
            <Typography color="warning.main">★ {doctor.rating} | {doctor.bookingCount} lượt đặt</Typography>
            <Typography color="text.secondary">{doctor.clinic} - {doctor.address}</Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" size="large" onClick={() => navigate(`/booking/${doctor.id}`, { state: { doctor: { id: doctor.id, name: doctor.name, avatar: doctor.avatar, specialty: doctor.specialty, schedule: doctor.schedule } } })}>Đặt lịch khám</Button>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Thông tin" />
          <Tab label="Lịch khám" />
          <Tab label="Dịch vụ" />
          <Tab label="Đánh giá" />
        </Tabs>
        {tab === 0 && (
          <Box>
            <Typography fontWeight={600} sx={{ mb: 1 }}>Giới thiệu</Typography>
            <Typography sx={{ mb: 2 }}>{doctor.bio}</Typography>
            <Typography fontWeight={600}>Chuyên khoa: <Chip label={doctor.specialty} color="primary" /></Typography>
            <Typography fontWeight={600} sx={{ mt: 1 }}>Địa chỉ phòng khám:</Typography>
            <Typography>{doctor.clinic} - {doctor.address}</Typography>
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography fontWeight={600} sx={{ mb: 2 }}>Lịch khám sắp tới:</Typography>
            {doctor.schedule.map(sch => (
              <Box key={sch.date} sx={{ mb: 2 }}>
                <Typography fontWeight={600}>{sch.date}:</Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {sch.slots.map(slot => (
                    <Grid item key={slot}>
                      <Button size="small" variant="outlined" disabled={isPastDate(sch.date) || isPastSlot(sch.date, slot)}>{slot}</Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <Typography fontWeight={600} sx={{ mb: 2 }}>Dịch vụ bác sĩ cung cấp:</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {doctor.services.map(s => (
                <Chip key={s.id} label={s.name} color="primary" sx={{ mb: 1 }} />
              ))}
            </Stack>
          </Box>
        )}
        {tab === 3 && (
          <Box>
            <Typography fontWeight={600} sx={{ mb: 2 }}>Đánh giá của bệnh nhân:</Typography>
            {doctor.reviews.map((r, idx) => (
              <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight={600}>{r.user}</Typography>
                <Typography color="warning.main">★ {r.rating}</Typography>
                <Typography>{r.comment}</Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default DoctorPage;
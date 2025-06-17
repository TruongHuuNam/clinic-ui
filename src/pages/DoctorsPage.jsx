import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Tabs, Tab, Button, Avatar, Grid, Chip, Stack, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import doctorService from '../services/doctorService';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
    </div>
  );
};

const DoctorsPage = () => {
  const { id: doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!doctorId) {
      setError("Không tìm thấy ID bác sĩ.");
      setLoading(false);
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const [infoRes, slotsRes] = await Promise.all([
          doctorService.getDoctorById(doctorId),
          doctorService.getAvailableSlots(doctorId, new Date()) // Lấy lịch ngày hôm nay mặc định
        ]);

        setDoctor(infoRes.data);

        // Xử lý nhóm slot theo ngày
        const groupedSchedule = slotsRes.data.reduce((acc, slot) => {
          const date = format(parseISO(slot.thoiGianBatDau), 'yyyy-MM-dd');
          const time = format(parseISO(slot.thoiGianBatDau), 'HH:mm');
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(time);
          return acc;
        }, {});

        const scheduleArray = Object.keys(groupedSchedule).map(date => ({
          date,
          slots: groupedSchedule[date]
        }));
        setSchedule(scheduleArray);

      } catch (err) {
        console.error("Lỗi khi tải thông tin bác sĩ:", err);
        setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  const handleBookingClick = () => {
    // Điều hướng đến trang booking với state chứa thông tin bác sĩ
    navigate(`/booking/${doctorId}`, { state: { doctor } });
  };

  if (loading) return <Container sx={{ py: 5, textAlign: 'center' }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ py: 5 }}><Alert severity="error">{error}</Alert></Container>;
  if (!doctor) return <Container sx={{ py: 5 }}><Alert severity="info">Không tìm thấy thông tin bác sĩ.</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={doctor.hinhAnhUrl} sx={{ width: 120, height: 120, mr: 4 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>{doctor.hoTen}</Typography>
            <Typography color="text.secondary" fontWeight={600}>{doctor.hocVi}</Typography>
            <Typography color="primary.main" fontWeight={600}>{doctor.chuyenKhoa}</Typography>
            <Typography color="text.secondary">Kinh nghiệm: {doctor.kinhNghiem} năm</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="contained" size="large" onClick={handleBookingClick}>Đặt lịch khám</Button>
        </Box>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Thông tin" />
          <Tab label="Lịch khám" />
          <Tab label="Đánh giá" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <Typography fontWeight={600} sx={{ mb: 1 }}>Giới thiệu</Typography>
          <Typography sx={{ mb: 2 }}>{doctor.moTa}</Typography>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Typography fontWeight={600} sx={{ mb: 2 }}>Lịch khám sắp tới:</Typography>
          {schedule.length > 0 ? schedule.map(sch => (
            <Box key={sch.date} sx={{ mb: 2 }}>
              <Typography fontWeight={600}>{format(parseISO(sch.date), 'EEEE, dd/MM/yyyy', { locale: vi })}:</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {sch.slots.map(slot => (
                  <Grid item key={slot}>
                    <Button size="small" variant="outlined">{slot}</Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )) : <Typography>Bác sĩ chưa có lịch khám được thiết lập.</Typography>}
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Typography>Chức năng đánh giá đang được phát triển.</Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default DoctorsPage;

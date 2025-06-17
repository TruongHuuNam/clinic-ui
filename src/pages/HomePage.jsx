// src/pages/HomePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Grid, TextField, Button, Card, CardContent,
  CardMedia, Paper, Avatar, CircularProgress, Alert, Tabs, Tab, Stack
} from '@mui/material';
import { Search, EventAvailable, VerifiedUser, SupportAgent, Star, ArrowForwardIos, FormatQuote } from '@mui/icons-material';
import doctorService from '../services/doctorService';
import specialtyService from '../services/specialtyService';

// Component con cho các thẻ "Tại sao chọn chúng tôi?"
const FeatureCard = ({ icon, title, description }) => (
  <Box sx={{ p: 3, textAlign: 'center', height: '100%' }}>
    <Avatar sx={{ bgcolor: 'primary.light', width: 64, height: 64, margin: '0 auto 16px' }}>{icon}</Avatar>
    <Typography variant="h6" fontWeight={600} gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </Box>
);

// Component con cho thẻ đánh giá
const TestimonialCard = ({ text, author, title }) => (
  <Paper variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
    <FormatQuote sx={{ fontSize: 40, color: 'primary.main', transform: 'rotate(180deg)' }} />
    <Typography variant="body1" sx={{ my: 2, fontStyle: 'italic', flexGrow: 1 }}>{text}</Typography>
    <Box>
      <Typography fontWeight="bold">{author}</Typography>
      <Typography variant="caption" color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [allDoctors, setAllDoctors] = useState([]);
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTab, setSearchTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const testimonials = [
    { text: "Dịch vụ tuyệt vời! Tôi đã đặt lịch rất dễ dàng và bác sĩ rất tận tình.", author: "Nguyễn Thu Trang", title: "Bệnh nhân" },
    { text: "Ứng dụng chuyên nghiệp, tiết kiệm rất nhiều thời gian so với việc đến bệnh viện chờ đợi.", author: "Trần Minh Hoàng", title: "Giám đốc Marketing" },
    { text: "Tôi rất ấn tượng với đội ngũ bác sĩ, không chỉ giỏi chuyên môn mà còn rất chu đáo.", author: "Lê Thị Bích Phượng", title: "Giáo viên" },
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [doctorsRes, specialtiesRes] = await Promise.all([
          doctorService.getAllDoctors(),
          specialtyService.getAllSpecialties()
        ]);
        setAllDoctors(doctorsRes.data || []);
        setAllSpecialties(specialtiesRes.data || []);
      } catch (err) {
        setError('Không thể tải dữ liệu trang chủ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSearch = () => {
    const searchType = searchTab === 0 ? 'doctor' : 'specialty';
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('q', searchTerm);
    }
    params.append('type', searchType);
    navigate(`/search?${params.toString()}`);
  };

  const handleSpecialtyClick = (specialty) => {
    const params = new URLSearchParams();
    params.append('type', 'specialty');
    params.append('specialtyId', specialty.id);
    params.append('specialtyName', specialty.tenChuyenKhoa);
    navigate(`/search?${params.toString()}`);
  };

  const featuredDoctors = useMemo(() => {
    return [...allDoctors]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);
  }, [allDoctors]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* HERO SECTION */}
      <Box sx={{ position: 'relative', py: 10, display: 'flex', alignItems: 'center', background: `linear-gradient(rgba(0, 77, 153, 0.6), rgba(0, 44, 88, 0.8)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container maxWidth="md" sx={{ color: 'white', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography variant="h2" component="h1" fontWeight={800} sx={{ mb: 2 }}>Chăm sóc sức khỏe trong tầm tay</Typography>
          <Typography variant="h6" color="grey.300" sx={{ mb: 4 }}>Tìm kiếm bác sĩ uy tín, đặt lịch khám nhanh chóng.</Typography>
          <Paper sx={{ p: 2, borderRadius: 3, maxWidth: '700px', mx: 'auto' }}>
            <Tabs value={searchTab} onChange={(e, newValue) => setSearchTab(newValue)} centered>
              <Tab label="Tìm Bác sĩ" />
              <Tab label="Tìm Chuyên khoa" />
            </Tabs>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField fullWidth variant="outlined" placeholder={searchTab === 0 ? "Nhập tên bác sĩ..." : "Nhập tên chuyên khoa..."} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
              <Button variant="contained" size="large" startIcon={<Search />} onClick={handleSearch}>Tìm kiếm</Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* WHY CHOOSE US */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}><FeatureCard icon={<EventAvailable sx={{ fontSize: 40 }} />} title="Đặt lịch 24/7" description="Dễ dàng đặt hẹn mọi lúc, mọi nơi chỉ với vài cú nhấp chuột." /></Grid>
            <Grid item xs={12} md={4}><FeatureCard icon={<VerifiedUser sx={{ fontSize: 40 }} />} title="Bác sĩ uy tín" description="Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, thông tin minh bạch." /></Grid>
            <Grid item xs={12} md={4}><FeatureCard icon={<SupportAgent sx={{ fontSize: 40 }} />} title="Hỗ trợ tận tình" description="Luôn sẵn sàng hỗ trợ bạn trong suốt quá trình khám chữa bệnh." /></Grid>
          </Grid>
        </Container>
      </Box>

      {/* FEATURED SPECIALTIES */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom textAlign="center">Khám phá các chuyên khoa</Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {(allSpecialties || []).slice(0, 6).map(specialty => (
              <Grid item xs={12} sm={6} md={4} key={specialty.id}>
                <Paper elevation={0} variant='outlined' sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' } }} onClick={() => handleSpecialtyClick(specialty)}>
                  <Avatar src={specialty.hinhAnhUrl} sx={{ width: 56, height: 56, bgcolor: 'primary.main', color: 'white' }}><EventAvailable /></Avatar>
                  <Box><Typography variant="h6" fontWeight={600}>{specialty.tenChuyenKhoa}</Typography></Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TOP DOCTORS */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom textAlign="center">Gặp gỡ các bác sĩ hàng đầu</Typography>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {featuredDoctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={3} key={doctor.maBacSi}>
                {/* Render Doctor Card Logic */}
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6, transform: 'translateY(-4px)' } }} onClick={() => navigate(`/doctor/${doctor.maBacSi}`)}>
                  <CardMedia component="img" height="240" image={doctor.hinhAnhUrl || 'https://via.placeholder.com/300x240.png?text=No+Image'} alt={doctor.hoTen} />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight={600}>{doctor.hoTen}</Typography>
                    <Typography variant="body2" color="primary.main">{doctor.chuyenKhoa || "Chuyên khoa"}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={700} gutterBottom textAlign="center">Bệnh nhân nói về chúng tôi</Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {testimonials.map((item, index) => (
              <Grid item xs={12} md={4} key={index}><TestimonialCard text={item.text} author={item.author} title={item.title} /></Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
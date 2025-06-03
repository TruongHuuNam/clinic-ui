import React, { useState } from 'react';
import { Box, Typography, Container, Grid, TextField, Button, Card, CardContent, CardMedia, Chip, Stack, Tabs, Tab, MenuItem, Avatar } from '@mui/material';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const specialties = [
  { id: 1, name: 'Nội tổng quát', image: 'https://hellodoctor.com.vn/wp-content/uploads/2022/05/bac-si-8054-1451295555.jpg' },
  { id: 2, name: 'Nhi khoa', image: 'https://hellodoctor.com.vn/wp-content/uploads/2022/05/PZ1yzoq.jpg' },
  { id: 3, name: 'Tai mũi họng', image: 'https://hellodoctor.com.vn/wp-content/uploads/2022/05/kham-tai-mui-hong-isofhcare-jpg_4c51dcc4_7d0e_40e7_9e47_4807185a27ab.jpg' },
];
const doctors = [
  { id: 1, name: 'GS.TS.BS Lê Văn Cường', specialtyId: 1, specialty: 'Nội tổng quát', image: 'https://cdn-healthcare.hellohealthgroup.com/2023/09/1695530410_650fbdaa21ee74.98331766.jpg', clinic: 'HelloClinic', address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh', rating: 4.9, bookingCount: 120 },
  { id: 2, name: 'BS. Nguyễn Thị Hoa', specialtyId: 2, specialty: 'Nhi khoa', image: '	https://cdn-healthcare.hellohealthgroup.com/2023/05/1684813989_646c38a5e3f153.23896815.jpg', clinic: 'HelloClinic', address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh', rating: 4.8, bookingCount: 80 },
  { id: 3, name: 'BS. Trần Văn B', specialtyId: 1, specialty: 'Nội tổng quát', image: '	https://cdn-healthcare.hellohealthgroup.com/2024/04/1711958773_660a6af50bb348.72770895.jpg', clinic: 'HelloClinic', address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh', rating: 4.7, bookingCount: 60 },
  { id: 4, name: 'BS. Lê Thị C', specialtyId: 3, specialty: 'Tai mũi họng', image: 'https://cdn-healthcare.hellohealthgroup.com/2023/05/1684834044_646c86fc1199c3.48848023.jpg', clinic: 'HelloClinic', address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh', rating: 4.6, bookingCount: 40 },
];
const services = [
  { id: 1, name: 'Khám tổng quát', price: 350000, image: 'https://careplusvn.com/Uploads/t/kh/kham-tong-quat-1_0003219_710.jpeg', doctorIds: [1, 3] },
  { id: 2, name: 'Khám nhi', price: 300000, image: 'https://taimuihongtphcm.vn/wp-content/uploads/2024/08/cceea81a369393cdca82.jpg', doctorIds: [2] },
  { id: 3, name: 'Khám tai mũi họng', price: 320000, image: 'https://taimuihongtphcm.vn/wp-content/uploads/2024/08/cceea81a369393cdca82.jpg', doctorIds: [4] },
];
const articles = [
  { id: 1, title: '5 dấu hiệu bạn nên đi khám tổng quát ngay', image: 'https://careplusvn.com/Uploads/t/kh/kham-tong-quat-1_0003219_710.jpeg', excerpt: 'Khám tổng quát giúp phát hiện sớm các bệnh lý nguy hiểm và bảo vệ sức khỏe toàn diện.' },
  { id: 2, title: 'Lợi ích của việc khám nhi định kỳ cho trẻ', image: 'https://taimuihongtphcm.vn/wp-content/uploads/2024/08/cceea81a369393cdca82.jpg', excerpt: 'Khám nhi định kỳ giúp phát hiện sớm các vấn đề sức khỏe ở trẻ nhỏ.' },
  { id: 3, title: 'Chăm sóc sức khỏe tai mũi họng đúng cách', image: 'https://taimuihongtphcm.vn/wp-content/uploads/2024/08/cceea81a369393cdca82.jpg', excerpt: 'Bảo vệ hệ hô hấp và phòng tránh các bệnh lý tai mũi họng.' },
];

const Carousel = ({ children }) => {
  const ref = useRef();
  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden', mb: 2 }}>
      <Box ref={ref} sx={{ display: 'flex', gap: 2, overflowX: 'auto', scrollSnapType: 'x mandatory', pb: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

const HomePage = () => {
  const [tab, setTab] = useState(0); // 0: Bác sĩ, 1: Chuyên khoa, 2: Dịch vụ
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (tab === 0) {
      let filtered = doctors.filter(d =>
        (!selectedSpecialty || d.specialtyId === Number(selectedSpecialty)) &&
        (!search || d.name.toLowerCase().includes(search.toLowerCase()))
      );
      filtered = filtered.sort((a, b) => b.bookingCount - a.bookingCount);
      setResults(filtered);
    } else if (tab === 1) {
      let filtered = specialties.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    } else if (tab === 2) {
      let filtered = services.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const handleSpecialtyClick = (id) => {
    setTab(0);
    setSelectedSpecialty(id);
    setResults(doctors.filter(d => d.specialtyId === id));
  };

  const handleServiceClick = (id) => {
    setTab(0);
    setSelectedSpecialty('');
    const doctorIds = services.find(s => s.id === id)?.doctorIds || [];
    setResults(doctors.filter(d => doctorIds.includes(d.id)));
  };

  const renderSearchBox = () => (
    <Box sx={{ bgcolor: '#fff', p: 3, borderRadius: 2, boxShadow: 2, mb: 3 }}>
      <Tabs value={tab} onChange={(_, v) => { setTab(v); setResults([]); setSearch(''); setSelectedSpecialty(''); setSelectedService(''); }} sx={{ mb: 2 }}>
        <Tab label="Bác sĩ" />
        <Tab label="Chuyên khoa" />
        <Tab label="Dịch vụ" />
      </Tabs>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        {tab === 0 && (
          <TextField
            select
            label="Chuyên khoa"
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Tất cả chuyên khoa</MenuItem>
            {specialties.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
          </TextField>
        )}
        <TextField
          variant="outlined"
          placeholder={tab === 0 ? "Tìm kiếm bác sĩ..." : tab === 1 ? "Tìm kiếm chuyên khoa..." : "Tìm kiếm dịch vụ..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ bgcolor: '#f5f5f5', minWidth: 260 }}
        />
        <Button variant="contained" size="large" onClick={handleSearch}>Tìm kiếm</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {tab === 1 && specialties.map(s => (
          <Chip key={s.id} label={s.name} onClick={() => handleSpecialtyClick(s.id)} clickable sx={{ fontWeight: 600 }} />
        ))}
        {tab === 2 && services.map(s => (
          <Chip key={s.id} label={s.name} onClick={() => handleServiceClick(s.id)} clickable sx={{ fontWeight: 600 }} />
        ))}
      </Stack>
    </Box>
  );

  const renderResults = () => {
    if (tab === 0) {
      return (
        <Grid container spacing={3}>
          {results.map(d => (
            <Grid item xs={12} sm={6} md={4} key={d.id}>
              <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }} onClick={() => navigate(`/doctor/${d.id}`)}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={d.image} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>{d.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{d.specialty}</Typography>
                    <Typography variant="body2" color="primary.main">★ {d.rating} | {d.bookingCount} lượt đặt</Typography>
                    <Typography variant="body2" color="text.secondary">{d.clinic} - {d.address}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {results.length === 0 && <Grid item xs={12}><Typography textAlign="center">Không có kết quả phù hợp.</Typography></Grid>}
        </Grid>
      );
    } else if (tab === 1) {
      return (
        <Grid container spacing={3}>
          {results.map(s => (
            <Grid item xs={12} sm={4} key={s.id}>
              <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }} onClick={() => handleSpecialtyClick(s.id)}>
                <CardMedia component="img" height="120" image={s.image} alt={s.name} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{s.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {results.length === 0 && <Grid item xs={12}><Typography textAlign="center">Không có kết quả phù hợp.</Typography></Grid>}
        </Grid>
      );
    } else if (tab === 2) {
      return (
        <Grid container spacing={3}>
          {results.map(s => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }} onClick={() => handleServiceClick(s.id)}>
                <CardMedia component="img" height="120" image={s.image} alt={s.name} />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{s.name}</Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={700}>{s.price.toLocaleString()} đ</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {results.length === 0 && <Grid item xs={12}><Typography textAlign="center">Không có kết quả phù hợp.</Typography></Grid>}
        </Grid>
      );
    }
    return null;
  };

  return (
    <Box>
      {/* Banner quảng cáo */}
      <Box sx={{ bgcolor: '#fff0f6', py: 0 }}>
        <Container maxWidth="xl" disableGutters>
          <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3, m: 0 }}>
            <CardMedia component="img" height="320" image="https://cdn-healthcare.hellohealthgroup.com/2025/03/1742887848_67e25ba8b0b2d6.65467120.jpg?w=1920&q=75" alt="banner" sx={{ width: '100%', objectFit: 'cover' }} />
          </Card>
        </Container>
      </Box>
      {/* Box search */}
      <Box sx={{ bgcolor: '#e3f2fd', py: 6, textAlign: 'center' }}>
        <Container>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Đặt lịch khám bệnh phòng khám tư nhân
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Tìm kiếm bác sĩ, chuyên khoa, dịch vụ phù hợp và đặt lịch nhanh chóng, tiện lợi.
          </Typography>
          {renderSearchBox()}
        </Container>
      </Box>
      {/* Kết quả tìm kiếm */}
      <Container sx={{ py: 6 }}>
        {results.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Kết quả tìm kiếm</Typography>
            {renderResults()}
          </Box>
        )}
        {/* Section bác sĩ nổi bật */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Bác sĩ nổi bật</Typography>
          <Carousel>
            {doctors.map(d => (
              <Card key={d.id} sx={{ minWidth: 260, maxWidth: 280, mx: 1, cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 }, flex: '0 0 auto' }} onClick={() => navigate(`/doctor/${d.id}`)}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={d.image} sx={{ width: 56, height: 56, mr: 2 }} />
                  <Box>
                    <Typography fontWeight={600}>{d.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{d.specialty}</Typography>
                    <Typography variant="body2" color="primary.main">★ {d.rating} | {d.bookingCount} lượt đặt</Typography>
                    <Typography variant="body2" color="text.secondary">{d.clinic} - {d.address}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Box>
        {/* Section dịch vụ toàn diện */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Dịch vụ toàn diện</Typography>
          <Grid container spacing={3}>
            {services.map(s => (
              <Grid item xs={12} sm={6} md={4} key={s.id}>
                <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
                  <CardMedia component="img" height="120" image={s.image} alt={s.name} />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{s.name}</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight={700}>{s.price.toLocaleString()} đ</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Section chuyên khoa nổi bật */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Chuyên khoa nổi bật</Typography>
          <Grid container spacing={3}>
            {specialties.map(s => (
              <Grid item xs={12} sm={4} key={s.id}>
                <Card sx={{ cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
                  <CardMedia component="img" height="120" image={s.image} alt={s.name} />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{s.name}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Section bài viết nổi bật */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Bài viết nổi bật</Typography>
          <Grid container spacing={3}>
            {articles.map(a => (
              <Grid item xs={12} sm={6} md={4} key={a.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
                  <CardMedia component="img" height="140" image={a.image} alt={a.title} />
                  <CardContent>
                    <Typography fontWeight={600}>{a.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{a.excerpt}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;

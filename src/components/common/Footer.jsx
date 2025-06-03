import React from 'react';
import { Box, Typography, Grid, Link as MuiLink, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => (
  <Box sx={{ bgcolor: '#222b45', color: '#fff', py: 4, mt: 6 }} component="footer">
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={4}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          HelloClinic
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          HelloClinic mong muốn trở thành nền tảng thông tin y khoa hàng đầu tại Việt Nam, giúp bạn đưa ra những quyết định đúng đắn để chăm sóc sức khỏe và hỗ trợ bạn cải thiện chất lượng cuộc sống.
        </Typography>
        <Box>
          <IconButton color="inherit" href="#" size="large"><FacebookIcon /></IconButton>
          <IconButton color="inherit" href="#" size="large"><InstagramIcon /></IconButton>
          <IconButton color="inherit" href="#" size="large"><LinkedInIcon /></IconButton>
          <IconButton color="inherit" href="#" size="large"><YouTubeIcon /></IconButton>
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography variant="subtitle1" fontWeight={600}>Chuyên mục</Typography>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Sức khỏe</MuiLink>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Dịch vụ</MuiLink>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Bệnh viện</MuiLink>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography variant="subtitle1" fontWeight={600}>Thông tin</Typography>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Điều khoản sử dụng</MuiLink>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Chính sách bảo mật</MuiLink>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Liên hệ</MuiLink>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography variant="subtitle1" fontWeight={600}>Hỗ trợ</Typography>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Câu hỏi thường gặp</MuiLink>
        <MuiLink href="#" color="inherit" underline="hover" display="block">Hướng dẫn sử dụng</MuiLink>
      </Grid>
    </Grid>
    <Box sx={{ textAlign: 'center', mt: 4, fontSize: 13, opacity: 0.7 }}>
      © {new Date().getFullYear()} HelloClinic. All rights reserved.
    </Box>
  </Box>
);

export default Footer;

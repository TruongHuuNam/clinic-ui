import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Link } from '@mui/material';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setError('');
    // Xử lý đăng ký
  };
  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Đăng ký tài khoản</Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Họ và tên" name="name" fullWidth sx={{ mb: 2 }} value={form.name} onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth sx={{ mb: 2 }} value={form.email} onChange={handleChange} />
          <TextField label="Số điện thoại" name="phone" fullWidth sx={{ mb: 2 }} value={form.phone} onChange={handleChange} />
          <TextField label="Mật khẩu" name="password" type="password" fullWidth sx={{ mb: 2 }} value={form.password} onChange={handleChange} />
          <TextField label="Xác nhận mật khẩu" name="confirm" type="password" fullWidth sx={{ mb: 2 }} value={form.confirm} onChange={handleChange} />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth>Đăng ký</Button>
        </Box>
        <Typography sx={{ mt: 2 }}>Đã có tài khoản? <Link href="/login">Đăng nhập</Link></Typography>
      </Paper>
    </Container>
  );
};

export default Register;

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Link } from '@mui/material';

const ForgotPassword = () => {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Quên mật khẩu</Typography>
        {!sent ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Email hoặc Số điện thoại" fullWidth sx={{ mb: 2 }} value={value} onChange={e => setValue(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth>Gửi mã xác nhận</Button>
          </Box>
        ) : (
          <Typography>Đã gửi mã xác nhận! Vui lòng kiểm tra email hoặc điện thoại.</Typography>
        )}
        <Typography sx={{ mt: 2 }}><Link href="/login">Quay lại đăng nhập</Link></Typography>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;

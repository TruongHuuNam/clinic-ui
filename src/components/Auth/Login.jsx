// components/Auth/Login.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Link, Divider, Stack } from '@mui/material';
// import { GoogleLogin } from '@react-oauth/google'; // Tạm thời bỏ GoogleLogin do chưa tương thích React 18

const Login = () => {
    const [phone, setPhone] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handlePhoneLogin = () => {
        if (!phone) {
            setError('Vui lòng nhập số điện thoại.');
            return;
        }
        setOtpSent(true);
        setError('');
    };

    const handleOtpSubmit = () => {
        if (!otp) {
            setError('Vui lòng nhập mã OTP.');
            return;
        }
        setError('');
        // Xử lý đăng nhập thành công
    };

    return (
        <Container maxWidth="xs" sx={{ py: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Đăng nhập</Typography>
                {!otpSent ? (
                    <Box>
                        <TextField label="Số điện thoại" fullWidth sx={{ mb: 2 }} value={phone} onChange={e => setPhone(e.target.value)} />
                        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handlePhoneLogin}>Gửi mã OTP</Button>
                        <Divider sx={{ my: 2 }}>Hoặc</Divider>
                        {/* <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <GoogleLogin onSuccess={...} onError={...} />
                        </Box> */}
                        <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>[Đăng nhập bằng Google sẽ được hỗ trợ sau]</Typography>
                    </Box>
                ) : (
                    <Box>
                        <TextField label="Mã OTP" fullWidth sx={{ mb: 2 }} value={otp} onChange={e => setOtp(e.target.value)} />
                        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleOtpSubmit}>Xác nhận</Button>
                    </Box>
                )}
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                    <Link href="/register">Đăng ký</Link>
                    <Link href="/forgot-password">Quên mật khẩu?</Link>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Login;
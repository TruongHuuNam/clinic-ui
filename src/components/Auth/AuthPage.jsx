// File: src/components/auth/AuthPage.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Divider, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const AuthPage = () => {
    const [step, setStep] = useState('enter-email'); // 'enter-email', 'enter-name', 'enter-otp'
    const [email, setEmail] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleRequestOtp = async () => {
        if (!email) {
            setError('Vui lòng nhập email.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await authService.requestOtp(email);
            if (response.data.userExists) {
                setStep('enter-otp');
            } else {
                setStep('enter-name');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!hoTen) {
            setError('Vui lòng nhập họ tên.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.registerAndSendOtp(hoTen, email);
            setStep('enter-otp');
        } catch (err) {
            setError(err.response?.data?.error || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Mã OTP không hợp lệ.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await authService.verifyOtp(email, otp);
            login(response.data.accessToken); // Lưu token và cập nhật trạng thái
            navigate('/dashboard'); // Chuyển hướng đến trang chính sau khi đăng nhập
        } catch (err) {
            setError(err.response?.data?.error || 'Mã OTP không chính xác hoặc đã hết hạn.');
        } finally {
            setLoading(false);
        }
    };

    // Nút đăng nhập bằng Google
    const handleGoogleLogin = () => {
        // Chuyển hướng đến endpoint OAuth2 của backend
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };

    const renderStep = () => {
        switch (step) {
            case 'enter-name':
                return (
                    <>
                        <Typography gutterBottom>Email này chưa được đăng ký. Vui lòng nhập họ tên để tiếp tục.</Typography>
                        <TextField label="Họ và tên" fullWidth value={hoTen} onChange={e => setHoTen(e.target.value)} sx={{ my: 2 }} />
                        <Button variant="contained" fullWidth onClick={handleRegister} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Đăng ký & Gửi OTP'}
                        </Button>
                    </>
                );
            case 'enter-otp':
                return (
                    <>
                        <Typography gutterBottom>Mã OTP đã được gửi đến email <strong>{email}</strong>. Vui lòng kiểm tra.</Typography>
                        <TextField label="Mã OTP" fullWidth value={otp} onChange={e => setOtp(e.target.value)} sx={{ my: 2 }} />
                        <Button variant="contained" fullWidth onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Xác nhận'}
                        </Button>
                    </>
                );
            case 'enter-email':
            default:
                return (
                    <>
                        <TextField label="Email" type="email" fullWidth value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
                        <Button variant="contained" fullWidth onClick={handleRequestOtp} disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'Tiếp tục'}
                        </Button>
                        <Divider sx={{ my: 2 }}>Hoặc</Divider>
                        <Button variant="outlined" fullWidth onClick={handleGoogleLogin}>
                            Đăng nhập với Google
                        </Button>
                    </>
                );
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={6} sx={{ p: 4, width: '100%' }}>
                <Typography component="h1" variant="h5" fontWeight={700} gutterBottom>
                    Đăng nhập hoặc Đăng ký
                </Typography>
                <Box sx={{ mt: 3 }}>
                    {renderStep()}
                    {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                </Box>
            </Paper>
        </Container>
    );
};

export default AuthPage;
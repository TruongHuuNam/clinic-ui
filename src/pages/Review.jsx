import React, { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Rating } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const Review = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/history'), 1500);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Đánh giá bác sĩ</Typography>
        {!submitted ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography sx={{ mb: 1 }}>Chọn số sao:</Typography>
            <Rating value={value} onChange={(_, v) => setValue(v)} size="large" sx={{ mb: 2 }} />
            <TextField label="Nhận xét" fullWidth multiline rows={3} sx={{ mb: 2 }} value={comment} onChange={e => setComment(e.target.value)} />
            <Button type="submit" variant="contained">Gửi đánh giá</Button>
          </Box>
        ) : (
          <Typography color="success.main">Cảm ơn bạn đã đánh giá!</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Review; 
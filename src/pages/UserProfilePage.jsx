import React, { useState } from 'react';
import { Box, Typography, Container, Paper, TextField, Button, Avatar } from '@mui/material';

const mockUser = {
  name: 'Nguyen Van A',
  email: 'namcute0910@gmail.com',
  phone: '0912345678',
  dob: '1990-01-01',
  gender: 'male',
  avatar: '',
};

const UserProfilePage = () => {
  const [user, setUser] = useState(mockUser);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    setUser(form);
    setEdit(false);
  };
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar src={user.avatar} sx={{ width: 64, height: 64, mr: 2 }} />
          <Typography variant="h5" fontWeight={700}>Tài khoản cá nhân</Typography>
        </Box>
        {!edit ? (
          <Box>
            <Typography><b>Họ tên:</b> {user.name}</Typography>
            <Typography><b>Email:</b> {user.email}</Typography>
            <Typography><b>Số điện thoại:</b> {user.phone}</Typography>
            <Typography><b>Ngày sinh:</b> {user.dob}</Typography>
            <Typography><b>Giới tính:</b> {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : 'Khác'}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEdit(true)}>Chỉnh sửa</Button>
          </Box>
        ) : (
          <Box>
            <TextField label="Họ tên" name="name" fullWidth sx={{ mb: 2 }} value={form.name} onChange={handleChange} />
            <TextField label="Email" name="email" fullWidth sx={{ mb: 2 }} value={form.email} onChange={handleChange} />
            <TextField label="Số điện thoại" name="phone" fullWidth sx={{ mb: 2 }} value={form.phone} onChange={handleChange} />
            <TextField label="Ngày sinh" name="dob" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} value={form.dob} onChange={handleChange} />
            <TextField select label="Giới tính" name="gender" fullWidth sx={{ mb: 2 }} value={form.gender} onChange={handleChange}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </TextField>
            <Button variant="contained" sx={{ mr: 2 }} onClick={handleSave}>Lưu</Button>
            <Button variant="outlined" onClick={() => setEdit(false)}>Hủy</Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfilePage;

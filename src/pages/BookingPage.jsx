import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import bookingService from '../services/bookingService';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, Alert, Stepper, Step, StepLabel, StepContent
} from '@mui/material';
import { format, isValid } from 'date-fns';
import { Person, EventAvailable, EditNote, Payments } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { vi } from 'date-fns/locale';

const getInitialBookingIntent = (location) => {
  try {
    if (location.state?.bookingIntent) return location.state.bookingIntent;
    const storedIntent = sessionStorage.getItem('bookingIntent');
    return storedIntent ? JSON.parse(storedIntent) : null;
  } catch (error) {
    console.error("Lỗi khi đọc thông tin đặt lịch:", error);
    return null;
  }
};

const BookingPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingIntent] = useState(() => getInitialBookingIntent(location));

  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    hoTenBenhNhan: '', ngaySinh: null, gioiTinh: 'Nam', soDienThoai: '',
    quanHeVoiNguoiDat: 'Bản thân', diaChi: ''
  });
  const [lyDoKham, setLyDoKham] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // MỚI: State riêng cho việc kiểm tra lỗi của form
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!bookingIntent) {
      alert("Không tìm thấy thông tin đặt lịch hợp lệ. Vui lòng thử lại từ trang chi tiết bác sĩ.");
      navigate('/');
      return;
    }
    setLoading(true);
    profileService.getMyProfiles()
      .then(response => {
        const fetchedProfiles = response.data || [];
        setProfiles(fetchedProfiles);
        if (fetchedProfiles.length > 0) {
          const selfProfile = fetchedProfiles.find(p => p.quanHeVoiNguoiDat === 'Bản thân');
          setSelectedProfileId(selfProfile ? selfProfile.maHoSo : fetchedProfiles[0].maHoSo);
        } else {
          setIsCreatingNew(true);
          setSelectedProfileId('new');
          setNewProfileData(prev => ({
            ...prev,
            hoTenBenhNhan: user?.hoTen || '',
            soDienThoai: user?.soDienThoai || '',
            diaChi: user?.diaChi || '',
            quanHeVoiNguoiDat: 'Bản thân',
          }));
        }
      })
      .catch(err => {
        console.error("Lỗi khi tải hồ sơ:", err);
        setError("Không thể tải hồ sơ bệnh nhân. Vui lòng F5 lại trang.");
      })
      .finally(() => setLoading(false));
  }, [bookingIntent, navigate, user]);

  const handleProfileSelectionChange = (event) => {
    const value = event.target.value;
    setSelectedProfileId(value);
    setIsCreatingNew(value === 'new');
    setValidationErrors({}); // Xóa lỗi cũ khi chuyển đổi lựa chọn
    if (value === 'new') {
      setNewProfileData({
        hoTenBenhNhan: '', ngaySinh: null, gioiTinh: 'Nam',
        soDienThoai: '', quanHeVoiNguoiDat: 'Người thân', diaChi: ''
      });
    }
  };

  // SỬA: Khi người dùng nhập, xóa lỗi của trường đó đi
  const handleNewProfileInputChange = (e) => {
    const { name, value } = e.target;
    setNewProfileData({ ...newProfileData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // SỬA: Khi người dùng chọn ngày, xóa lỗi của trường ngày sinh
  const handleDateChange = (newDate) => {
    setNewProfileData({ ...newProfileData, ngaySinh: newDate });
    if (validationErrors.ngaySinh) {
      setValidationErrors(prev => ({ ...prev, ngaySinh: undefined }));
    }
  };

  // MỚI: Hàm kiểm tra lỗi riêng biệt
  const validateNewProfile = () => {
    const errors = {};
    if (!newProfileData.hoTenBenhNhan.trim()) errors.hoTenBenhNhan = "Họ tên không được để trống";
    if (!newProfileData.ngaySinh || !isValid(newProfileData.ngaySinh)) errors.ngaySinh = "Ngày sinh không hợp lệ";
    if (!newProfileData.gioiTinh) errors.gioiTinh = "Vui lòng chọn giới tính";
    if (!newProfileData.soDienThoai.trim()) errors.soDienThoai = "Số điện thoại không được để trống";
    if (!newProfileData.diaChi.trim()) errors.diaChi = "Địa chỉ không được để trống";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleProceedToConfirmation = async () => {
    setError('');
    if (isCreatingNew) {
      if (!validateNewProfile()) return;
    }

    setSubmitting(true);
    try {
      let finalProfileId = selectedProfileId;

      if (isCreatingNew) {
        const profilePayload = { ...newProfileData, ngaySinh: format(newProfileData.ngaySinh, 'yyyy-MM-dd') };
        const newProfileResponse = await profileService.createProfile(profilePayload);
        finalProfileId = newProfileResponse.data.maHoSo;
      }

      if (!finalProfileId || finalProfileId === 'new') {
        throw new Error("Vui lòng chọn hoặc tạo một hồ sơ bệnh nhân.");
      }

      const bookingPayload = {
        maSlot: bookingIntent.slotInfo.maSlot,
        maHoSoBenhNhan: finalProfileId,
        lyDoKham: lyDoKham,
      };

      // SỬA LẠI: Gọi đúng service và hàm đã thống nhất
      const response = await bookingService.createBookingAndInitiatePayment(bookingPayload);
      const paymentUrl = response.data.paymentUrl;

      if (paymentUrl) {
        sessionStorage.removeItem('bookingIntent');
        window.location.href = paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ máy chủ.");
      }

    } catch (err) {
      console.error("Lỗi khi xác nhận đặt lịch:", err);
      const errorMsg = err.response?.data?.message || err.message || "Đặt lịch thất bại, vui lòng thử lại.";
      setError(errorMsg);
      setSubmitting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  if (!bookingIntent) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={4} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" fontWeight={700} align="center" gutterBottom>Hoàn tất Thông tin Đặt lịch</Typography>

          <Stepper orientation="vertical" activeStep={-1} sx={{ mt: 4 }}>
            <Step active>
              <StepLabel icon={<EventAvailable color="primary" />}><Typography variant="h6">1. Thông tin buổi khám</Typography></StepLabel>
              <StepContent>
                <Box pl={2} py={1} my={1} bgcolor="grey.50" borderRadius={2}>
                  <Typography><strong>Bác sĩ:</strong> {bookingIntent.doctorName}</Typography>
                  <Typography><strong>Thời gian:</strong> {format(new Date(bookingIntent.slotInfo.thoiGianBatDau), 'HH:mm - EEEE, dd/MM/yyyy', { locale: vi })}</Typography>
                </Box>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel icon={<Person color="primary" />}><Typography variant="h6">2. Thông tin người đến khám</Typography></StepLabel>
              <StepContent>
                <Box pl={2} pt={2}>
                  {(profiles.length > 0) && (
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel>Chọn hồ sơ bệnh nhân</InputLabel>
                      <Select value={selectedProfileId} label="Chọn hồ sơ bệnh nhân" onChange={handleProfileSelectionChange}>
                        {profiles.map(p => <MenuItem key={p.maHoSo} value={p.maHoSo}>{p.hoTenBenhNhan} ({p.quanHeVoiNguoiDat})</MenuItem>)}
                        <MenuItem value="new" sx={{ fontWeight: 'bold', color: 'primary.main' }}>+ Tạo hồ sơ mới cho người thân</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {(isCreatingNew || profiles.length === 0) && (
                    <Box component="div" sx={{ mt: 0.5 }}>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {profiles.length === 0 ? "Bạn chưa có hồ sơ nào. Vui lòng tạo hồ sơ đầu tiên:" : "Vui lòng điền thông tin cho hồ sơ mới:"}
                      </Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item width={350} xs={12}>
                          <TextField label="Họ và tên bệnh nhân" name="hoTenBenhNhan" fullWidth value={newProfileData.hoTenBenhNhan} onChange={handleNewProfileInputChange} required
                            error={!!validationErrors.hoTenBenhNhan} helperText={validationErrors.hoTenBenhNhan}
                          />
                        </Grid>
                        <Grid width={260} item xs={12} sm={6}>
                          <DatePicker
                            label="Ngày sinh" value={newProfileData.ngaySinh} onChange={handleDateChange}
                            disableFuture openTo="year" views={['year', 'month', 'day']}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                error: !!validationErrors.ngaySinh,
                                helperText: validationErrors.ngaySinh
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField select label="Giới tính" fullWidth name="gioiTinh" value={newProfileData.gioiTinh} onChange={handleNewProfileInputChange} required error={!!validationErrors.gioiTinh} helperText={validationErrors.gioiTinh}>
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item width={250} xs={12} sm={6}>
                          <TextField label="Số điện thoại liên hệ" name="soDienThoai" type="tel" fullWidth value={newProfileData.soDienThoai} onChange={handleNewProfileInputChange} required error={!!validationErrors.soDienThoai} helperText={validationErrors.soDienThoai} />
                        </Grid>
                        <Grid width={250} item xs={12} sm={6}>
                          <TextField select label="Quan hệ với người đặt" fullWidth name="quanHeVoiNguoiDat" value={newProfileData.quanHeVoiNguoiDat} onChange={handleNewProfileInputChange} required disabled={profiles.length === 0}>
                            <MenuItem value="Bản thân">Bản thân</MenuItem>
                            <MenuItem value="Vợ">Vợ</MenuItem>
                            <MenuItem value="Chồng">Chồng</MenuItem>
                            <MenuItem value="Con">Con</MenuItem>
                            <MenuItem value="Bố">Bố</MenuItem>
                            <MenuItem value="Mẹ">Mẹ</MenuItem>
                            <MenuItem value="Anh/Chị/Em">Anh/Chị/Em</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid width={520} item xs={12}>
                          <TextField label="Địa chỉ" name="diaChi" fullWidth value={newProfileData.diaChi} onChange={handleNewProfileInputChange} required error={!!validationErrors.diaChi} helperText={validationErrors.diaChi} />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel icon={<EditNote color="primary" />}><Typography variant="h6">3. Lý do khám (không bắt buộc)</Typography></StepLabel>
              <StepContent>
                <Box pl={2} pt={2}>
                  <TextField label="Nhập triệu chứng sơ bộ..." fullWidth multiline rows={3} value={lyDoKham} onChange={(e) => setLyDoKham(e.target.value)} />
                </Box>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel icon={<Payments color="primary" />}><Typography variant="h6">4. Hoàn tất</Typography></StepLabel>
              <StepContent>
                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                <Box sx={{ pl: 2, pt: 2 }}>
                  <Button variant="contained" size="large" onClick={handleProceedToConfirmation} disabled={submitting}>
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Xác nhận và Đặt lịch'}
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default BookingPage;
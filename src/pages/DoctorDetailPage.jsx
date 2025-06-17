import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import doctorService from '../services/doctorService';
import { format, parseISO, addDays, isEqual } from 'date-fns';
import { vi } from 'date-fns/locale';

// Material-UI Components
import {
    Box, Typography, Button, Grid, CircularProgress, Container, Paper, Avatar, Chip,
    Divider, Alert, Tabs, Tab, Popover
} from '@mui/material';

// Material-UI Icons
import { School, Work, Place, ArrowDropDown, Verified } from '@mui/icons-material';

// Date Picker Components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (<Box sx={{ py: 3, px: { xs: 1, sm: 2 } }}>{children}</Box>)}
        </div>
    );
}

const DoctorDetailPage = () => {
    const { id: doctorId } = useParams();
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [upcomingDays, setUpcomingDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [timeTab, setTimeTab] = useState('Sáng');
    const [loadingInfo, setLoadingInfo] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState('');
    const [infoTab, setInfoTab] = useState(0);
    const [calendarAnchorEl, setCalendarAnchorEl] = useState(null);
    const selectedDateButtonRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    // Tự động cuộn lên đầu trang
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [doctorId]);

    // Tải dữ liệu ban đầu
    useEffect(() => {
        setLoadingInfo(true);
        setError('');
        const fetchInitialData = async () => {
            try {
                const [infoRes, availabilityRes] = await Promise.all([
                    doctorService.getDoctorById(doctorId),
                    doctorService.getUpcomingAvailability(doctorId, 30)
                ]);
                setDoctorInfo(infoRes.data);
                setUpcomingDays(availabilityRes.data);
                const firstAvailableDay = availabilityRes.data.find(d => d.availableSlots > 0);
                if (firstAvailableDay) {
                    setSelectedDate(parseISO(firstAvailableDay.date));
                }
            } catch (err) {
                setError("Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.");
                console.error(err);
            } finally {
                setLoadingInfo(false);
            }
        };
        fetchInitialData();
    }, [doctorId]);

    // Tải các slot chi tiết khi ngày được chọn
    useEffect(() => {
        if (!doctorInfo) return;
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const dayHasSlots = upcomingDays.find(d => d.date === dateString)?.availableSlots > 0;
        if (!dayHasSlots) {
            setSlots([]);
            return;
        }
        setLoadingSlots(true);
        setSelectedSlot(null);
        doctorService.getAvailableSlots(doctorId, selectedDate)
            .then(res => setSlots(res.data || []))
            .catch(err => {
                console.error("Lỗi khi tải các khung giờ:", err);
                setSlots([]);
            })
            .finally(() => setLoadingSlots(false));
        setTimeout(() => {
            if (selectedDateButtonRef.current) {
                selectedDateButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }, 100);
    }, [selectedDate, doctorId, upcomingDays, doctorInfo]);

    // Nhóm các slot theo buổi
    const groupedSlots = useMemo(() => {
        return (slots || []).reduce((acc, slot) => {
            const hour = parseISO(slot.thoiGianBatDau).getHours();
            let period = "Tối";
            if (hour < 12) period = "Sáng";
            else if (hour < 18) period = "Chiều";
            acc[period].push(slot);
            return acc;
        }, { Sáng: [], Chiều: [], Tối: [] });
    }, [slots]);

    // Xử lý đặt lịch
    const handleProceedToBooking = () => {
        if (!doctorInfo || !selectedSlot) {
            alert("Vui lòng chọn một khung giờ khám.");
            return;
        }
        if (!isAuthenticated) {
            navigate('/auth', { state: { from: location } });
            return;
        }
        const bookingIntent = {
            doctorId: doctorInfo.maBacSi,
            doctorName: doctorInfo.hoTen,
            slotInfo: selectedSlot
        };
        try {
            sessionStorage.setItem('bookingIntent', JSON.stringify(bookingIntent));
        } catch (e) {
            console.error("Không thể lưu thông tin đặt lịch vào sessionStorage", e);
            alert("Đã có lỗi xảy ra, vui lòng thử lại.");
            return;
        }
        navigate(`/booking/${doctorInfo.maBacSi}`, { state: { bookingIntent } });
    };

    const handleOpenCalendar = (event) => setCalendarAnchorEl(event.currentTarget);
    const handleCloseCalendar = () => setCalendarAnchorEl(null);
    const handleCalendarChange = (newDate) => {
        setSelectedDate(newDate);
        handleCloseCalendar();
    };
    const isOpenCalendar = Boolean(calendarAnchorEl);

    if (loadingInfo) return <Container maxWidth="lg" sx={{ my: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>;
    if (error) return <Container maxWidth="lg" sx={{ my: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!doctorInfo) return <Container maxWidth="lg" sx={{ my: 4 }}><Alert severity="warning">Không tìm thấy thông tin bác sĩ.</Alert></Container>;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ bgcolor: 'grey.50' }}>
                {/* SỬA LỖI 1: Thay đổi maxWidth để bố cục được căn giữa và cân đối hơn */}
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Grid container spacing={4}>
                        {/* === CỘT THÔNG TIN BÁC SĨ (BÊN TRÁI) === */}
                        <Grid item width={1200} xs={12} md={8}>
                            <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, mb: 3 }}>
                                    <Avatar src={doctorInfo.hinhAnhUrl} alt={doctorInfo.hoTen}
                                        sx={{ width: 200, height: 200, border: '6px solid', borderColor: 'grey.200' }}
                                    />
                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Typography variant="h3" component="h1" fontWeight={700}>{doctorInfo.hoTen}</Typography>
                                        <Typography variant="h5" color="primary.main" fontWeight={500} sx={{ mt: 1 }}>{doctorInfo.chuyenKhoa}</Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={infoTab} onChange={(e, newValue) => setInfoTab(newValue)} variant="fullWidth">
                                        <Tab label="Thông tin chi tiết" sx={{ fontWeight: 600 }} />
                                        <Tab label="Đánh giá từ bệnh nhân" sx={{ fontWeight: 600 }} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={infoTab} index={0}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>Giới thiệu về bác sĩ</Typography>
                                    <Typography paragraph sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>{doctorInfo.moTa || 'Chưa có thông tin giới thiệu.'}</Typography>

                                    <Box sx={{ my: 4, p: 3, bgcolor: 'grey.100', borderRadius: 2 }}>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>Thông tin hành nghề</Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}><Chip icon={<School />} label={doctorInfo.hocVi || "Chưa cập nhật"} sx={{ width: '100%', justifyContent: 'flex-start', p: 2.5 }} /></Grid>
                                            <Grid item xs={12} sm={6}><Chip icon={<Work />} label={`${doctorInfo.kinhNghiem || 'N/A'} năm kinh nghiệm`} sx={{ width: '100%', justifyContent: 'flex-start', p: 2.5 }} /></Grid>
                                            <Grid item xs={12}><Chip icon={<Place />} label={doctorInfo.phongKham || "Phòng khám H&H"} sx={{ width: '100%', justifyContent: 'flex-start', p: 2.5 }} /></Grid>
                                        </Grid>
                                    </Box>

                                    <Typography variant="h6" fontWeight={600} mt={4} gutterBottom>Quá trình công tác</Typography>
                                    {doctorInfo.quaTrinhCongTac?.map((item, i) => <Typography key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: 'text.secondary' }}><Verified color="success" /> {item}</Typography>)}

                                    <Typography variant="h6" fontWeight={600} mt={4} gutterBottom>Quá trình đào tạo</Typography>
                                    {doctorInfo.bangCap?.map((item, i) => <Typography key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: 'text.secondary' }}><School color="info" /> {item}</Typography>)}
                                </TabPanel>
                                <TabPanel value={infoTab} index={1}>
                                    <Typography>Chức năng đánh giá đang được phát triển.</Typography>
                                </TabPanel>
                            </Paper>
                        </Grid>

                        {/* === CỘT ĐẶT LỊCH (BÊN PHẢI) === */}
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: { xs: 2, sm: 3 }, position: 'sticky', top: '80px', borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                                <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 2 }}>Chọn lịch khám</Typography>

                                <Box onClick={handleOpenCalendar} sx={{ cursor: 'pointer', border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 1.5, my: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { borderColor: 'primary.main' } }}>
                                    <Typography fontWeight={500} textTransform="capitalize">{format(selectedDate, 'MMMM, yyyy', { locale: vi })}</Typography>
                                    <ArrowDropDown />
                                </Box>
                                <Popover open={isOpenCalendar} anchorEl={calendarAnchorEl} onClose={handleCloseCalendar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
                                    <DateCalendar value={selectedDate} onChange={handleCalendarChange} minDate={new Date()} maxDate={addDays(new Date(), 28)} />
                                </Popover>

                                <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1, gap: 1.5, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2 } }}>
                                    {upcomingDays.map(day => {
                                        const dayDate = parseISO(day.date);
                                        const isSelected = isEqual(dayDate.setHours(0, 0, 0, 0), selectedDate.setHours(0, 0, 0, 0));
                                        return (
                                            <Button ref={isSelected ? selectedDateButtonRef : null} key={day.date} variant={isSelected ? 'contained' : 'outlined'} onClick={() => setSelectedDate(dayDate)} disabled={day.availableSlots === 0} sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center', px: 2, py: 1, flexShrink: 0, lineHeight: 1.2 }}>
                                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{format(dayDate, 'eee', { locale: vi })}</Typography>
                                                <Typography variant="h6">{format(dayDate, 'd/M')}</Typography>
                                                {/* SỬA LỖI 2: Đổi chữ "slot" thành "chỗ trống" */}
                                                <Typography variant="caption" sx={{ whiteSpace: 'nowrap', color: day.availableSlots > 0 ? 'success.main' : 'text.disabled' }}>{day.availableSlots > 0 ? `${day.availableSlots} chỗ trống` : 'Hết chỗ'}</Typography>
                                            </Button>
                                        )
                                    })}
                                </Box>

                                <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                                    <Tabs value={timeTab} onChange={(e, val) => setTimeTab(val)} variant="fullWidth">
                                        <Tab label={`Sáng (${groupedSlots.Sáng?.length || 0})`} value="Sáng" />
                                        <Tab label={`Chiều (${groupedSlots.Chiều?.length || 0})`} value="Chiều" />
                                        <Tab label={`Tối (${groupedSlots.Tối?.length || 0})`} value="Tối" />
                                    </Tabs>
                                </Box>

                                <Box sx={{ minHeight: 120, maxHeight: 200, overflowY: 'auto', p: 1, mt: 2 }}>
                                    {loadingSlots ? <CircularProgress size={24} sx={{ display: 'block', mx: 'auto' }} /> : (
                                        <Grid container spacing={1.5}>
                                            {(groupedSlots[timeTab]?.length || 0) > 0 ? groupedSlots[timeTab].map(slot => (
                                                <Grid item xs={4} key={slot.maSlot}>
                                                    <Button variant={selectedSlot?.maSlot === slot.maSlot ? 'contained' : 'outlined'} fullWidth onClick={() => setSelectedSlot(slot)}>
                                                        {format(parseISO(slot.thoiGianBatDau), 'HH:mm')}
                                                    </Button>
                                                </Grid>
                                            )) : <Typography sx={{ p: 2, width: '100%', textAlign: 'center', color: 'text.secondary' }}>Không có lịch trống.</Typography>}
                                        </Grid>
                                    )}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Giá tư vấn: <Box component="span" color="primary.main" fontWeight="bold">{selectedSlot ? `${selectedSlot.chiPhi.toLocaleString('vi-VN')} đ` : '---'}</Box>
                                </Typography>
                                <Button variant="contained" size="large" fullWidth sx={{ mt: 2 }} disabled={!selectedSlot} onClick={handleProceedToBooking}>
                                    Tiếp tục đặt lịch
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </LocalizationProvider>
    );
};

export default DoctorDetailPage;
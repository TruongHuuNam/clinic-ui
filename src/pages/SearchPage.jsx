import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Checkbox, FormControlLabel, FormGroup,
    RadioGroup, Radio, Slider, Button, Divider, CircularProgress, Alert, Avatar, Link
} from '@mui/material';
import { MedicalServices, AttachMoney, CalendarToday } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Import các service cần thiết
import specialtyService from '../services/specialtyService';
import searchService from '../services/searchService';


// === COMPONENT CON: CARD KẾT QUẢ TÌM KIẾM BÁC SĨ ===
const DoctorResultCard = ({ doctor }) => {
    const navigate = useNavigate();
    return (
        <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2, '&:hover': { boxShadow: 3 } }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3} md={2} sx={{ textAlign: 'center' }}>
                    <Avatar src={doctor.hinhAnhUrl} sx={{ width: 100, height: 100, mx: 'auto' }} />
                </Grid>
                <Grid item xs={12} sm={9} md={7}>
                    <Link component="button" variant="h6" fontWeight={600} onClick={() => navigate(`/doctor/${doctor.maBacSi}`)} sx={{ textAlign: 'left', textDecoration: 'none', color: 'text.primary' }}>
                        {doctor.hocVi || ''} {doctor.hoTen}
                    </Link>
                    <Typography variant="body1" color="primary.main" fontWeight={500}>{doctor.chuyenKhoa}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 0.5 }}>{doctor.phongKham}</Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachMoney fontSize="small" /> Giá khám: <strong>{doctor.giaKham ? `${doctor.giaKham.toLocaleString()} đ` : 'Liên hệ'}</strong>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                    <Button variant="contained" size="large" onClick={() => navigate(`/doctor/${doctor.maBacSi}`)}>
                        Xem lịch
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

// === COMPONENT CON: CARD KẾT QUẢ TÌM KIẾM CHUYÊN KHOA ===
const SpecialtyResultCard = ({ specialty }) => {
    const navigate = useNavigate();
    const handleSelectSpecialty = () => {
        const params = new URLSearchParams();
        params.append('type', 'doctor');
        params.append('specialtyId', specialty.id);
        params.append('specialtyName', specialty.tenChuyenKhoa);
        navigate(`/search?${params.toString()}`);
    };
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer', '&:hover': { boxShadow: 3, borderColor: 'primary.main' } }} onClick={handleSelectSpecialty}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}><MedicalServices /></Avatar>
            <Box>
                <Typography variant="h6" fontWeight={600}>{specialty.tenChuyenKhoa}</Typography>
                <Typography variant="body2" color="text.secondary">{specialty.moTa}</Typography>
            </Box>
        </Paper>
    );
};

// === COMPONENT CON: BỘ LỌC ===
const FilterSidebar = ({ filters, onFilterChange }) => {
    return (
        <Paper sx={{ p: 2, position: 'sticky', top: '80px', borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>Bộ lọc</Typography>
            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold" gutterBottom>Còn trống</Typography>
            <RadioGroup name="availability" value={filters.availability} onChange={(e) => onFilterChange('availability', e.target.value)}>
                <FormControlLabel value="any" control={<Radio size="small" />} label="Bất kỳ ngày nào" />
                <FormControlLabel value="today" control={<Radio size="small" />} label="Hôm nay" />
                <FormControlLabel value="tomorrow" control={<Radio size="small" />} label="Ngày mai" />
                <FormControlLabel value="next7days" control={<Radio size="small" />} label="7 ngày tới" />
                <FormControlLabel value="weekend" control={<Radio size="small" />} label="Cuối tuần" />
            </RadioGroup>
            <Divider sx={{ my: 2 }} />

            <Typography fontWeight="bold" gutterBottom>Giờ đặc biệt</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={filters.timeOfDay.includes('early_morning')} onChange={(e) => onFilterChange('timeOfDay', e.target.value, true)} />} name="timeOfDay" value="early_morning" label="Đầu giờ (Trước 9:00)" />
                <FormControlLabel control={<Checkbox checked={filters.timeOfDay.includes('after_hours')} onChange={(e) => onFilterChange('timeOfDay', e.target.value, true)} />} name="timeOfDay" value="after_hours" label="Ngoài giờ (Sau 17:00)" />
            </FormGroup>
            <Divider sx={{ my: 2 }} />

            {/* THÊM MỚI: Bộ lọc giới tính bác sĩ */}
            <Typography fontWeight="bold" gutterBottom>Giới tính bác sĩ</Typography>
            <RadioGroup row name="doctorGender" value={filters.doctorGender} onChange={(e) => onFilterChange('doctorGender', e.target.value)}>
                <FormControlLabel value="any" control={<Radio size="small" />} label="Tất cả" />
                <FormControlLabel value="Nam" control={<Radio size="small" />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio size="small" />} label="Nữ" />
            </RadioGroup>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight="bold" gutterBottom>Giá khám</Typography>
            <Slider value={filters.priceRange} onChange={(e, newValue) => onFilterChange('priceRange', newValue)} valueLabelDisplay="auto" min={0} max={1500000} step={50000} sx={{ mx: 1, width: '95%' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='caption'>{filters.priceRange[0].toLocaleString()}đ</Typography>
                <Typography variant='caption'>{filters.priceRange[1].toLocaleString()}đ</Typography>
            </Box>

        </Paper>
    );
}

// === COMPONENT CHÍNH CỦA TRANG ===
const SearchPage = () => {
    const [searchParams] = useSearchParams();

    const initialValues = useMemo(() => ({
        type: searchParams.get('type') || 'doctor',
        q: searchParams.get('q') || '',
        specialtyId: searchParams.get('specialtyId') || '',
        specialtyName: searchParams.get('specialtyName') || ''
    }), [searchParams]);

    // THÊM MỚI: Thêm `doctorGender` vào state của bộ lọc
    const [filters, setFilters] = useState({
        availability: 'any',
        timeOfDay: [],
        priceRange: [0, 1500000],
        doctorGender: 'any'
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('Đang tải kết quả...');

    const handleFilterChange = useCallback((name, value, isCheckbox = false) => {
        setFilters(prev => {
            const newFilters = { ...prev };
            if (isCheckbox) {
                const currentValues = prev[name] || [];
                const isChecked = !currentValues.includes(value);
                newFilters[name] = isChecked ? [...currentValues, value] : currentValues.filter(v => v !== value);
            } else {
                newFilters[name] = value;
            }
            return newFilters;
        });
    }, []);

    useEffect(() => {
        const performSearch = () => {
            setLoading(true);
            setError('');

            if (initialValues.type === 'doctor') {
                setTitle(initialValues.specialtyName ? `Bác sĩ chuyên khoa ${initialValues.specialtyName}` : `Kết quả tìm kiếm cho "${initialValues.q || 'Tất cả'}"`);

                // Params gửi đi giờ đã bao gồm cả doctorGender
                const params = { q: initialValues.q, specialtyId: initialValues.specialtyId, ...filters, minPrice: filters.priceRange[0], maxPrice: filters.priceRange[1] };

                searchService.searchDoctors(params)
                    .then(res => setResults(res.data || []))
                    .catch(() => setError("Lỗi khi tìm kiếm bác sĩ. Vui lòng thử lại."))
                    .finally(() => setLoading(false));

            } else { // type === 'specialty'
                setTitle(`Kết quả tìm kiếm chuyên khoa cho "${initialValues.q}"`);
                specialtyService.getAllSpecialties()
                    .then(res => {
                        const allData = res.data || [];
                        if (!initialValues.q) {
                            setResults(allData);
                        } else {
                            const filteredList = allData.filter(s => s.tenChuyenKhoa.toLowerCase().includes(initialValues.q.toLowerCase()));
                            setResults(filteredList);
                        }
                    })
                    .catch(() => setError("Lỗi khi tải danh sách chuyên khoa."))
                    .finally(() => setLoading(false));
            }
        };

        const handler = setTimeout(performSearch, 500);
        return () => clearTimeout(handler);

    }, [filters, initialValues]);

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Grid container spacing={4}>
                {initialValues.type === 'doctor' && (
                    <Grid item xs={12} md={4}>
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
                    </Grid>
                )}

                <Grid item xs={12} md={initialValues.type === 'doctor' ? 8 : 12}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${results.length} kết quả`}
                    </Typography>

                    {loading ? (
                        <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : results.length > 0 ? (
                        initialValues.type === 'doctor'
                            ? results.map(doctor => <DoctorResultCard key={doctor.maBacSi} doctor={doctor} />)
                            : results.map(specialty => <SpecialtyResultCard key={specialty.id} specialty={specialty} />)
                    ) : (
                        <Alert severity="info">Không tìm thấy kết quả nào phù hợp.</Alert>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SearchPage;
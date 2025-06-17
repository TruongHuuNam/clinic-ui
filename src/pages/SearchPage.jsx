import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Container, Grid, Paper, Typography, Box, Checkbox, FormControlLabel, FormGroup,
    RadioGroup, Radio, Slider, Button, Divider, CircularProgress, Alert, Avatar, Chip
} from '@mui/material';
import { Star, WorkOutline, MedicalServices } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

// SỬA LẠI: Import cả hai service
import doctorService from '../services/doctorService';
import specialtyService from '../services/specialtyService';

// === CÁC COMPONENT CON (KHÔNG THAY ĐỔI) ===
const DoctorResultCard = ({ doctor }) => {
    const navigate = useNavigate();
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 } }} onClick={() => navigate(`/doctor/${doctor.maBacSi}`)}>
            <Avatar src={doctor.hinhAnhUrl} sx={{ width: 100, height: 100, alignSelf: 'center' }} />
            <Box flex={1}>
                <Typography variant="h6" fontWeight={600} color="primary.main">{doctor.hoTen}</Typography>
                <Typography variant="body1">{doctor.chuyenKhoa}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{doctor.phongKham}</Typography>
            </Box>
        </Paper>
    );
};

const SpecialtyResultCard = ({ specialty }) => {
    const navigate = useNavigate();
    const handleSelectSpecialty = () => {
        navigate(`/search?type=doctor&specialtyId=${specialty.id}&specialtyName=${specialty.tenChuyenKhoa}`);
    };
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2, cursor: 'pointer', '&:hover': { boxShadow: 3, borderColor: 'primary.main' } }} onClick={handleSelectSpecialty}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 60, height: 60 }}><MedicalServices /></Avatar>
            <Box>
                <Typography variant="h6" fontWeight={600}>{specialty.tenChuyenKhoa}</Typography>
                <Typography variant="body2" color="text.secondary">{specialty.moTa}</Typography>
            </Box>
        </Paper>
    );
};

const FilterSidebar = ({ filters, onFilterChange, onPriceChange }) => (
    <Paper sx={{ p: 2, position: 'sticky', top: '80px', borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Bộ lọc</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight="bold" gutterBottom>Còn trống</Typography>
        <RadioGroup name="availability" value={filters.availability} onChange={onFilterChange}>
            <FormControlLabel value="any" control={<Radio size="small" />} label="Bất kỳ ngày nào" />
            <FormControlLabel value="today" control={<Radio size="small" />} label="Hôm nay" />
            <FormControlLabel value="tomorrow" control={<Radio size="small" />} label="Ngày mai" />
            <FormControlLabel value="next7days" control={<Radio size="small" />} label="7 ngày tới" />
            <FormControlLabel value="weekend" control={<Radio size="small" />} label="Cuối tuần" />
        </RadioGroup>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight="bold" gutterBottom>Giờ đặc biệt</Typography>
        <FormGroup>
            <FormControlLabel control={<Checkbox name="timeOfDay" value="early_morning" checked={filters.timeOfDay.includes('early_morning')} onChange={onFilterChange} />} label="Đầu giờ (Trước 9:00)" />
            <FormControlLabel control={<Checkbox name="timeOfDay" value="after_hours" checked={filters.timeOfDay.includes('after_hours')} onChange={onFilterChange} />} label="Ngoài giờ (Sau 17:00)" />
        </FormGroup>
        <Divider sx={{ my: 2 }} />
        <Typography fontWeight="bold" gutterBottom>Giá khám (VNĐ)</Typography>
        <Slider value={filters.priceRange} onChangeCommitted={onPriceChange} valueLabelDisplay="auto" min={0} max={1500000} step={50000} sx={{ mx: 1, width: '95%' }} valueLabelFormat={(value) => `${(value / 1000)}k`} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant='caption'>0đ</Typography><Typography variant='caption'>1,500,000đ</Typography></Box>
    </Paper>
);

// === COMPONENT CHÍNH ===
const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchType = searchParams.get('type') || 'doctor';

    // State cho bộ lọc
    const [filters, setFilters] = useState({
        availability: 'any',
        timeOfDay: [],
        doctorGender: 'any',
        priceRange: [0, 1500000]
    });

    // State cho kết quả và UI
    const [doctorResults, setDoctorResults] = useState([]);
    const [allSpecialties, setAllSpecialties] = useState([]); // State mới để lưu tất cả chuyên khoa
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('Kết quả tìm kiếm');

    const handleFilterChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFilters(prev => {
            const newFilters = { ...prev };
            if (type === 'checkbox') {
                const currentValues = newFilters[name] || [];
                newFilters[name] = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
            } else {
                newFilters[name] = value;
            }
            return newFilters;
        });
    };

    const handlePriceChange = (event, newValue) => {
        setFilters(prev => ({ ...prev, priceRange: newValue }));
    };

    // SỬA LẠI: Tách logic gọi API ra
    const fetchDoctors = useCallback(() => {
        setLoading(true);
        setError('');
        const specialtyName = searchParams.get('specialtyName');
        const q = searchParams.get('q');
        setTitle(specialtyName ? `Bác sĩ chuyên khoa ${specialtyName}` : `Kết quả tìm kiếm cho "${q || 'Tất cả'}"`);

        const params = {
            q: q || '',
            specialtyId: searchParams.get('specialtyId') || '',
            ...filters,
            minPrice: filters.priceRange[0],
            maxPrice: filters.priceRange[1],
        };
        // Đây là nơi bạn gọi API backend thật
        doctorService.getAllDoctors(params) // Giả định hàm tìm kiếm bác sĩ của bạn
            .then(res => setDoctorResults(res.data || []))
            .catch(() => setError("Lỗi khi tìm bác sĩ."))
            .finally(() => setLoading(false));
    }, [searchParams, filters]);

    const fetchAllSpecialties = useCallback(() => {
        setLoading(true);
        setError('');
        const q = searchParams.get('q') || '';
        setTitle(`Kết quả tìm kiếm chuyên khoa cho "${q}"`);
        specialtyService.getAllSpecialties() // Sử dụng hàm có sẵn của bạn
            .then(res => setAllSpecialties(res.data || []))
            .catch(() => setError("Lỗi khi tải danh sách chuyên khoa."))
            .finally(() => setLoading(false));
    }, [searchParams]);

    // SỬA LẠI: useEffect chính để quyết định hàm nào sẽ được gọi
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchType === 'doctor') {
                fetchDoctors();
            } else { // searchType === 'specialty'
                fetchAllSpecialties();
            }
        }, 300); // Debounce
        return () => clearTimeout(handler);
    }, [filters, searchType, fetchDoctors, fetchAllSpecialties]);

    // SỬA LẠI: Logic lọc chuyên khoa ở frontend theo yêu cầu của bạn
    const displayedSpecialties = useMemo(() => {
        const searchTerm = searchParams.get('q')?.toLowerCase() || '';
        // Quy tắc 1: Nếu không nhập gì, hiển thị tất cả
        if (!searchTerm) return allSpecialties;

        // Quy tắc 2: Lọc các chuyên khoa có tên chứa từ khóa
        const filteredList = allSpecialties.filter(s =>
            s.tenChuyenKhoa.toLowerCase().includes(searchTerm)
        );

        // Quy tắc 3: Nếu lọc không ra kết quả, vẫn hiển thị tất cả
        return filteredList.length > 0 ? filteredList : allSpecialties;
    }, [searchParams, allSpecialties]);


    const renderResults = () => {
        if (loading) {
            return <Box sx={{ textAlign: 'center', mt: 5 }}><CircularProgress /></Box>;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        // Hiển thị kết quả Bác sĩ
        if (searchType === 'doctor') {
            if (doctorResults.length > 0) {
                return doctorResults.map(doctor => <DoctorResultCard key={doctor.maBacSi} doctor={doctor} />);
            }
            return <Alert severity="info">Không tìm thấy bác sĩ phù hợp với bộ lọc của bạn.</Alert>;
        }
        // Hiển thị kết quả Chuyên khoa
        if (searchType === 'specialty') {
            if (displayedSpecialties.length > 0) {
                return displayedSpecialties.map(specialty => <SpecialtyResultCard key={specialty.id} specialty={specialty} />);
            }
            return <Alert severity="info">Không có dữ liệu chuyên khoa để hiển thị.</Alert>;
        }
        return null;
    };


    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Grid container spacing={4}>
                {/* Cột Bộ lọc: Chỉ hiển thị khi tìm bác sĩ */}
                {searchType === 'doctor' && (
                    <Grid item xs={12} md={4}>
                        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} onPriceChange={handlePriceChange} />
                    </Grid>
                )}

                {/* Cột Kết quả: Thay đổi grid tùy theo có bộ lọc hay không */}
                <Grid item xs={12} md={searchType === 'doctor' ? 8 : 12}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
                    {renderResults()}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SearchPage;
import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mockHistory = [
  {
    id: 'A1',
    doctor: 'GS.TS.BS Lê Văn Cường',
    doctorAvatar: 'https://cdn.hellobacsi.com/wp-content/uploads/2022/10/doctor-avatar.png',
    specialty: 'Nội tổng quát',
    date: '2025-05-27',
    time: '09:00',
    status: 'done',
    canReview: true,
  },
  {
    id: 'A2',
    doctor: 'BS. Nguyễn Thị Hoa',
    doctorAvatar: 'https://cdn.hellobacsi.com/wp-content/uploads/2022/10/doctor-avatar.png',
    specialty: 'Nhi khoa',
    date: '2025-05-20',
    time: '10:00',
    status: 'canceled',
    canReview: false,
  },
  {
    id: 'A3',
    doctor: 'GS.TS.BS Lê Văn Cường',
    doctorAvatar: 'https://cdn.hellobacsi.com/wp-content/uploads/2022/10/doctor-avatar.png',
    specialty: 'Nội tổng quát',
    date: '2025-04-15',
    time: '11:00',
    status: 'upcoming',
    canReview: false,
  },
];

const statusMap = {
  done: { label: 'Đã khám', color: 'success' },
  canceled: { label: 'Đã hủy', color: 'error' },
  upcoming: { label: 'Sắp tới', color: 'info' },
};

const clinicInfo = {
  name: 'HelloClinic',
  address: '180 Cao Lỗ, Phường 4, Quận 8, Hồ Chí Minh',
};

const BookingHistory = () => {
  const navigate = useNavigate();

  const handleView = (row) => {
    navigate(`/confirmation`, {
      state: {
        appointment: {
          id: row.id,
          doctor: {
            name: row.doctor,
            specialty: row.specialty,
          },
          date: row.date,
          time: row.time,
          clinic: {
            name: clinicInfo.name,
            address: clinicInfo.address,
          },
        },
      },
    });
  };

  const handleReview = (id) => {
    navigate(`/review/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Lịch sử khám bệnh
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Bác sĩ</TableCell>
              <TableCell>Chuyên khoa</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ</TableCell>
              <TableCell>Phòng khám</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockHistory.map((row) => (
              <TableRow key={row.id} hover sx={{ '&:hover': { background: '#f0f7ff' } }}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={row.doctorAvatar} alt={row.doctor} />
                    <Box>
                      <Typography fontWeight={600}>{row.doctor}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{row.specialty}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>
                  <Typography fontWeight={500}>{clinicInfo.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{clinicInfo.address}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={statusMap[row.status].label} color={statusMap[row.status].color} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(row)}
                    >
                      Xem
                    </Button>
                    {row.canReview && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleReview(row.id)}
                      >
                        Đánh giá
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BookingHistory;

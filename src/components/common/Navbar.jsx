import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  // Giả lập trạng thái đăng nhập
  const isLoggedIn = true;
  const user = { name: 'Nguyen Van A', avatar: '' };

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="/logo.jpg" alt="logo" style={{ height: 40, marginRight: 12 }} />
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            HelloClinic
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Trang chủ</Button>
          <Button color="inherit" component={Link} to="/history">Lịch sử khám</Button>
          <Button color="inherit" component={Link} to="/review/1">Đánh giá</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                <Avatar alt={user.name} src={user.avatar} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Tài khoản</MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/logout'); }}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="primary" variant="outlined" component={Link} to="/login">Đăng nhập</Button>
          )}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem component={Link} to="/">Trang chủ</MenuItem>
            <MenuItem component={Link} to="/history">Lịch sử khám</MenuItem>
            <MenuItem component={Link} to="/review/1">Đánh giá</MenuItem>
            {isLoggedIn ? (
              <MenuItem onClick={() => { handleClose(); navigate('/logout'); }}>Đăng xuất</MenuItem>
            ) : (
              <MenuItem component={Link} to="/login">Đăng nhập</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

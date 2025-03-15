import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar({ onLoginRegisterClick, handleLogout, user }) {
  const navigate = useNavigate();

  
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

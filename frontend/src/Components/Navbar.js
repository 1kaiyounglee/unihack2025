import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Tooltip, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function Navbar({ onAlertsClick }) {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);  // Drawer state

  const handleHomeClick = () => {
    navigate('/');  // Navigate to the home page
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center'}}>
          <Typography variant="h6" component="div">
            Heatmap
          </Typography>
          <Tooltip title="Create Alert">
            <IconButton color="inherit" onClick={onAlertsClick}>
              <WarningAmberRoundedIcon />
            </IconButton>
          </Tooltip>

          
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

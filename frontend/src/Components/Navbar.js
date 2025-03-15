import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);  // Drawer state

  const handleHomeClick = () => {
    navigate('/');  // Navigate to the home page
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'flex-start', paddingRight: 2 }}>
        {/* Menu Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2 }} // Adds margin between icon and text
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer Component */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <div style={{ width: 250 }}>
            <Button onClick={() => setDrawerOpen(false)}>Close</Button>
            <Typography variant="h6">Map Controls</Typography>
            {/* Add more controls or actions here */}
          </div>
        </Drawer>

        {/* Navbar Title */}
        <Typography variant="h6" component="div">
          Heatmap
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

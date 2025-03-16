import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import Navbar from './Components/Navbar';
import AlertsModal from './Components/AlertsModal';

import Map from './Pages/Map';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});


function App() {
  const [loading, setLoading] = useState(false);
  const [isAlertsOpen, setAlertsOpen] = useState(false);
  
  const openAlertsModal = () => {
    setAlertsOpen(true);
  };
  
  const closeAlertsModal = () => {
    setAlertsOpen(false);
  }
  const handleSetLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* Loading indicator */}
          <Backdrop open={loading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Navbar
            onAlertsClick={openAlertsModal}
          
          />
          <Box sx={{ paddingTop: '64px' }}></Box>
          
          {/* Map route */}
          <Routes>
            <Route path="/" element={<Map />} />
          </Routes>
        </Box>

        <AlertsModal
            open={isAlertsOpen}
            onClose={closeAlertsModal}
            setLoading={handleSetLoading}
          />




      </Router>
    </ThemeProvider>
  );
}

export default App;

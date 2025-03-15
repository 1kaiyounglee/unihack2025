import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import Navbar from './Components/Navbar';
// Import your page component
import HomePage from './Pages/HomePage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: deepPurple,
  },
});

function App() {
  const [loading, setLoading] = useState(false);

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
          <Navbar/>
          <Box sx={{ paddingTop: '64px' }}></Box>
          
          {/* HomePage route */}
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

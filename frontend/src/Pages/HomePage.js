import React, { useState, useEffect } from 'react';
import { getData } from '../HelperFunctions/GetDatabaseModels'; // Make sure to update the import path
import { Box, Typography, CircularProgress, Paper } from '@mui/material';

const HomePage = () => {
  const [data, setData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Function to fetch the data from the "Infared" table
    const fetchData = async () => {
      const fetchedData = await getData("Infared"); // Fetch data from the "Infared" table
      if (fetchedData) {
        setData(fetchedData); // Set the fetched data into state
      }
      setLoading(false); // Set loading to false once the data is fetched
    };

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  // Display loading state until the data is fetched
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Display the fetched data once it's available
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        HomePage
      </Typography>

      {data ? (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Data from Infared Table:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(data, null, 2)} {/* Display raw JSON data */}
          </Typography>
        </Paper>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No data found.
        </Typography>
      )}
    </Box>
  );
};

export default HomePage;

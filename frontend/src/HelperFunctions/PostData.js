export const createAlert = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/api/database/create_alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: values.latitude,
          longitude: values.longitude,
          radius: values.radius,
          threshold: values.threshold,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Unknown error occurred');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      return { error: error.message || 'Unknown error occurred' };
    }
  };

 
  
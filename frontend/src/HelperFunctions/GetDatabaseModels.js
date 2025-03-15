// GetDatabaseModels.js

// Function to perform the database request
async function fetchDatabaseData(query) {
    try {
      const response = await fetch("http://localhost:5000/api/database/fetch_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });
  
      if (!response.ok) {
        console.log(`\n\n\nERROR: ${response.status}, ${response.text}\n\n\n`)
        throw new Error("Network response was not ok:");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

// Generic function to get data from a specified table with optional conditions
export async function getData(tableName, whereClause = "") {
    // Build the base SQL query
    let query = `SELECT * FROM ${tableName}`;
  
    // Append the WHERE clause if provided
    if (whereClause) {
      query += ` WHERE ${whereClause}`;
    }
  
    // Fetch the data using the dynamic query
    const data = await fetchDatabaseData(query);
  
    if (!data) {
      return null; // Handle no data case
    }
  
    return data; // Return raw data for further processing
}
  


export async function getSensorData(dateTime) {
  try {
    const response = await fetch("http://localhost:5000/api/database/fetch_sensor_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateTime }),  // ✅ Pass datetime as part of the request
    });

    if (!response.ok) {
      console.log(`\n\n\nERROR: ${response.status}, ${await response.text()}\n\n\n`);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null; 
    }

    // ✅ Transform data into the expected format
    const sensorReadings = data.map((reading) => ({
      count         : reading.count,
      latitude      : reading.latitude,
      longitude     : reading.longitude,
      lastDateTime  : reading.recorded_datetime,
    }));

    return sensorReadings;

  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

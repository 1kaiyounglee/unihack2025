import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSensorData, scanAlerts } from '../HelperFunctions/GetDatabaseModels';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const mapStyle = 'mapbox://styles/mapbox/streets-v12';
  let currentPopup = null;  // To store the current popup to close it when needed

  // Fetch sensor data
  async function fetchData() {
    const currentDateTime = new Date().toISOString();
    const sensorReadings = await getSensorData(currentDateTime);  // Get data from your function
    setSensorData(sensorReadings);  // Set the data to the state
  }

  // Fetch alerts
  async function fetchAlerts() {
    const rawAlerts = await scanAlerts();
    console.log(`Alerts: ${rawAlerts}`);
    setAlerts(rawAlerts);
  }

  useEffect(() => {
    // Initial data fetch when the component mounts
    fetchData();
    fetchAlerts();

    // Set interval to fetch data every 5 minutes
    const intervalId = setInterval(() => {
      fetchData();  // fetch new data every 5 minutes
      fetchAlerts(); // Fetch alerts as well
    }, 300000); // 300000 ms = 5 minutes

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);  // Empty dependency array means this runs once on mount

  useEffect(() => {
    console.log(sensorData);  // This will log the updated sensorData after the state has changed
  }, [sensorData]);  // This will trigger whenever sensorData changes

  useEffect(() => {
    // Set up the map
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [151.210863, -33.868448], // Center the map on your initial data
      zoom: 13,
    });

    newMap.on('zoomend', () => {
      const zoomLevel = newMap.getZoom();
      console.log('Zoom level:', zoomLevel);
    });

    // Set up the map after it's loaded
    newMap.on('load', () => {
      const geojsonData = {
        type: 'FeatureCollection',
        features: sensorData.map((sensor) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [sensor.longitude, sensor.latitude],
          },
          properties: {
            count: sensor.count,
          },
        })),
      };

      newMap.addSource('sensor-data', {
        type: 'geojson',
        data: geojsonData,
      });

      newMap.addLayer(
        {
          id: 'people-density',
          type: 'heatmap',
          source: 'sensor-data',
          maxzoom: 24,
          paint: {
            // Adjust the heatmap intensity based on count
            'heatmap-weight': {
              property: 'count',  
              type: 'exponential',  
              stops: [
                [1, 0],     
                [50, 0.05],
                [100, 0.1],
                [1000, 1],   
              ]
            },
            'heatmap-intensity': {
              stops: [
                [10, 1],  
                [15, 1.5],
                [20, 2]   
              ]
            },
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'], 
              0, 'rgba(0,0,255,0)',   
              0.2, 'rgb(0,255,255)',  
              0.4, 'rgb(0,255,0)',    
              0.6, 'rgb(255,255,0)',  
              0.8, 'rgb(255,165,0)',  
              1, 'rgb(255,0,0)'       
            ],
            'heatmap-radius': {
              stops: [
                [1, 3.75],
                [5, 18.75],
                [10, 37.5], 
                [15, 56.25],
                [20, 75],   
              ]
            },
            'heatmap-opacity': {
              default: 1,  
              stops: [
                [11, 1],  
                [15, 1],  
                [20, 1]  
              ]
            }
          }
        },
        'waterway-label'
      );

      // Add Alerts to map
      if (alerts.length > 0) {
        alerts.forEach((alert) => {
          const { latitude, longitude, count } = alert;
      
          // Create a marker for each alert
          const alertMarker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([longitude, latitude])  // Set the marker's position
            .addTo(newMap);  // Add the marker to the map
      
          // Add a click event listener to the marker
          alertMarker.getElement().addEventListener('click', () => {
            alert("Clicked");
            const popup = new mapboxgl.Popup()
              .setLngLat([longitude, latitude])  // Set the popup position to the alert's location
              .setHTML(`
                <h3>Alert</h3>
                <p>Count: ${count} People</p>
              `)  // Add the alert's radius as HTML content
              .addTo(newMap);  // Add the popup to the map
          });
        });
      }
      
    });

    setMap(newMap);

    return () => newMap.remove();
  }, [sensorData, alerts]);  // Trigger map update when sensorData or alerts change

  return <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSensorData } from '../HelperFunctions/GetDatabaseModels';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [sensorData, setSensorData] = useState([]);
  const mapStyle = 'mapbox://styles/mapbox/streets-v12';
  // Fetch data from your API
  async function fetchData() {
    const currentDateTime = new Date().toISOString();
    const sensorReadings = await getSensorData(currentDateTime);  // Get data from your function
    setSensorData(sensorReadings);  // Set the data to the state
  }

  useEffect(() => {
    // Initial data fetch when the component mounts
    fetchData();

    // Set up the interval to refetch data every 5 seconds (5000 ms)
    const intervalId = setInterval(() => {
      fetchData();  // fetch new adat aevery minute
    }, 300000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);  // Empty dependency array means this runs once on mount



  // UseEffect to log sensorData after it's been updated
  useEffect(() => {
    console.log(sensorData);  // This will log the updated sensorData after the state has changed
  }, [sensorData]);  // This will trigger whenever sensorData changes

  useEffect(() => {
    // Set your Mapbox access token
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
              property: 'count',  // Use 'count' for intensity
              type: 'exponential',  // Exponential scaling
              stops: [
                [1, 0],     // At count 1, the weight is 0 (no intensity)
                [50, 0.3],
                [100, 0.6],
                [250, 1],   // At count 500, the weight is 1 (full intensity)
              ]
            },
          
            // Adjust the heatmap intensity
            'heatmap-intensity': {
              stops: [
                [11, 1],  // At zoom level 11, intensity is 1
                [15, 2],
                [20, 3]   
              ]
            },
          
            // Adjust the heatmap colors for temperature scale (low to high density)
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'], // Density is mapped to color
              0, 'rgba(0,0,255,0)',   // Blue (cool)
              0.2, 'rgb(0,255,255)',  // Cyan
              0.4, 'rgb(0,255,0)',    // Green
              0.6, 'rgb(255,255,0)',  // Yellow
              0.8, 'rgb(255,165,0)',  // Orange
              1, 'rgb(255,0,0)'       // Red (hot)
            ],
          
            // controls radius of 
            'heatmap-radius': {
              stops: [
                [11, 30], 
                [15, 50],
                [20, 75]   
              ]
            },
          
            // Keep heatmap visible at higher zoom levels
            'heatmap-opacity': {
              default: 1,  // Keep opacity at 100% for all zoom levels
              stops: [
                [11, 1],  // Keep opacity moderate at zoom level 11
                [15, 1],  // Full opacity at zoom level 15
                [20, 1]  // Full opacity at zoom level 20
              ]
            }
          }
          
        },
        'waterway-label'
      );

      newMap.addLayer(
        {
          id: 'density-points',
          type: 'circle',
          source: 'sensor-data',
          minzoom: 14,
          paint: {
            'circle-radius': {
              property: 'count',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                // [{ zoom: 15, value: 500 }, 10],
                // [{ zoom: 22, value: 1 }, 20],
                // [{ zoom: 22, value: 500 }, 50]
              ]
            },
            'circle-color': {
              property: 'count',
              type: 'exponential',
              stops: [
                [0, 'rgba(236,222,239,0)'],
                [10, 'rgb(236,222,239)'],
                [20, 'rgb(208,209,230)'],
                [30, 'rgb(166,189,219)'],
                [40, 'rgb(103,169,207)'],
                [50, 'rgb(28,144,153)'],
                [60, 'rgb(1,108,89)']
              ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
              stops: [
                [14, 0],
                [15, 1]
              ]
            }
          }
        },
        'waterway-label'
      );
    });

    setMap(newMap);

    return () => newMap.remove();
  }, [sensorData]);  // Only rerun map setup when sensorData changes

  return <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;

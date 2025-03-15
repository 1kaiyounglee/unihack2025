import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSensorData } from '../HelperFunctions/GetDatabaseModels';

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [sensorData, setSensorData] = useState([]);

  // Fetch data from your API
  async function fetchData() {
    const sensorReadings = await getSensorData();  // Get data from your function
    setSensorData(sensorReadings);  // Set the data to the state
  }

  // Fetch data once when the component mounts
  useEffect(() => {
    fetchData();
  }, []);  // Empty dependency array means this runs once, after component mounts

  // UseEffect to log sensorData after it's been updated
  useEffect(() => {
    console.log(sensorData);  // This will log the updated sensorData after the state has changed
  }, [sensorData]);  // This will trigger whenever sensorData changes

  useEffect(() => {
    // Set your Mapbox access token
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [151.161154, -33.706665], // Center the map on your initial data
      zoom: 13,
    });

    // Set up the map after it's loaded
    newMap.on('load', () => {
      const geojsonData = {
        type: 'FeatureCollection',
        features: sensorData.map((sensor) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [sensor.latitude, sensor.longitude],
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
          maxzoom: 15,
          paint: {
            'heatmap-weight': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(236,222,239,0)',
              0.2,
              'rgb(208,209,230)',
              0.4,
              'rgb(166,189,219)',
              0.6,
              'rgb(103,169,207)',
              0.8,
              'rgb(28,144,153)'
            ],
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            'heatmap-opacity': {
              default: 1,
              stops: [
                [14, 1],
                [15, 0]
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
              property: 'dbh',
              type: 'exponential',
              stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50]
              ]
            },
            'circle-color': {
              property: 'dbh',
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

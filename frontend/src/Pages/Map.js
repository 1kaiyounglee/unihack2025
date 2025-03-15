import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getData } from '../HelperFunctions/GetDatabaseModels';


// Sample data, assuming it's fetched from your database


// const sensorData = [
//   { lat: -33.706665, lon: 151.161154, count: 5, date_recorded: '2025-03-14T12:00:00.000Z' },
//   { lat: -33.707665, lon: 151.162154, count: 8, date_recorded: '2025-03-14T12:00:10.000Z' },
//   { lat: -33.708665, lon: 151.163154, count: 3, date_recorded: '2025-03-14T12:00:20.000Z' },
//   // Add more sample data points here
// ];

const Map = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [data, setData] = useState([]);

  async function fetchData() {
    const sensorData = await getData("Infrared");
    setData(sensorData);
    console.log(data);
  }
  useEffect(() => {
    fetchData();
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
      // Prepare the sensor data in GeoJSON format
      const geojsonData = {
        type: 'FeatureCollection',
        features: data.map((sensor) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [sensor.lon, sensor.lat],
          },
          properties: {
            count: sensor.count,
          },
        })),
      };

      // Add a source for the heatmap layer using GeoJSON data
      newMap.addSource('sensor-data', {
        type: 'geojson',
        data: geojsonData,
      });
      newMap.addLayer(
        {
          id: 'people-denisty',
          type: 'heatmap',
          source: 'sensor-data',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'dbh',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            // assign color values be applied to points depending on their density
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
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
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
            // increase the radius of the circle as the zoom level and dbh value increases
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
      // // Add the heatmap layer
      // newMap.addLayer({
      //   id: 'heatmap-layer',
      //   type: 'heatmap',
      //   source: 'sensor-data',
      //   maxzoom: 9,
      //   paint: {
      //     'heatmap-weight': [
      //       'interpolate',
      //       ['linear'],
      //       ['get', 'count'],  // Get the 'count' property to determine the intensity
      //       0,
      //       0,
      //       10,
      //       1,
      //     ],
      //     'heatmap-intensity': [
      //       'interpolate',
      //       ['linear'],
      //       ['zoom'],
      //       0,
      //       1,
      //       9,
      //       3,
      //     ],
      //     'heatmap-color': [
      //       'interpolate',
      //       ['linear'],
      //       ['heatmap-density'],
      //       0,
      //       'rgba(33,102,172,0)',
      //       0.2,
      //       'rgb(103,169,207)',
      //       0.4,
      //       'rgb(209,229,240)',
      //       0.6,
      //       'rgb(253,219,199)',
      //       0.8,
      //       'rgb(239,138,98)',
      //       1,
      //       'rgb(178,24,43)',
      //     ],
      //     'heatmap-radius': [
      //       'interpolate',
      //       ['linear'],
      //       ['zoom'],
      //       0,
      //       2,
      //       9,
      //       20,
      //     ],
      //     'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
      //   },
      // }, 'waterway-label');
    
    
    
    
    
    });

   
    setMap(newMap);

    return () => newMap.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;

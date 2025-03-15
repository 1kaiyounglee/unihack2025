import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AppBar, Toolbar, IconButton, Drawer, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Homepage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Get current location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Default map settings
  const zoom = 13;

  // Default icon for Leaflet markers (fix missing icon image issue)
  useEffect(() => {
    const defaultIcon = new L.Icon({
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  // get mapbox api key
  const mapboxToken = process.env.REACT_APP_MAPBOX_API_TOKEN;
  
  // set tilelayer url w/ otoken
  const url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;

  return (
    <div style={{ height: '100vh' }}>
      {/* MUI AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Map with MUI and Leaflet</Typography>
        </Toolbar>
      </AppBar>

      {/* MUI Drawer for Sidebar */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div style={{ width: 250 }}>
          <Button onClick={() => setDrawerOpen(false)}>Close</Button>
          <Typography variant="h6">Map Controls</Typography>
          {/* Add more controls or actions here */}
        </div>
      </Drawer>

      {/* Map Container */}
      {currentLocation && (
        <MapContainer
          center={currentLocation}
          zoom={zoom}
          style={{ width: '100%', height: '100%', zIndex: 0 }} // Ensure map is behind other components
        >
          {/* Use the Mapbox URL with the dynamic token */}
          <TileLayer
            url={url}
            attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={currentLocation}>
            <Popup>Your current location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Homepage;

import React, { useEffect, useState, Component } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
// Custom marker icons based on crowd level
const createCustomIcon = crowdLevel => {
  const color = crowdLevel === 'high' ? 'red' : crowdLevel === 'medium' ? 'orange' : 'green';
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};
// Component to handle map center changes
const ChangeView = ({
  center
}) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};
const Map = ({
  places,
  hoveredPlace,
  onPlaceHover,
  onPlaceLeave,
  onPlaceSelect
}) => {
  const [mapCenter, setMapCenter] = useState([-33.8688, 151.2093]);
  // Update map center when hovering over a place
  useEffect(() => {
    if (hoveredPlace) {
      setMapCenter(hoveredPlace.location);
    }
  }, [hoveredPlace]);
  return <div className="h-full w-full">
      <MapContainer center={mapCenter} zoom={14} style={{
      height: '100%',
      width: '100%'
    }}>
        <ChangeView center={mapCenter} />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
        {places.map(place => <Marker key={place.id} position={place.location} icon={createCustomIcon(place.crowdLevel)} eventHandlers={{
        mouseover: () => onPlaceHover(place),
        mouseout: onPlaceLeave,
        click: () => onPlaceSelect(place)
      }}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold">{place.name}</h3>
                <p className="text-sm mb-2">
                  Crowd level:
                  <span className={`ml-1 font-medium ${place.crowdLevel === 'high' ? 'text-red-600' : place.crowdLevel === 'medium' ? 'text-orange-500' : 'text-green-600'}`}>
                    {place.crowdLevel}
                  </span>
                </p>
                <Link to={`/location/${place.id}`} className="text-blue-600 hover:underline text-sm">
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>)}
      </MapContainer>
    </div>;
};
export default Map;
import React, { useState } from 'react';
import Map from './Map';
import PlaceList from './PlaceList';
import PlaceDetail from './PlaceDetail';
import EventList from './EventList';
const MapPage = () => {
  // Mock data for events
  const events = [{
    id: 'e1',
    name: 'Live Jazz Night',
    locationId: '1',
    location: 'Downtown Coffee Shop',
    time: 'Tonight 8 PM',
    timeRemaining: 'Starts in 2h',
    attendees: 89,
    trending: true,
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  }, {
    id: 'e2',
    name: 'Summer Festival',
    locationId: '2',
    location: 'Central Park',
    time: 'Now',
    timeRemaining: 'Happening now',
    attendees: 230,
    trending: true,
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  }, {
    id: 'e3',
    name: 'Tech Meetup',
    locationId: '3',
    location: 'Tech Museum',
    time: 'Today 6 PM',
    timeRemaining: 'Starts in 4h',
    attendees: 45,
    trending: false,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  }, {
    id: 'e4',
    name: 'Wine Tasting',
    locationId: '4',
    location: 'Riverside Restaurant',
    time: 'Today 7 PM',
    timeRemaining: 'Starts in 5h',
    attendees: 28,
    trending: false,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
  }];

  // Mock data for places
  const places = [{
    id: '1',
    name: 'Downtown Coffee Shop',
    location: [51.505, -0.09],
    crowdLevel: 'high',
    description: 'A popular coffee shop in the heart of downtown. Known for its artisanal brews and comfortable atmosphere.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: 24
  }, {
    id: '2',
    name: 'Central Park',
    location: [51.51, -0.1],
    crowdLevel: 'medium',
    description: 'A large urban park with walking trails, picnic areas, and recreational facilities.',
    image: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&auto=format&fit=crop&w=1078&q=80',
    posts: 56
  }, {
    id: '3',
    name: 'Tech Museum',
    location: [51.515, -0.09],
    crowdLevel: 'low',
    description: 'An interactive museum showcasing the latest in technology and innovation.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: 18
  }, {
    id: '4',
    name: 'Riverside Restaurant',
    location: [51.503, -0.08],
    crowdLevel: 'high',
    description: 'Upscale dining with stunning views of the river. Specializes in seafood and local cuisine.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: 42
  }, {
    id: '5',
    name: 'Community Library',
    location: [51.51, -0.085],
    crowdLevel: 'low',
    description: 'A quiet space for reading and studying with an extensive collection of books and digital resources.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: 7
  }];
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const handlePlaceHover = place => {
    setHoveredPlace(place);
  };
  const handlePlaceLeave = () => {
    setHoveredPlace(null);
  };
  const handlePlaceSelect = place => {
    setSelectedPlace(place);
  };
  return <div className="flex flex-col w-full">
      <div className="h-[50vh] w-full">
        <Map places={places} hoveredPlace={hoveredPlace} onPlaceHover={handlePlaceHover} onPlaceLeave={handlePlaceLeave} onPlaceSelect={handlePlaceSelect} />
      </div>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            What's Happening Now
          </h2>
          <EventList events={events} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Popular Places
        </h2>
        <PlaceList places={places} onPlaceHover={handlePlaceHover} onPlaceLeave={handlePlaceLeave} onPlaceSelect={handlePlaceSelect} />
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            More to Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {places.map(place => <PlaceDetail key={place.id} place={place} onPlaceHover={() => handlePlaceHover(place)} onPlaceLeave={handlePlaceLeave} onPlaceSelect={() => handlePlaceSelect(place)} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default MapPage;
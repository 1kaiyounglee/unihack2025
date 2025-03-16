import React from 'react';
import Map from './Map';
import { Search, Filter } from 'lucide-react';
const FullMapPage = () => {
  // Using the same mock data from MapPage
  const places = [{
    id: '1',
    name: 'Downtown Coffee Shop',
    location: [51.505, -0.09],
    crowdLevel: 'high',
    description: 'A popular coffee shop in the heart of downtown.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    posts: 24
  }
  // ... other places
  ];
  return <div className="h-screen w-full flex flex-col">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input type="text" placeholder="Search locations..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-50">
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      {/* Full Screen Map */}
      <div className="flex-1">
        <Map places={places} hoveredPlace={null} onPlaceHover={() => {}} onPlaceLeave={() => {}} onPlaceSelect={() => {}} />
      </div>
    </div>;
};
export default FullMapPage;
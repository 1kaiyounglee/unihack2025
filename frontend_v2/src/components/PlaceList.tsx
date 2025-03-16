import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin } from 'lucide-react';
const PlaceList = ({
  places,
  onPlaceHover,
  onPlaceLeave,
  onPlaceSelect
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {places.map(place => <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" onMouseEnter={() => onPlaceHover(place)} onMouseLeave={onPlaceLeave} onClick={() => onPlaceSelect(place)}>
          <Link to={`/location/${place.id}`} className="block">
            <div className="h-32 overflow-hidden">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
              <div className="flex items-center mt-2">
                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-600">0.5 miles away</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className={`text-sm font-medium ${place.crowdLevel === 'high' ? 'text-red-600' : place.crowdLevel === 'medium' ? 'text-orange-500' : 'text-green-600'}`}>
                    {place.crowdLevel === 'high' ? 'Very busy' : place.crowdLevel === 'medium' ? 'Moderately busy' : 'Not busy'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {place.posts} posts
                </span>
              </div>
            </div>
          </Link>
        </div>)}
    </div>;
};
export default PlaceList;
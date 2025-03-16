import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, MessageCircle, ThumbsUp, MapPin } from 'lucide-react';
const PlaceDetail = ({
  place,
  onPlaceHover,
  onPlaceLeave,
  onPlaceSelect
}) => {
  return <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300" onMouseEnter={onPlaceHover} onMouseLeave={onPlaceLeave} onClick={onPlaceSelect}>
      <Link to={`/location/${place.id}`} className="block">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 md:w-2/3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-gray-900">{place.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${place.crowdLevel === 'high' ? 'bg-red-100 text-red-700' : place.crowdLevel === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {place.crowdLevel === 'high' ? 'Very busy' : place.crowdLevel === 'medium' ? 'Moderately busy' : 'Not busy'}
              </span>
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>0.5 miles away</span>
              <Clock className="h-4 w-4 ml-3 mr-1" />
              <span>Open now</span>
            </div>
            <p className="mt-3 text-gray-600">{place.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <ThumbsUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">142</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">{place.posts}</span>
                </div>
              </div>
              <span className="text-sm text-blue-600 hover:underline">
                View details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>;
};
export default PlaceDetail;
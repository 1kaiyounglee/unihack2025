import React, { useState, useEffect } from 'react';
import { Clock, Users, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const EventList = ({ events: initialEvents = [] }) => {
  const location = useLocation();
  const [events, setEvents] = useState(initialEvents);

  // Check if a new event was passed in via router state and add it to our list.
  useEffect(() => {
    if (location.state && location.state.newEvent) {
      setEvents(prevEvents => [...prevEvents, location.state.newEvent]);
    }
  }, [location.state]);

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-4 pb-4">
        {events.map(event => (
          <Link
            key={event.id}
            to={`/location/${event.id}`}
            className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-40">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-xs">
                {event.time}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{event.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>{event.time}</span>
                <div className="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-1 text-purple-600" />
                <span className="font-medium text-purple-600">
                  Live Count: {event.peopleCount}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventList;

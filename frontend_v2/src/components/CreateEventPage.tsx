import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Image as ImageIcon, Info } from 'lucide-react';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    maxAttendees: ''
  });

  useEffect(() => {
    // Fetch location details from the new endpoint
    fetch('/api/locations')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched locations:', data);
        setLocations(data);
      })
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    // Find the selected location object using its value
    const selectedLocation = locations.find(loc => loc.value === formData.location);
    // Build a new event object
    const newEvent = {
      id: Date.now(),
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: selectedLocation ? selectedLocation.label : formData.location,
      description: formData.description,
      image: formData.image,
      maxAttendees: formData.maxAttendees,
      attendees: 0,
      peopleCount: selectedLocation ? selectedLocation.peopleCount : 0,
      busyness: selectedLocation ? selectedLocation.busyness : 'Unknown'
    };

    // In a real app, you'd send newEvent to the backend to be saved.
    // Here we navigate to the event list page, passing newEvent via router state.
    navigate('/', { state: { newEvent } });
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Date</span>
                </div>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Time</span>
                </div>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
          {/* Location Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Location</span>
              </div>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select a location</option>
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>
          {/* Maximum Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Maximum Attendees</span>
              </div>
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {/* Event Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span>Event Image URL</span>
              </div>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                <span>Description</span>
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>
        {/* Submit Button */}
        <button type="submit" className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;

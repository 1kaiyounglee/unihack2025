import React from 'react';
import { Settings, MapPin, Calendar, Users } from 'lucide-react';
const ProfilePage = () => {
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    username: '@alexj',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'Always looking for the next exciting event! 🎉',
    location: 'San Francisco, CA',
    stats: {
      eventsCreated: 12,
      eventsAttended: 48,
      followers: 892,
      following: 436
    },
    upcomingEvents: [{
      id: 1,
      name: 'Tech Meetup 2024',
      date: 'Mar 15',
      attendees: 45
    }, {
      id: 2,
      name: 'Summer Music Festival',
      date: 'Mar 20',
      attendees: 120
    }]
  };
  return <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.username}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* Bio & Location */}
      <div className="mb-6">
        <p className="text-gray-700 mb-2">{user.bio}</p>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{user.location}</span>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {user.stats.eventsCreated}
          </div>
          <div className="text-sm text-gray-600">Created</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {user.stats.eventsAttended}
          </div>
          <div className="text-sm text-gray-600">Attended</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {user.stats.followers}
          </div>
          <div className="text-sm text-gray-600">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {user.stats.following}
          </div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
      </div>
      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Events
        </h2>
        <div className="space-y-4">
          {user.upcomingEvents.map(event => <div key={event.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{event.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{event.date}</span>
                    <div className="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default ProfilePage;
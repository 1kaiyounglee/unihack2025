import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, PlusCircle, User } from 'lucide-react';
const NavigationBar = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-purple-600' : 'text-gray-500';
  };
  return <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center">
          <Home className={`h-6 w-6 ${isActive('/')}`} />
          <span className={`text-xs mt-1 ${isActive('/')}`}>Home</span>
        </Link>
        <Link to="/map" className="flex flex-col items-center">
          <Map className={`h-6 w-6 ${isActive('/map')}`} />
          <span className={`text-xs mt-1 ${isActive('/map')}`}>Map</span>
        </Link>
        <Link to="/create-event" className="flex flex-col items-center">
          <PlusCircle className={`h-6 w-6 ${isActive('/create-event')}`} />
          <span className={`text-xs mt-1 ${isActive('/create-event')}`}>
            Create
          </span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center">
          <User className={`h-6 w-6 ${isActive('/profile')}`} />
          <span className={`text-xs mt-1 ${isActive('/profile')}`}>
            Profile
          </span>
        </Link>
      </div>
    </nav>;
};
export default NavigationBar;
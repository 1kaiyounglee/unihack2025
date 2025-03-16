import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, SearchIcon, BellIcon, UserIcon } from 'lucide-react';
const Header = () => {
  return <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Zap className="h-7 w-7 text-purple-600" />
          <span className="font-bold text-2xl text-gray-900">FOMO</span>
        </Link>
        <div className="relative w-1/3">
          <input type="text" placeholder="Search events & places..." className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500" />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="h-5 w-5 text-gray-600" />
          </button>
          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100">
            <UserIcon className="h-5 w-5 text-gray-600" />
          </Link>
        </div>
      </div>
    </header>;
};
export default Header;
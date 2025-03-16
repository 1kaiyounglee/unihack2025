import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MapPage from './components/MapPage';
import LocationPage from './components/LocationPage';
import CreateEventPage from './components/CreateEventPage';
import ProfilePage from './components/ProfilePage';
import FullMapPage from './components/FullMapPage';
import Header from './components/common/Header';
import NavigationBar from './components/common/NavigationBar';
export function App() {
  return <BrowserRouter>
      <div className="flex flex-col w-full min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 w-full mb-16">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/location/:id" element={<LocationPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/map" element={<FullMapPage />} />
          </Routes>
        </main>
        <NavigationBar />
      </div>
    </BrowserRouter>;
}
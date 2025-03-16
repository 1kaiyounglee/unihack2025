import 'leaflet/dist/leaflet.css';
import './index.css';
import React from "react";
import { render } from "react-dom";
import { App } from "./App";

import { createRoot } from 'react-dom/client';


// Find the root element in your HTML
const rootElement = document.getElementById('root');

// Create a root and render your App
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
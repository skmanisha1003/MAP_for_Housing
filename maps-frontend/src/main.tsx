import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Create custom red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="#dc2626"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
      <circle cx="12.5" cy="12.5" r="5" fill="#dc2626"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="41" height="41" viewBox="0 0 41 41" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20.5" cy="38.5" rx="20" ry="2" fill="rgba(0,0,0,0.2)"/>
    </svg>
  `),
  shadowSize: [41, 41],
  shadowAnchor: [20, 38]
});

// Set as default icon
L.Marker.prototype.options.icon = redMarkerIcon;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


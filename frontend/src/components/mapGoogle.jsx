import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = () => (
  <div style={{ fontSize: '2rem', color: 'red' }}>
    📍
  </div>
);

const UserLocationMap = ({ zoom = 13 }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Erreur de géolocalisation :", error);
        setLocation({ lat: 48.8566, lng: 2.3522 });
      }
    );
  }, []);

  if (!location) {
    return <p>Chargement de la carte...</p>;
  }

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP }}
        defaultCenter={location}
        defaultZoom={zoom}
      >
        <Marker lat={location.lat} lng={location.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default UserLocationMap;

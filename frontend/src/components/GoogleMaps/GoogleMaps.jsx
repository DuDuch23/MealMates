import React, { useState, useEffect , useRef} from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// const OfferMarker = ({ offer }) => (
//     <div style={{ cursor: 'pointer' }} title={offer.product}>
//       📦
//     </div>
// );

const UserLocationMap = ({ offers = [], zoom = 13 }) => {
    const [location, setLocation] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const loc = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                };
                setLocation(loc);
            },
            (error) => {
                console.warn("Erreur de géolocalisation :", error);
                const fallback = { lat: 48.8566, lng: 2.3522 };
                console.log("Fallback position utilisée :", fallback);
                setLocation(fallback);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            }
        );
    
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    if (!location) {
        return <p>Chargement de la carte...</p>;
    }

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1000 }}>
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP}>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={location}
                    zoom={zoom}
                    onLoad={onLoad}
                >
                    {map && (
                        <Marker
                        position={location}
                        map={map}
                        title="Votre position"
                        />
                    )}
                    {offers.map((offer) => (
                    <Marker
                        key={offer.id}
                        position={{ lat: offer.latitude, lng: offer.longitude }}
                        map={map}
                        title={offer.name}
                        label="📦"
                    />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default UserLocationMap;

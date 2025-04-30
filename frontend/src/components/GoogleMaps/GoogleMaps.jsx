import React, { useState, useEffect , useRef} from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer, InfoWindow  } from '@react-google-maps/api';
import FilterMap from '../FilterMap/FilterMap';

const containerStyle = {
    width: '100%',
    height: '100%'
};


const UserLocationMap = ({ offers = [], zoom = 13 }) => {
    const [userPos, setUserPos] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => 
                setUserPos({ lat: position.coords.latitude, lng: position.coords.longitude }),
            (error) => {
                console.warn("Erreur de géolocalisation :", error);
                const fallback = { lat: 48.8566, lng: 2.3522 };
                console.log("Fallback position utilisée :", fallback);
                setUserPos(fallback);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                // timeout: 5000
            }
        );
    
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // clusterer pour les markers (regroupement de markers proches)

    const renderMarkers = (clusterer) =>
        offers.map((offer) => (
            <Marker
                key={offer.id}
                position={{ lat: Number(offer.latitude), lng: Number(offer.longitude) }}
                title={offer.title}
                label="📦"
                clusterer={clusterer}
                onClick={() => handleMarkerClick(offer)}
            />
        )
    );

    const [selectedOffer, setSelectedOffer] = useState(null);

    const handleMarkerClick = (offer) => {
        setSelectedOffer(offer);
    };

    // useEffect(() => {
    //     if (map && offers.length > 0) {
    //         const markers = offers.map((offer) => new window.google.maps.Marker({
    //             position: { lat: Number(offer.latitude), lng: Number(offer.longitude) },
    //             title: offer.title,
    //             label: "📦"
    //         }));
    
    //         new MarkerClusterer({ markers, map });
    //     }
    // }, [map, offers]);

    if (!userPos) {
        return <p>Chargement de la carte...</p>;
    }

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    return (
        <>
            <LoadScript className="map" googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP}>
                <GoogleMap className="map"
                    mapContainerStyle={containerStyle}
                    center={userPos}
                    zoom={zoom}
                    onLoad={onLoad}
                    >
                    {map && (
                        <Marker
                        position={userPos}
                        map={map}
                        title="Votre position"
                        />
                    )}
                    <MarkerClusterer>
                        {(clusterer) => renderMarkers(clusterer)}
                    </MarkerClusterer>
                    {selectedOffer && (
                        <InfoWindow
                            position={{ lat: Number(selectedOffer.latitude), lng: Number(selectedOffer.longitude) }}
                            onCloseClick={() => setSelectedOffer(null)}
                        >
                            <div>
                                <h3>{selectedOffer.product}</h3>
                                <p>{selectedOffer.description}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>
        </>
    );
};

export default UserLocationMap;

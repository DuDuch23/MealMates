import React, { useState, useEffect , useRef} from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer, InfoWindow  } from '@react-google-maps/api';
import FilterMap from '../FilterMap/FilterMap';
import styles from './GoogleMaps.module.css';

const containerStyle = {
    width: '100%',
    height: '100%'
};


const UserLocationMap = ({ offers = [], zoom = 13, userPos }) => {
    const [map, setMap] = useState(null);
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

    if (!userPos) {
        console.log("Position de l'utilisateur non disponible, affichage d'une position par défaut.");
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
                            <div className={styles['info-window']}>
                            <p>{new Date(selectedOffer.createdAt).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                                <h2>{selectedOffer.product}</h2>
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

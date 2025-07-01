import React, { useState, useEffect } from 'react';
import {
    GoogleMap,
    Marker,
    LoadScript,
    InfoWindow,
    Circle
} from '@react-google-maps/api';
import { geocodeLocation } from "../../service/requestApi";
import styles from './GoogleMaps.module.css';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const OffersMap = ({ offers = [], zoom = 13, userPos, setUserPos }) => {
    const [map, setMap] = useState(null);
    const [address, setAddress] = useState("");
    const [initialCenter, setInitialCenter] = useState(null);
    const [radius, setRadius] = useState(5); 
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    useEffect(() => {
        if (userPos) {
            setInitialCenter(userPos);
        }
    }, [userPos]);

    useEffect(() => {
        if (userPos && offers.length > 0) {
            const filtered = offers.filter((offer) => {
                const distance = getDistanceFromLatLonInKm(
                    userPos.lat, userPos.lng,
                    offer.latitude, offer.longitude
                );
                return distance <= radius;
            });
            setFilteredOffers(filtered);
        }
    }, [userPos, radius, offers]);

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const location = await geocodeLocation(address);
        if (location && location.lat && location.lng) {
            const newUserPos = { lat: location.lat, lng: location.lng };
            setUserPos(newUserPos);
            map && map.panTo(newUserPos);
        } else {
            console.error("Adresse non trouvée");
        }
    };

    const renderMarkers = () =>
        (filteredOffers.length > 0 ? filteredOffers : offers)
            .filter((offer) => offer.latitude && offer.longitude)
            .map((offer) => (
                <Marker
                    key={offer.id}
                    position={{ lat: Number(offer.latitude), lng: Number(offer.longitude) }}
                    title={offer.title}
                    label="📦"
                    onClick={() => setSelectedOffer(offer)}
                />
            ));

    if (!userPos) {
        return <p>Chargement de la carte...</p>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP}>
            <div className={styles.mapContainer}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Entrez une adresse"
                    />
                    <button type="submit">Rechercher</button>
                    <div className={styles.radiusInput}>
                        <label>Rayon (km) :</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                        />
                    </div>
                </form>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={initialCenter}
                zoom={zoom}
                onLoad={onLoad}
            >
                <Marker
                    position={userPos}
                    title="Votre position"
                />
                <Circle
                    center={userPos}
                    radius={radius * 1000}
                    options={{
                        strokeColor: '#3B82F6',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#3B82F6',
                        fillOpacity: 0.2,
                    }}
                />
                {renderMarkers()}
                {selectedOffer && (
                    <InfoWindow
                        position={{
                            lat: Number(selectedOffer.latitude),
                            lng: Number(selectedOffer.longitude)
                        }}
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
    );
};

export default OffersMap;

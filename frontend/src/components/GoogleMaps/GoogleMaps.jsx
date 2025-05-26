import React, { useState, useEffect , useRef} from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer, InfoWindow  } from '@react-google-maps/api';
import FilterMap from '../FilterMap/FilterMap';
import styles from './GoogleMaps.module.css';
import { geocodeLocation } from '../../service/requestApi';

const containerStyle = {
    width: '100%',
    height: '100%'
};


const UserLocationMap = ({ offers = [], zoom = 13, userPos, setUserPos }) => {
    const [map, setMap] = useState(null);
    const [address, setAddress] = useState("");
    const [initialCenter, setInitialCenter] = useState(null);
    const [radius, setRadius] = useState(5); // rayon en km
    const [filteredOffers, setFilteredOffers] = useState([]);
    // clusterer pour les markers (regroupement de markers proches)

    const renderMarkers = (clusterer) =>
        (filteredOffers.length > 0 ? filteredOffers : offers)
            .filter((offer) => offer.latitude && offer.longitude)
            .map((offer) => (
            <Marker
                key={offer.id}
                position={{ lat: Number(offer.latitude), lng: Number(offer.longitude) }}
                title={offer.title}
                label="📦"
                clusterer={clusterer}
                onClick={() => handleMarkerClick(offer)}
            />
    ));

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

    useEffect(() => {
        if (userPos) {
            setInitialCenter(userPos); // Définit le centre initial au chargement
        }
    }, [userPos]);

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
    }

    const handleSearch = async (e) => {
        e.preventDefault();
    
        const location = await geocodeLocation(address);
        console.log("résultat de recherche de geocoding: ", location);
    
        if (location && location.lat && location.lng) {
            setUserPos({ lat: location.lat, lng: location.lng });
    
            const filtered = offers.filter((offer) => {
                const distance = getDistanceFromLatLonInKm(
                    location.lat, location.lng,
                    offer.latitude, offer.longitude
                );
                return distance <= radius;
            });
    
            setFilteredOffers(filtered);
    
            if (map) {
                map.panTo({ lat: location.lat, lng: location.lng }); // Pan la carte manuellement
            }
        } else {
            console.error("Adresse non trouvée");
        }
    };

    return (
        <>
            <LoadScript className="map" googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP}>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Entrez une adresse"
                    />
                    <button type="submit">Rechercher</button>
                </form>
                <GoogleMap className="map"
                    mapContainerStyle={containerStyle}
                    center={initialCenter}
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
                        position={{
                            lat: Number(selectedOffer.latitude),
                            lng: Number(selectedOffer.longitude)
                        }}
                        onCloseClick={() => setSelectedOffer(null)}>
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

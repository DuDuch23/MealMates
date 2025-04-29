import React, { useState, useEffect } from 'react';
import UserLocationMap from '../GoogleMaps/GoogleMaps';
import { geocodeLocation, fetchFilteredOffers } from '../../service/requestApi';

const FilterMap = () => {
    const [offers, setOffers] = useState([]);
    const [villeOuCP, setVilleOuCP] = useState('');
    const [filters, setFilters] = useState({});
    const [mapInstance, setMapInstance] = useState(null);

    const handleSearch = async () => {
        const coords = await geocodeLocation(villeOuCP);
        if (coords && mapInstance) {
            mapInstance.panTo(coords);
            mapInstance.setZoom(13);
        }

        const results = await fetchFilteredOffers({ ...filters, location: villeOuCP });
        setOffers(results.data || []);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 flex gap-2 bg-white z-10">
                <input
                    type="text"
                    placeholder="Ville ou Code Postal"
                    value={villeOuCP}
                    onChange={(e) => setVilleOuCP(e.target.value)}
                    className="p-2 border rounded"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Rechercher
                </button>
            </div>

            <div className="flex-grow">
                <UserLocationMap
                    offers={offers}
                    onMapLoad={setMapInstance}
                />
            </div>
        </div>
    );
};

export default FilterMap;

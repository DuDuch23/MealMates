import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

export default function FilterMap({ onFilterChange, categories }) {
  const [filters, setFilters] = useState({
    type: '',
    expiryBefore: '',
    priceRange: [0, 50],
    distance: 5, // km
    selectedCategories: [],
    minRating: 0,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters); // callback vers la carte ou les offres
  };

  return (
    <div className="">
      <div>
        <label>Type de produit</label>
        <select onChange={e => handleFilterChange('type', e.target.value)} value={filters.type}>
          <option value="">Tous</option>
          <option value="fruits">Fruits</option>
          <option value="légumes">Légumes</option>
          <option value="plats préparés">Plats préparés</option>
        </select>
      </div>

      <div>
        <label>Date de péremption avant :</label>
        <input
          type="date"
          value={filters.expiryBefore}
          onChange={e => handleFilterChange('expiryBefore', e.target.value)}
        />
      </div>

      <div>
        <label>Prix (min-max) : {filters.priceRange[0]}€ - {filters.priceRange[1]}€</label>
        <Slider
          value={filters.priceRange}
          min={0}
          max={100}
          onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
          valueLabelDisplay="auto"
        />
      </div>

      <div>
        <label>Distance max : {filters.distance} km</label>
        <Slider
          value={filters.distance}
          min={1}
          max={100}
          onChange={(e, newValue) => handleFilterChange('distance', newValue)}
          valueLabelDisplay="auto"
        />
      </div>

      <div>
        <label>Régimes alimentaires</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={filters.selectedCategories.includes(category.id)}
                  onChange={() => {
                    const selected = filters.selectedCategories.includes(category.id)
                      ? filters.selectedCategories.filter(id => id !== category.id)
                      : [...filters.selectedCategories, category.id];
                    handleFilterChange('selectedCategories', selected);
                  }}
                />
              }
              label={category.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label>Note vendeur minimale : {filters.minRating}⭐</label>
        <Slider
          value={filters.minRating}
          min={0}
          max={5}
          step={0.5}
          onChange={(e, value) => handleFilterChange('minRating', value)}
          valueLabelDisplay="auto"
        />
      </div>

      {/* À ajouter plus tard */}
      {/* <button onClick={handleSaveSearch}>Sauvegarder la recherche</button> */}
    </div>
  );
}

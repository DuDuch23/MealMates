import React, { useState } from "react";
import styles from "./AdvanceFilters.module.css";
import AllCategory from "../AllCategory/AllCategory";

function AdvanceFilters({ filters = {}, setFilters }) {
  const [visible, setVisible] = useState(false);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, price: { ...filters.price, [name]: value } });
  };

  const handleRatingChange = (e) => {
    setFilters({ ...filters, minRating: Number(e.target.value) });
  };

  const handleDistanceChange = (e) => {
    setFilters({ ...filters, maxDistance: Number(e.target.value) });
  };

  return (
    <>
      {/* Bouton toggle visible seulement sur mobile */}
      <button
        className={styles["toggle-button"]}
        onClick={() => setVisible(!visible)}
        aria-expanded={visible}
        aria-controls="advanced-filters-form"
      >
        {visible ? "Cacher les filtres avancés" : "Afficher les filtres avancés"}
      </button>

      <form
        id="advanced-filters-form"
        className={`${styles["advanced-filters"]} ${visible ? styles.visible : ""}`}
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset>
          <legend>Catégories :</legend>
          <AllCategory
            value={filters.types || []}
            onChange={(newTypes) => setFilters({ ...filters, types: newTypes })}
          />
        </fieldset>

        <fieldset>
          <legend>Prix :</legend>
          <label>
            Prix min :
            <input
              type="number"
              name="min"
              value={filters.price?.min || ""}
              onChange={handlePriceChange}
              placeholder="Min"
              min="0"
            />
          </label>
          <label>
            Prix max :
            <input
              type="number"
              name="max"
              value={filters.price?.max || ""}
              onChange={handlePriceChange}
              placeholder="Max"
              min="0"
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Note minimale :</legend>
          <select value={filters.minRating || 0} onChange={handleRatingChange}>
            <option value={0}>Toutes</option>
            <option value={3}>3⭐ et plus</option>
            <option value={4}>4⭐ et plus</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Distance max (km) :</legend>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.maxDistance || 10}
            onChange={handleDistanceChange}
          />
          <span>{filters.maxDistance || 10} km</span>
        </fieldset>
      </form>
    </>
  );
}

export default AdvanceFilters;

import React from "react"
import styles from "./AdvanceFilters.module.css"; // Utilisation correcte du SCSS module

function AdvanceFilters({ filters, setFilters }) {
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newTypes = filters.types || [];

    if (checked) {
      newTypes = [...newTypes, value];
    } else {
      newTypes = newTypes.filter((type) => type !== value);
    }
    setFilters({ ...filters, types: newTypes });
  };

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
    <form className={styles["advanced-filters"]} onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Type de produit :</legend>
        <label>
          <input
            type="checkbox"
            value="fruits"
            checked={filters.types?.includes("fruits") || false}
            onChange={handleCheckboxChange}
          />
          Fruits
        </label>
        <label>
          <input
            type="checkbox"
            value="légumes"
            checked={filters.types?.includes("légumes") || false}
            onChange={handleCheckboxChange}
          />
          Légumes
        </label>
      </fieldset>

      <fieldset>
        <legend>Prix :</legend>
        <label>
          Min :
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
          Max :
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
  );
}

export default AdvanceFilters;

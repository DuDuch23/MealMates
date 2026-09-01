import { useState } from "react"
import CategorySelect from "./CategorySelect"

/** Filtres avancés des offres : catégories, prix, note et distance. */
export default function AdvancedFilters({ filters, setFilters }) {
  const [isVisible, setIsVisible] = useState(false)

  const handlePriceChange = (event) => {
    const { name, value } = event.target
    setFilters({
      ...filters,
      price: {
        ...filters.price,
        [name]: value,
      },
    })
  }

  const fieldsetClass = "flex flex-1 flex-col gap-3 md:basis-52"
  const legendClass = "mb-2 font-semibold text-primary"

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-expanded={isVisible}
        aria-controls="advanced-filters-form"
        className="mb-4 w-full cursor-pointer rounded-lg bg-primary-dark py-2.5 font-semibold text-white md:hidden"
      >
        {isVisible ? "Cacher les filtres" : "Afficher les filtres"}
      </button>

      <form
        id="advanced-filters-form"
        onSubmit={(event) => event.preventDefault()}
        className={`${isVisible ? "flex" : "hidden"} flex-col gap-6 md:flex md:flex-row md:flex-wrap md:gap-8`}
      >
        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Catégories :</legend>
          <CategorySelect
            value={filters.types || []}
            onChange={(nextTypes) => {
              setFilters({
                ...filters,
                types: nextTypes,
              })
            }}
          />
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Prix :</legend>
          <label className="flex items-center gap-2 text-sm text-gray-200">
            Prix min :
            <input
              type="number"
              name="min"
              min="0"
              placeholder="Min"
              value={filters.price?.min || ""}
              onChange={handlePriceChange}
              className="w-24 rounded-md border border-gray-500 bg-surface-sunken px-2 py-1.5 text-white focus:border-primary focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-200">
            Prix max :
            <input
              type="number"
              name="max"
              min="0"
              placeholder="Max"
              value={filters.price?.max || ""}
              onChange={handlePriceChange}
              className="w-24 rounded-md border border-gray-500 bg-surface-sunken px-2 py-1.5 text-white focus:border-primary focus:outline-none"
            />
          </label>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Note minimale :</legend>
          <select
            value={filters.minRating || 0}
            onChange={(event) => {
              setFilters({
                ...filters,
                minRating: Number(event.target.value),
              })
            }}
            className="rounded-md border border-gray-500 bg-surface-sunken px-2 py-1.5 text-white focus:border-primary focus:outline-none"
          >
            <option value={0}>Toutes</option>
            <option value={3}>3⭐ et plus</option>
            <option value={4}>4⭐ et plus</option>
          </select>
        </fieldset>

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Distance max (km) :</legend>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.maxDistance || 10}
            onChange={(event) => {
              setFilters({
                ...filters,
                maxDistance: Number(event.target.value),
              })
            }}
            className="w-full accent-primary"
          />
          <span className="text-sm text-gray-300">{filters.maxDistance || 10} km</span>
        </fieldset>
      </form>
    </div>
  )
}

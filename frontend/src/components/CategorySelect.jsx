import { useEffect, useState } from "react"
import { getCategories } from "../services/offerApi"

/** Menu déroulant de sélection multiple des catégories d'offres. */
export default function CategorySelect({ value = [], onChange }) {
  const [categories, setCategories] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        setCategories(response?.data || [])
      } catch (error) {
        console.error("Impossible de récupérer les catégories :", error)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (categoryId) => {
    const nextValue = value.includes(categoryId)
      ? value.filter((id) => id !== categoryId)
      : [...value, categoryId]
    onChange(nextValue)
  }

  const buttonLabel =
    value.length > 0
      ? `${value.length} catégorie${value.length > 1 ? "s" : ""} sélectionnée${value.length > 1 ? "s" : ""}`
      : "Choisir des catégories"

  return (
    <div className={`relative w-full max-w-80 ${isOpen ? "z-30" : "z-10"}`}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-primary bg-primary-dark px-4 py-2.5 font-semibold text-white transition-colors hover:bg-primary hover:text-black"
      >
        {buttonLabel}
        <span aria-hidden="true" className="ml-2 text-sm">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute top-full left-0 z-30 mt-1.5 max-h-60 w-full overflow-y-auto rounded-lg border border-primary bg-surface-sunken p-3 shadow-xl"
        >
          {categories.map((category) => (
            <li key={category.id} className="mb-2 last:mb-0">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-200">
                <input
                  type="checkbox"
                  checked={value.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="size-4 accent-primary"
                />
                {category.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

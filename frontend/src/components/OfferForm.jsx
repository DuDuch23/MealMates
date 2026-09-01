import { useRef, useState } from "react"
import CategorySelect from "./CategorySelect"
import { geocodeLocation } from "../services/geocodingApi"

const defaultValues = {
  product: "",
  description: "",
  quantity: 1,
  expirationDate: "",
  option: "prix",
  price: "",
  isDonation: false,
  pickupLocation: "",
  isRecurring: false,
  latitude: null,
  longitude: null,
  categories: [],
  availableSlots: "",
}

const inputClass =
  "rounded-lg border border-gray-600 bg-surface-sunken px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
const labelClass = "font-semibold text-gray-200"

/**
 * Formulaire de création / édition d'offre.
 * `initialImages` contient les images déjà en ligne (mode édition) ;
 * seules les nouvelles photos sont envoyées au backend.
 */
export default function OfferForm({ initialValues = {}, initialImages = [], submitLabel, onSubmit }) {
  const [formData, setFormData] = useState({
    ...defaultValues,
    ...initialValues,
  })
  const [existingImages, setExistingImages] = useState(initialImages)
  const [newImages, setNewImages] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const setField = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.product) {
      nextErrors.product = "Titre requis"
    }
    if (!formData.description) {
      nextErrors.description = "Description requise"
    }
    if (!formData.expirationDate) {
      nextErrors.expirationDate = "Date limite requise"
    }
    if (!formData.quantity || isNaN(formData.quantity)) {
      nextErrors.quantity = "Quantité invalide"
    }
    if (formData.option === "prix" && (!formData.price || isNaN(formData.price))) {
      nextErrors.price = "Prix requis"
    }
    if (!formData.pickupLocation) {
      nextErrors.pickupLocation = "Adresse requise"
    } else if (!formData.latitude || !formData.longitude) {
      nextErrors.pickupLocation = "Adresse introuvable"
    }
    if (formData.categories.length === 0) {
      nextErrors.categories = "Sélectionner au moins une catégorie"
    }
    if (!formData.availableSlots) {
      nextErrors.availableSlots = "Ajouter au moins un créneau"
    }
    if (existingImages.length + newImages.length === 0) {
      nextErrors.images = "Ajoutez au moins une image"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "categories") {
        value.forEach((categoryId) => data.append("categories[]", categoryId))
      } else {
        data.append(key, value)
      }
    })
    newImages.forEach((image) => data.append("photos_offer[]", image.file))

    setSubmitting(true)
    try {
      await onSubmit(data)
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    const addedImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setNewImages((previous) => [...previous, ...addedImages])
  }

  const removeExistingImage = (index) => {
    setExistingImages((previous) => previous.filter((_, i) => i !== index))
  }

  const removeNewImage = (index) => {
    setNewImages((previous) => {
      URL.revokeObjectURL(previous[index].previewUrl)
      return previous.filter((_, i) => i !== index)
    })
  }

  const handleOptionChange = (event) => {
    const option = event.target.value
    setFormData((previous) => ({
      ...previous,
      option,
      isDonation: option === "don",
      price: option === "don" ? "0" : "",
    }))
  }

  // Géocodage au blur (et non à chaque frappe) pour épargner l'API Google
  const handleAddressBlur = async () => {
    if (!formData.pickupLocation) {
      return
    }

    try {
      const coords = await geocodeLocation(formData.pickupLocation)
      setFormData((previous) => ({
        ...previous,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      }))
    } catch {
      setFormData((previous) => ({
        ...previous,
        latitude: null,
        longitude: null,
      }))
    }
  }

  const renderError = (message) => {
    if (!message) {
      return null
    }
    return <p className="text-sm text-red-400">{message}</p>
  }

  const renderImagePreview = (src, onRemove, key) => {
    return (
      <div key={key} className="relative h-28 w-28 overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={onRemove}
          aria-label="Supprimer l'image"
          className="absolute top-1 right-1 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 font-bold text-white"
        >
          x
        </button>
        <img src={src} alt="Aperçu" className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <aside className="lg:w-2/5">
        <div className="rounded-2xl border border-dashed border-gray-500 bg-surface-sunken p-4 text-center">
          <input
            ref={fileInputRef}
            name="photos_offer[]"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex w-full cursor-pointer flex-col items-center gap-2 py-4 text-gray-400 transition-colors hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </svg>
            Ajouter des photos
          </button>

          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {existingImages.map((imageUrl, index) =>
                renderImagePreview(imageUrl, () => removeExistingImage(index), `existing-${index}`)
              )}
              {newImages.map((image, index) =>
                renderImagePreview(image.previewUrl, () => removeNewImage(index), `new-${index}`)
              )}
            </div>
          )}

          {renderError(errors.images)}
        </div>
      </aside>

      <div className="flex flex-col gap-6 lg:w-3/5">
        <div className="flex flex-col gap-2">
          <label htmlFor="product" className={labelClass}>
            Produit
          </label>
          <input
            id="product"
            type="text"
            name="product"
            value={formData.product}
            onChange={(event) => setField("product", event.target.value)}
            className={inputClass}
          />
          {renderError(errors.product)}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={(event) => setField("description", event.target.value)}
            className={`${inputClass} resize-none`}
          />
          {renderError(errors.description)}
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex flex-col gap-2 md:w-2/3">
            <label htmlFor="expirationDate" className={labelClass}>
              Date limite de consommation
            </label>
            <input
              id="expirationDate"
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={(event) => setField("expirationDate", event.target.value)}
              className={inputClass}
            />
            {renderError(errors.expirationDate)}
          </div>

          <div className="flex flex-col gap-2 md:w-1/3">
            <label htmlFor="quantity" className={labelClass}>
              Quantité
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              name="quantity"
              value={formData.quantity}
              onChange={(event) => setField("quantity", event.target.value)}
              className={inputClass}
            />
            {renderError(errors.quantity)}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pickupLocation" className={labelClass}>
            Localisation
          </label>
          <input
            id="pickupLocation"
            type="text"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={(event) => setField("pickupLocation", event.target.value)}
            onBlur={handleAddressBlur}
            className={inputClass}
          />
          {renderError(errors.pickupLocation)}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className={labelClass}>Type d'offre</legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-200">
              <input
                type="radio"
                name="offerType"
                value="prix"
                checked={formData.option === "prix"}
                onChange={handleOptionChange}
                className="accent-primary"
              />
              Prix
            </label>
            <label className="flex items-center gap-2 text-gray-200">
              <input
                type="radio"
                name="offerType"
                value="don"
                checked={formData.option === "don"}
                onChange={handleOptionChange}
                className="accent-primary"
              />
              Don
            </label>
          </div>

          {formData.option === "prix" && (
            <>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Montant en €"
                value={formData.price}
                onChange={(event) => setField("price", event.target.value)}
                className={inputClass}
              />
              {renderError(errors.price)}
            </>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <span className={labelClass}>Catégorie(s)</span>
          <CategorySelect
            value={formData.categories}
            onChange={(categories) => setField("categories", categories)}
          />
          {renderError(errors.categories)}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="availableSlots" className={labelClass}>
            Créneau de retrait
          </label>
          <input
            id="availableSlots"
            type="text"
            name="availableSlots"
            value={formData.availableSlots}
            onChange={(event) => setField("availableSlots", event.target.value)}
            className={inputClass}
          />
          {renderError(errors.availableSlots)}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="cursor-pointer self-start rounded-xl bg-primary-dark px-8 py-3 font-semibold text-white transition-colors hover:bg-primary hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? `${submitLabel}…` : submitLabel}
        </button>
      </div>
    </form>
  )
}

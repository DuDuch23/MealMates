import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import OfferForm from "../components/OfferForm"
import { getOffer, updateOffer } from "../services/offerApi"
import { API_BASE_URL } from "../services/apiClient"

export default function ModifyOffer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState(null)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await getOffer(id)
        if (response?.data) {
          setOffer(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'offre :", error)
      }
    }

    fetchOffer()
  }, [id])

  const handleSubmit = async (formData) => {
    setSubmitError(null)

    try {
      const response = await updateOffer(id, formData)
      if (response.ok) {
        navigate(`/offer/${id}`)
      } else {
        console.error("Échec de la modification :", response.body)
        setSubmitError("La modification a échoué. Vérifiez les champs et réessayez.")
      }
    } catch (error) {
      console.error("Erreur lors de la modification de l'offre :", error)
      setSubmitError("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-full bg-surface-sunken px-4 py-8">
      <div className="mx-auto max-w-[1200px] rounded-3xl bg-surface-raised p-6 md:p-8">
        <Link
          to={`/offer/${id}`}
          className="mb-6 inline-block text-primary transition-colors hover:underline"
        >
          ← Retour à l'offre
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-white">Modifier l'offre</h1>

        {submitError && (
          <p className="mb-6 rounded bg-red-950 px-3 py-2 text-sm text-red-400">{submitError}</p>
        )}

        {offer === null ? (
          <p className="text-gray-300">Chargement de l'offre...</p>
        ) : (
          <OfferForm
            submitLabel="Enregistrer les modifications"
            onSubmit={handleSubmit}
            initialImages={(offer.images || []).map((image) => `${API_BASE_URL}${image.url}`)}
            initialValues={{
              product: offer.product,
              description: offer.description,
              expirationDate: offer.expirationDate ? offer.expirationDate.split("T")[0] : "",
              quantity: offer.quantity,
              price: offer.price || 0,
              pickupLocation: offer.pickupLocation,
              latitude: offer.latitude,
              longitude: offer.longitude,
              categories: (offer.categories || []).map((category) => category.id),
              availableSlots: offer.availableSlots || "",
              option: offer.isDonation ? "don" : "prix",
              isDonation: Boolean(offer.isDonation),
            }}
          />
        )}
      </div>
    </div>
  )
}

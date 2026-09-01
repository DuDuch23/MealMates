import { useState } from "react"
import { Link, useNavigate } from "react-router"
import OfferForm from "../components/OfferForm"
import { createOffer } from "../services/offerApi"

export default function AddOffer() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState(null)

  const handleSubmit = async (formData) => {
    setSubmitError(null)

    try {
      const response = await createOffer(formData)
      if (response.status === 201) {
        navigate("/offer")
      } else {
        console.error("Échec de la création de l'offre :", response.body)
        setSubmitError("La création de l'offre a échoué. Vérifiez les champs et réessayez.")
      }
    } catch (error) {
      console.error("Erreur lors de la soumission de l'offre :", error)
      setSubmitError("Une erreur est survenue. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-full bg-surface-sunken px-4 py-8">
      <div className="mx-auto max-w-[1200px] rounded-3xl bg-surface-raised p-6 md:p-8">
        <Link
          to="/offer"
          className="mb-6 inline-block text-primary transition-colors hover:underline"
        >
          ← Retour aux offres
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-white">Ajouter une offre</h1>

        {submitError && (
          <p className="mb-6 rounded bg-red-950 px-3 py-2 text-sm text-red-400">{submitError}</p>
        )}

        <OfferForm submitLabel="Publier l'offre" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { getOffer, createOrder } from "../services/offerApi"
import { createChat, sendMessage } from "../services/chatApi"
import { getSessionUser } from "../services/authApi"
import { API_BASE_URL } from "../services/apiClient"

export default function SingleOffer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [offer, setOffer] = useState(null)
  const [actionError, setActionError] = useState(null)
  const user = getSessionUser()

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

  const handleReservation = async () => {
    setActionError(null)
    try {
      const response = await createOrder(offer.id)
      setOffer((previous) => ({
        ...previous,
        order: response.order,
      }))
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error)
      setActionError("La réservation a échoué. Veuillez réessayer.")
    }
  }

  const handleContactSeller = async () => {
    setActionError(null)

    if (!user || !offer.seller?.id) {
      setActionError("Impossible de contacter le vendeur.")
      return
    }

    try {
      const response = await createChat({
        clientId: user.id,
        sellerId: offer.seller.id,
        offerId: offer.id,
      })

      await sendMessage({
        userId: user.id,
        chatId: response.chatId,
        message: "Bonjour",
      })

      navigate("/chooseChat")
    } catch (error) {
      console.error("Erreur lors de la création du chat :", error)
      setActionError("L'envoi du message a échoué. Veuillez réessayer.")
    }
  }

  if (!offer) {
    return (
      <div className="flex min-h-full items-start justify-center bg-surface-sunken pt-16">
        <p className="text-gray-300">Chargement...</p>
      </div>
    )
  }

  const isOwner = user !== null && offer.seller.id === user.id

  return (
    <div className="min-h-full bg-surface-sunken px-4 py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 rounded-3xl bg-surface-raised p-6 shadow-lg md:flex-row md:p-8">
        <div className="flex flex-col gap-6 md:w-2/3">
          {offer.images?.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              {offer.images.map((image) => (
                <img
                  key={image.id}
                  src={`${API_BASE_URL}${image.url}`}
                  alt={offer.product}
                  className="max-w-36 rounded-2xl border border-gray-600 object-cover"
                />
              ))}
            </div>
          )}

          <h1 className="text-3xl font-bold text-white md:text-4xl">{offer.product}</h1>

          <dl className="flex flex-col gap-3 text-gray-300">
            <p>
              <strong className="text-gray-400">Description :</strong>{" "}
              {offer.description || "Aucune description."}
            </p>
            <p>
              <strong className="text-gray-400">Prix :</strong>{" "}
              {offer.price ? `${offer.price} €` : "Gratuit"}
            </p>
            <p>
              <strong className="text-gray-400">Quantité :</strong> {offer.quantity}
            </p>
            <p>
              <strong className="text-gray-400">Don :</strong> {offer.isDonation ? "Oui" : "Non"}
            </p>
            <p>
              <strong className="text-gray-400">Récurrent :</strong>{" "}
              {offer.isRecurring ? "Oui" : "Non"}
            </p>
            <p>
              <strong className="text-gray-400">Disponible jusqu'au :</strong>{" "}
              {new Date(offer.expirationDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p>
              <strong className="text-gray-400">Lieu de retrait :</strong> {offer.pickupLocation}
            </p>
            <p>
              <strong className="text-gray-400">Créée le :</strong>{" "}
              {new Date(offer.createdAt).toLocaleString("fr-FR")}
            </p>
          </dl>
        </div>

        <aside className="flex h-fit flex-col gap-4 rounded-xl bg-surface-sunken p-6 shadow-md md:w-1/3">
          <p className="text-xl font-semibold text-white">{offer.seller.firstName}</p>

          {actionError && (
            <p className="rounded bg-red-950 px-3 py-2 text-sm text-red-400">{actionError}</p>
          )}

          {isOwner ? (
            <>
              <p className="text-gray-300">Vous êtes le propriétaire de cette offre</p>
              <Link
                to={`/modifyOffer/${offer.id}`}
                className="rounded-xl bg-primary px-5 py-3 text-center font-semibold text-black transition-colors hover:bg-primary-dark hover:text-white"
              >
                Modifier l'offre
              </Link>
            </>
          ) : (
            <>
              {!offer.order && (
                <button
                  type="button"
                  onClick={handleReservation}
                  className="cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-black transition-colors hover:bg-primary-dark hover:text-white"
                >
                  Réserver cette offre
                </button>
              )}

              {offer.order && !offer.order.isConfirmed && (
                <p className="font-medium text-yellow-400">
                  Réservation en attente de confirmation
                </p>
              )}

              {offer.order && offer.order.isConfirmed && (
                <p className="font-medium text-green-400">Réservation confirmée</p>
              )}

              <button
                type="button"
                onClick={handleContactSeller}
                className="cursor-pointer rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition-colors hover:bg-primary hover:text-black"
              >
                Envoyer un message
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

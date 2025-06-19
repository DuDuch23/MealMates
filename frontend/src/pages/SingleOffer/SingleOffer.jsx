import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { createOrder, getOfferId } from "../../service/requestApi";
import "./SingleOffer.scss";

export default function SingleOffer() {
    const { slug } = useParams();
    const [offer, setOffer] = useState(null);
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL;

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await getOfferId(slug);
                if (data && data.data) {
                    setOffer(data.data);
                } else {
                    console.error("Aucune offre trouvée");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération de l'offre :", err);
            }
        };

        fetchOffer();
    }, [slug]);

    const handleReservation = async () => {
        console.log("Réservation en cours pour l'offre ID :", id);
        try{
            const response = await createOrder(id);
            setOffer(prev => ({
            ...prev,
            order: response.order
        }));
        } catch (error) {
            console.error("Erreur lors de la création de la réservation :", error);
        }
    };

    if (!offer) {
        return <div className="single-offer"><p>Chargement...</p></div>;
    }

    return (
        <div className="single-offer">
            <h1 className="single-offer__title">{offer.product}</h1>

            <div className="single-offer__images">
                {offer.images && offer.images.map((img) => (
                    <img key={img.id} src={`${uploadsBaseUrl}/${img.name}`} alt={img.name} className="single-offer__image" />
                ))}
            </div>

            <div className="single-offer__details">
                <p><strong>Description :</strong> {offer.description || "Aucune description."}</p>
                <p><strong>Prix :</strong> {offer.price ? `${offer.price} €` : "Gratuit"}</p>
                <p><strong>Quantité :</strong> {offer.quantity}</p>
                <p><strong>Don :</strong> {offer.isDonation ? "Oui" : "Non"}</p>
                <p><strong>Récurrent :</strong> {offer.isRecurring ? "Oui" : "Non"}</p>
                <p><strong>Disponible jusqu'au :</strong> {new Date(offer.expirationDate).toLocaleDateString()}</p>
                <p><strong>Lieu de retrait :</strong> {offer.pickupLocation}</p>
                <p><strong>Créée le :</strong> {new Date(offer.createdAt).toLocaleString()}</p>
            </div>


            {!offer.order && (
            <button className="single-offer__reserve-btn" onClick={handleReservation}>
                Réserver cette offre
            </button>
            )}

            {offer.order && !offer.order.isConfirmed && (
            <p className="single-offer__status">
                Réservation en attente de confirmation<br />
                (expire à {new Date(offer.order.expiresAt).toLocaleTimeString()})
            </p>
            )}

            {offer.order && offer.order.isConfirmed && (
            <p className="single-offer__status confirmed">
                Réservation confirmée ✅
            </p>
            )}
        </div>
    );
}
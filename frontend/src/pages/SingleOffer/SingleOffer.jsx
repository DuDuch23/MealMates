import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getOfferId } from "../../service/requestApi";
import "./SingleOffer.scss";

export default function SingleOffer() {
    const { id } = useParams();
    const [offer, setOffer] = useState(null);
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL;

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await getOfferId(id);
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
    }, [id]);

    if (!offer) {
        return <div className="single-offer"><p>Chargement...</p></div>;
    }

    return (
        <div className="single-offer">
            <h1 className="single-offer__title">{offer.product}</h1>

            <div className="single-offer__images">
                {offer.images && offer.images.map((img) => (
                    <img key={img.id} src={`${uploadsBaseUrl}/${img.link}`} alt={img.name} className="single-offer__image" />
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

            <div className="single-offer__seller">
                <h2>Vendeur</h2>
                <p><strong>Nom :</strong> {offer.seller.firstName} {offer.seller.lastName}</p>
                <p><strong>Email :</strong> {offer.seller.email}</p>
                <p><strong>Localisation :</strong> {offer.seller.location}</p>
            </div>
        </div>
    );
}
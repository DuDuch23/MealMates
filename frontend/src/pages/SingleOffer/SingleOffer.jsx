import { useNavigate, useParams } from "react-router";
import { getUserIndexDB } from "../../service/indexDB";
import { useEffect, useState } from "react";
import { createOrder, getOfferSingle, createChat, sendMessage} from "../../service/requestApi";
import style from "./SingleOffer.module.css";

export default function SingleOffer() {

    const { id } = useParams();
    const [user,setUser] = useState([]);
    const [offer, setOffer] = useState(null);
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const data = await getOfferSingle(id);
                console.log("Données de l'offre récupérées :", data.data);
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

    useEffect(() => {
        async function fetchUser() {
          try {
            const userSession = sessionStorage.getItem("user");
            if (userSession) {
              const parsedUser = JSON.parse(userSession);
              console.log(parsedUser);
              const id = parseInt(parsedUser.id, 10);
              const userData = await getUserIndexDB(id);
              setUser(userData);
            }
          } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur :", err);
          }
        }
    
        fetchUser();
    }, [navigate]);

    const handleReservation = async () => {
        console.log("Réservation en cours pour l'offre ID :", id);
        try {
            const response = await createOrder(offer.id);
            setOffer(prev => ({
                ...prev,
                order: response.order
            }));
        } catch (error) {
            console.error("Erreur lors de la création de la réservation :", error);
        }
    };

    const handleInput = async () => {
        const clientId = JSON.parse(sessionStorage.getItem("user")); 

        const sellerId = offer.seller?.id;

        const offerId = offer.id;

        if (!clientId || !sellerId || !offerId) {
            console.error("Paramètres manquants pour créer le chat.");
            return;
        }

        try {
            const response = await createChat({
                client: clientId,
                seller: sellerId,
                offer: offerId
            });

            console.log("Chat créé avec succès :", response);

            const chatId = response.chatId;

            const content = "Bonjour";

            const request = await sendMessage({userId : clientId.id ,chat : chatId,message : content});

            navigate(`/chooseChat`);
        } catch (error) {
            console.error("Erreur lors de la création du chat :", error);
        }
    };

    if (!offer) {
        return <div className={style["single-offer"]}><p>Chargement...</p></div>;
    }

    return (
        <div className={style.single_offer}>
            <div className={style.single_offer__container}>
                <div className={style.single_offer__content}>
                    <div className={style.single_offer__images}>
                        {offer.images && offer.images.map((img) => (
                            <img key={img.id} src={`${uploadsBaseUrl}/${img.name}`} alt={img.name} className={style.single_offer__image} />
                        ))}
                    </div>
                    <h1 className={style.single_offer__title}>{offer.product}</h1>
                    <div className={style.single_offer__details}>
                        <p><strong>Description :</strong> {offer.description || "Aucune description."}</p>
                        <p><strong>Prix :</strong> {offer.price ? `${offer.price} €` : "Gratuit"}</p>
                        <p><strong>Quantité :</strong> {offer.quantity}</p>
                        <p><strong>Don :</strong> {offer.isDonation ? "Oui" : "Non"}</p>
                        <p><strong>Récurrent :</strong> {offer.isRecurring ? "Oui" : "Non"}</p>
                        <p><strong>Disponible jusqu'au :</strong> {new Date(offer.expirationDate).toLocaleDateString()}</p>
                        <p><strong>Lieu de retrait :</strong> {offer.pickupLocation}</p>
                        <p><strong>Créée le :</strong> {new Date(offer.createdAt).toLocaleString()}</p>
                    </div>
                </div>
                <aside className={style.single_offer__sidebar}>
                    {user && offer.seller.id == user.id ? (
                        <>
                            <p>Vous êtes le propriétaire de cette offre</p>
                            <button onClick={() => console.log("Bientot rediriger vers une page de modification")}>
                                Modifier l'offre
                            </button>
                        </>
                    ) : (
                        <>
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
                                    Réservation confirmée
                                </p>
                            )}

                            <button onClick={handleInput}>
                                <p>Envoyer un message</p>
                            </button>
                        </>
                    )}
                </aside>
            </div>
        </div>
    );
}

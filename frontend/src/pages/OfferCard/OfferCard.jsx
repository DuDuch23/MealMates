import { useParams } from 'react-router';
import { useState,useEffect } from "react";
import './offerCard.css';

function OfferCard({id}){
    const [infOffer,setOffer] = useState([]);
    const params = useParams();
    const offerId = params.id ? parseInt(params.id) : null;

    useEffect(()=>{
        async function fetchOfferData() {
            if (!offerId) return;

            try {
                
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                setError("Une erreur est survenue.");
            }
        }

        fetchOfferData();
    },[offerId]);
    return(
    <>
    <div className="img-offer-card">
        <img src="img/offre/burger.png" alt="" />
    </div>
    <div className="user-offer">
        <p>User</p>
        <p>4</p>
    </div>
    </>
    );
}

export default OfferCard;
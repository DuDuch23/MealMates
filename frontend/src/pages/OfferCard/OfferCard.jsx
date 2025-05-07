<<<<<<< HEAD
=======
import { useParams } from 'react-router';
>>>>>>> b2ec60183de8db1922fd60460e8406a5b0319842
import { useState,useEffect } from "react";
import './offerCard.css';

function OfferCard({id}){
<<<<<<< HEAD
    return(<></>)
=======
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
>>>>>>> b2ec60183de8db1922fd60460e8406a5b0319842
}

export default OfferCard;
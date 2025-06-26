import React from "react";
import { Link } from "react-router-dom";
import styles from "./CardOffer.module.scss";

export default function CardOffer({offer}) {
    const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL;

    return(
        <Link to={`/offer/${offer.id}`} className={styles["slider-offer__link"]}>
            <div className={styles["slider-offer__card"]}>
                <div className={styles["slider-offer__info-top"]}>
                {offer.images?.length > 0 && (
                    <img
                    className={styles["slider-offer__image"]}
                    src={`${uploadsBaseUrl}/${offer.images[0].name}`}
                    alt={offer.product}
                    />
                )}
                </div>
                <div className={styles["slider-offer__info-middle"]}>
                <h3>{offer.product}</h3>
                {offer.categories?.length > 0 && (
                    <div className={styles["slider-offer__info-middle__categories"]}>
                    {offer.categories.map(c => <p key={c.id}>{c.name}</p>)}
                    </div>
                )}
                <p>{offer.price}€</p>
                </div>
                <div className={styles["slider-offer__info-seller"]}>
                <div className={styles["slider-offer__info-seller__seller"]}>
                    <p>{offer.seller.firstName}</p>
                    <p>{offer.seller.lastName}</p>
                </div>
                <p>4.75/5</p>
                </div>
            </div>
        </Link>
    );
}


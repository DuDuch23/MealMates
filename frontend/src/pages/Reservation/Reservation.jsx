import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const storedOffers = JSON.parse(localStorage.getItem("cart")) || [];
    setSelectedOffers(storedOffers);

    const sum = storedOffers.reduce((acc, offer) => acc + offer.price, 0);
    setTotal(sum);
  }, []);

  const handleCheckout = async () => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:8000/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: selectedOffers }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Récapitulatif de votre réservation</h2>
      <ul>
        {selectedOffers.map((offer, index) => (
          <li key={index} className={styles.offerItem}>
            <div>
              <strong>{offer.title}</strong>
              <p>{offer.description}</p>
            </div>
            <span>{offer.price} €</span>
          </li>
        ))}
      </ul>
      <div className={styles.total}>
        <strong>Total :</strong> {total.toFixed(2)} €
      </div>
      <button onClick={handleCheckout} className={styles.payButton}>
        Payer avec Stripe
      </button>
    </div>
  );
};

export default Checkout;

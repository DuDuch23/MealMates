import { loadStripe } from "@stripe/stripe-js";
import { createStripeSession } from "./api"; // ou useApi

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function OfferPayment({ offer }) {
    const handleBuy = async () => {
        try {
            const session = await createStripeSession(offer);
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: session.id });
        } catch (error) {
            alert("Erreur lors du paiement.");
        }
    };

    return (
        <button
            onClick={handleBuy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow-lg transition"
        >
            Total pour {offer.price} €
        </button>
    );
}

import { useState } from 'react';
import { createStripeSession } from "./api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function OfferPayment({ offer }) {
     const [qrCodeUrl, setQrCodeUrl] = useState(null);
     
}

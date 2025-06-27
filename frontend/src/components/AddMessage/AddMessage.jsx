import { useEffect, useState } from 'react';
import styles from './addMessage.module.css';
import { sendMessage, generateStripeLink } from '../../service/requestApi';

export default function AddMessage({ user, offer, chat }) {
    const [query, setQuery] = useState('');
    const [showLinkButton, setShowLinkButton] = useState(false);
    const userId = user.id;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (query.trim() === '') return;

        try {
            console.log(chat);
            await sendMessage({ userId, chat, message: query });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleOption = () => {
        setShowLinkButton((prev) => !prev);
    };

    const handleSendStripeLink = async () => {

        try {
            const response = await generateStripeLink({chat});
            const stripeUrl = response?.data?.url;

            if (stripeUrl) {
                await sendMessage({
                    userId,
                    chat,
                    message:`Voici le lien de paiement : <a href="${stripeUrl}" target="_blank" rel="noopener noreferrer">Clique ici</a>`,
                });
            }

            setShowLinkButton(false);
        } catch (error) {
            console.error('Erreur en générant le lien Stripe', error);
        }
    };

    const stripeButton = () => {
        if (user.id === offer.seller.id){
            return(
                <div className={`${styles.sendLink} ${showLinkButton ? styles.visible : ''}`}>
                  <button type="button" onClick={handleSendStripeLink}>
                    Envoyer le lien de paiement
                  </button>
                </div>
            );
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
        
          {stripeButton}

          <div className={styles.form}>
            <svg
              onClick={handleOption}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
              style={{ cursor: 'pointer' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
      
            <div>
              <input
                type="text"
                placeholder="Message"
                value={query}
                name="message"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </form>
    );

}

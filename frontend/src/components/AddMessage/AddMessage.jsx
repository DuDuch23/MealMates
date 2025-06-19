import { useState, useEffect } from 'react';
import styles from './addMessage.module.css';
import { sendMessage } from '../../service/requestApi';

export default function AddMessage({ user, chat }) {
    const [query, setQuery] = useState('');

    const userId = user.id;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (query.trim() === '') return;

        console.log('Message envoyé :', query);

        try {
            await sendMessage({ userId, chat, message: query });
            setQuery('');
        } catch (error) {
            console.error("Erreur lors de l'envoi du message", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    return (
        <form id={styles['addMessage']} onSubmit={handleSubmit}>
            <svg
                onClick={handleSubmit}
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
        </form>
    );
}

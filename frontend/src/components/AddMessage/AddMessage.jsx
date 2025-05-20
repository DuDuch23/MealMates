import { useState, useEffect } from 'react';
import styles from './addMessage.module.css';
import { sendChat } from '../../service/requestApi';

export default function AddMessage({userId,chat_id}){
    const [query, setQuery] = useState('');
    const [message,setMessage] = useState([]);

    const handleAddMessage = (event) => {
        setQuery(event.target.value);
    };


    useEffect(() => {
        const addMessage = async () => {
            try {
                await sendChat({userId,chat_id,message});
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories", error);
            }
        };
        addMessage();
    }, [userId,chat_id,message]);

    return(
        <form action="#" id={styles['addMessage']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div>
                <input type="text" placeholder='Message' value={query} onChange={handleAddMessage}  name='message'/>
            </div>
        </form>
    );
}
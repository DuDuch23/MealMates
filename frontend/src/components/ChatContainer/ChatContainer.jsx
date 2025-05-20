import { useState, useEffect } from "react";
import { Messages } from "../Message/Message";
import { getChat } from '../../service/requestApi';

function ChatContainer({userId,chat}){
    
    const [nowchat,setChat] = useState([]);
    const [myUser, setMyUser] = useState([]);
    const [theOtherUser, setTheOtherUser] = useState([]);

    // on récupere tout les messages
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await getChat({userId,chat});
            setChat(res);
          } catch (error) {
            console.error("Erreur de polling :", error);
          }
        };
        fetchData();
    }, []);

    // pour les messages on prends la date du dernier message envoyé et on réupere tout les messages envoyées aprés
    useEffect(()=>{
        const pollingData = async () => {
            try{
                const response = await fetch('https://api.example.com/status', {
                  signal: controller.signal,
                });
            }catch (err) {
                setError(err.message || 'Erreur lors du polling');
            }
        }
    },[]);
    
    console.log(chat);
    return(
        <>
        </>
    );
}

export default ChatContainer;
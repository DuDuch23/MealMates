import { useState, useEffect, useRef } from "react";
import { Messages } from "../Message/Messages";
import { getChat } from "../../service/requestApi";
import styles from "./container-message.module.css";

function ChatContainer({ user, chat, offer }) {
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Fonction réutilisable de récupération
  const fetchMessages = async () => {
    try {
      const res = await getChat({ userId: user.id, chat });
      const array = Object.values(res);
    return array[0] || [];
    } catch (error) {
        console.error("Erreur lors de la récupération du chat :", error);
        return [];
    }
  };

  // Initialisation
  useEffect(() => {
    if (!user || !chat) return;


    // console.log(chat);

    if(user.id){
        const init = async () => {
          await sleep(1000);
          const initialMessages = await fetchMessages();
          setMessages(initialMessages);
    };
      

      init();
    }
  }, [user, chat]);

  // Polling
  useEffect(() => {
    if (!user || !chat) return;

    const intervalId = setInterval(async () => {
      const newMessages = await fetchMessages();

      // Comparaison plus fiable par dernier message
      const lastCurrent = messages[messages.length - 1]?.message?.idForMessage;
      const lastNew = newMessages[newMessages.length - 1]?.message?.idForMessage;

      if (lastCurrent !== lastNew) {
        setMessages(newMessages);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Scroll automatique vers le bas
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles["container-message"]} ref={containerRef}>
      {messages.length > 1 ? (
        messages.slice(1).map((messageWrapper, index) => (
          <Messages
            key={messageWrapper.message.idForMessage || index}
            content={messageWrapper.message.content}
            id = {messageWrapper.user.id}
            iconUser={messageWrapper.user.icon}
          />
        ))
      ) : (
        <p>Chargement des messages...</p>
      )}
    </div>
  );
}

export default ChatContainer;

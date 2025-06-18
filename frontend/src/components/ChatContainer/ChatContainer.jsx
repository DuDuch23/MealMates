import { useState, useEffect, useRef } from "react";
import { Messages } from "../Message/Messages";
import { getChat } from '../../service/requestApi';
import "./container-message.css";

function ChatContainer({ user, chat }) {
  const [messages, setMessages] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchInitialChat = async () => {
      try {
        const userId = user ? JSON.parse(user).id : null;
        const res = await getChat({ userId, chat });
        const array = Object.values(res); 
        setMessages(array[0]);
      } catch (error) {
        console.error("Erreur lors du chargement initial du chat :", error);
      }
    };

    fetchInitialChat();
  }, [user, chat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageList = ({ messages }) => {
    if (messages.length  > 1) {
      return (
        <>
          {messages.slice(1).map((messageWrapper, index) => (
            <Messages
              key={messageWrapper.message.idForMessage || index}
              content={messageWrapper.message.content}
              iconUser={messageWrapper.user.icon}
            />
          ))}
        </>
      );
    } else {
      return <p>Chargement des messages...</p>;
    }
  };

  return (
    <div className="container-message" ref={containerRef}>
      <MessageList messages={messages} />
    </div>
  );
}

export default ChatContainer;


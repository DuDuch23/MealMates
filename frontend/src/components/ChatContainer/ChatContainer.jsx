import { useState, useEffect, useRef } from "react";
import { Messages } from "../Message/Messages";
import { getChat, getPolling } from '../../service/requestApi';
import "./container-message.css";

function ChatContainer({ user, chat }) {
  const [messages, setMessages] = useState([]);
  const [lastMessageTime, setLastMessageTime] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchInitialChat = async () => {
      try {
        const res = await getChat({ user, chat });
        if (res?.messages) {
          setMessages(res.messages);
          const last = res.messages[res.messages.length - 1];
          setLastMessageTime(last?.sentAt || null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial du chat :", error);
      }
    };

    fetchInitialChat();
  }, [user, chat]);

  // Polling pour les nouveaux messages
  useEffect(() => {
    const pollNewMessages = async () => {
      try {
        if (!lastMessageTime) return;

        const res = await getPolling({ chat, sentAt: lastMessageTime });

        if (res?.messages && res.messages.length > 0) {
          setMessages((prev) => [...prev, ...res.messages]);
          const last = res.messages[res.messages.length - 1];
          setLastMessageTime(last?.sentAt || lastMessageTime);
        }
      } catch (error) {
        console.error("Erreur de polling :", error);
      }
    };

    const interval = setInterval(pollNewMessages, 1000);

    return () => clearInterval(interval);
  }, [chat, lastMessageTime]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const MessageList = () => {
    if (messages.length > 0) {
      return (
      <>
          {messages.map((message) => (
            <Messages  key={message.id}  content={message.content.message} iconUser={message.user.iconUser} />
          ))}
      </>
    );
    } else {
      return <p>Chargement des messages...</p>;
    }
  };

  return (
    <div className="container-message" ref={containerRef}>
      <MessageList />
    </div>
  );
}

export default ChatContainer;

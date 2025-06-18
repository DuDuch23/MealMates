import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import AddMessage from '../../components/AddMessage/AddMessage';
import ChatContainer from '../../components/ChatContainer/ChatContainer';

function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);

  useEffect(() => {
    try {
      const userSession = sessionStorage.getItem("user");
      const chatId = sessionStorage.getItem("chat");

      if (userSession && chatId) {
        const parsedUser = JSON.parse(userSession);
        console.log(userSession);
        setUser(parsedUser);
        setChat(parseInt(chatId, 10));
      }
    } catch (err) {
      console.error("Erreur lors de la lecture du sessionStorage :", err);
    }
  }, []);

  console.log(user);

  // Ne rend rien tant que les données ne sont pas prêtes
  if (!user || !chat) return null;

  return (
    <>
      <ChatContainer user={user} chat={chat} />
      <AddMessage user={user} chat={chat} />
    </>
  );
}

export default Chat;

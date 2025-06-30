import { useEffect, useState } from 'react';
import { getOfferSingle, getInfoForChat } from '../../service/requestApi';
import AddMessage from '../../components/AddMessage/AddMessage';
import ChatContainer from '../../components/ChatContainer/ChatContainer';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [chat, setChat] = useState(null);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");
    const chatId = sessionStorage.getItem("chat");

    if (userSession && chatId) {
      const parsedUser = JSON.parse(userSession);
      setUser(parsedUser);
      setChat(parseInt(chatId, 10));

      const fetchChat = async () => {
        try {
          const res = await getOfferSingle(chatId);
          // console.log(res);
          setOffer(res);
        } catch (err) {
          console.error("Failed to fetch chat data:", err);
        }
      };

      fetchChat();
    }
  }, []);

  if (!user || !chat) return <div>Loading chat...</div>;

  return (
    <>
      <ChatContainer user={user} offer={offer} chat={chat} messages={messages} />
      <AddMessage user={user} offer={offer} chat={chat} />
    </>
  );
}

export default Chat;

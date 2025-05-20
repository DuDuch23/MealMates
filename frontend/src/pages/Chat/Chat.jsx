// Chat.js
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getChat } from '../../service/requestApi';
import AddMessage from '../../components/AddMessage/AddMessage'
import ChatContainer from '../../components/ChatContainer/ChatContainer';

function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const { user, chat } = location.state || {};

  if (!user || !chat) {
      console.log()
      return <p>Données de chat manquantes.</p>;
  }

  const userId = user.id;

  return(
  <>
    <ChatContainer user={userId}/>
    <AddMessage user={userId} chat={chat}/>
  </>
  );

}

export default Chat;

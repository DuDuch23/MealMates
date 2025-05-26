// Chat.js
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getChat } from '../../service/requestApi';
import AddMessage from '../../components/AddMessage/AddMessage'
import ChatContainer from '../../components/ChatContainer/ChatContainer';

function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(sessionStorage.getItem("user"));
  const [chat,setChat] = useState(sessionStorage.getItem("chat"));

  return(
  <>
    <ChatContainer user={user} chat={chat}/>
    <AddMessage user={user} chat={chat}/>
  </>
  );

}

export default Chat;

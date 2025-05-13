// Chat.js
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getChat } from '../../service/requestApi';

function Chat() {
  const location = useLocation();
  const [nowchat,setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user, chat } = location.state || {};

  if (!user || !chat) {
      console.log()
      return <p>Données de chat manquantes.</p>;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChat({user,chat});
        setChat(res);
      } catch (error) {
        console.error("Erreur de polling :", error);
      }
    };
    fetchData();
  }, [user,chat]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const res = await getChat({user,chat});
    //     setChat(res);
    //   } catch (error) {
    //     console.error("Erreur de polling :", error);
    //   }
    // };
    // fetchData();
    // const interval = setInterval(fetchData, 10000);
    // return ({user,chat}) => clearInterval(interval);
  }, []);

}

export default Chat;

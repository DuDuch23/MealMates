// Chat.js
import { useEffect, useState } from 'react';
import { getChat } from '../../service/requestApi';

function Chat() {
  const [chat,setChat] = useState([]);
  const [messages, setMessages] = useState([]);

  const WebSocketChat = () => {
    
    useEffect(()=>{
      const url = new URL('https://groupe-5.lycee-stvincent.net/mercure/message');

      url.searchParams.append('topic', 'https://groupe-5.lycee-stvincent.net/chat');

      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Nouveau message reçu :', data);
    };

    eventSource.onerror = (err) => {
      console.error('❌ Erreur Mercure :', err);
    };

    return () => {
      eventSource.close();};
    }, []);

    return <div>💬 Chat en temps réel</div>;
  };
  WebSocketChat();


  return(<></>);

}

export default Chat;

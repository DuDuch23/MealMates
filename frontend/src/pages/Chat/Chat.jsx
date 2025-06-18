// Chat.js
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { getChat } from '../../service/requestApi';
import AddMessage from '../../components/AddMessage/AddMessage'
import ChatContainer from '../../components/ChatContainer/ChatContainer';

function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  
  const [user, setUser] = useState((sessionStorage.getItem("user")));
  const [chat,setChat] = useState((parseInt(sessionStorage.getItem("chat"), 10)));

  const content = () => {
    if(user,chat){
      return (
        <div>
          <ChatContainer user={user} chat={chat} />
          {/* <AddMessage user={user} chat={chat} /> */}
        </div>
      );
    }
};

  return(
  <>
  {/* {content} */}
  </>
  );

}

export default Chat;

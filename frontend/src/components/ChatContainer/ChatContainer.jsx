import { useState, useEffect } from "react";
import { Messages } from "../Message/Message";
import { getChat } from '../../service/requestApi';

function ChatContainer({chat}){
    const [myUser, setMyUser] = useState([]);
    const [theOtherUser, setTheOtherUser] = useState([]);

    // const [chat, setChat] = useState();
    
    console.log(chat);
    return(
        <>
        <div id="container-chat">
            {chat.messages.map(content,id,senderId)(
            <Messages key={id} content={content} senderId={senderId} />
            )}
        </div>
        </>
    );
}

export default ChatContainer;
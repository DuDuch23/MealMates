import { useState, useEffect } from "react";
import { getAllChat } from "../../service/requestApi";
import ChooseChatUser from "../../components/ChooseChatUser/ChooseChatUser";
import "./ChooseChat.scss";

function ChooseChat() {
    const [chat, setChat] = useState([]);
    const userId = localStorage.getItem("user");

    useEffect(() => {
        if (!userId) return;
        
        async function executeRequest() {
            try {

                const data = await getAllChat(parseInt(userId));
                setChat(data.data);
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            }
        }
        
        executeRequest();
    }, []);

    return (
        <div className="choose-chat-container">
            {chat.map(chat => (
                <ChooseChatUser key={chat.chat_id} user={chat.user} lastMessage={chat.last_message} chat={chat.chat_id} />
            ))}
        </div>
    );
}

export default ChooseChat;

import { useState, useEffect } from "react";
import { getAllChat } from "../../service/requestApi";
import ChooseChatUser from "../../components/ChooseChatUser/ChooseChatUser";
import "./ChooseChat.scss";

function ChooseChat() {
    const [chat, setChat] = useState([]);
    const userId = sessionStorage.getItem("user");

    useEffect(() => {
        if (!userId) return;
        
        async function executeRequest() {
            try {
                const data = await getAllChat(userId);
                setChat(data.data);
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            }
        }
        
        executeRequest();
    }, [userId]);

    return (
        <div className="choose-chat-container">
            {chat.map(chat => (
                <ChooseChatUser key={chat.user.id} user={chat.user} chat={chat.chat_id} />
            ))}
        </div>
    );
}

export default ChooseChat;

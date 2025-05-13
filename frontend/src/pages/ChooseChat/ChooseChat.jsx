import { useState, useEffect } from "react";
import ChooseChatUser from "../../components/ChooseChatUser/ChooseChatUser";
import { getAllChat } from "../../service/requestApi";
import "./ChooseChat.scss";

function ChooseChat() {
    const [chat, setChat] = useState([]);
    const [userChat, setUserChat] = useState([]);
    const userId = localStorage.getItem("user");

    useEffect(() => {
        if (!userId) return;
        
        async function executeRequest() {
            try {
                const data = await getAllChat(userId);
                setChat(data.data);
                // Extract the `user` field from each chat and remove duplicates
                const users = data.data.map(chat => chat.user);
                const uniqueUsers = Array.from(new Map(users.map(user => [user.id, user])).values());
                setUserChat(uniqueUsers);
            } catch (error) {
                console.error("Failed to fetch chat data:", error);
            }
        }
    
        executeRequest();
    }, [userId]);

    console.log(userChat);

    return (
        <div className="choose-chat-container">
            {userChat.map(user => (
                <ChooseChatUser key={user.id} user={user} />
            ))}
        </div>
    );
}

export default ChooseChat;

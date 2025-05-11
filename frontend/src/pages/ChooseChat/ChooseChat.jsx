import { useState, useEffect } from "react";
import ChooseChatUser from "../../components/ChooseChatUser/ChooseChatUser";
import { getAllChat } from "../../service/requestApi";
import "./ChooseChat.scss";

function ChooseChat() {
    const [chat, setChat] = useState([]);
    const [userChat, setUserChat] = useState([]);
    const userId = localStorage.getItem("user");

    useEffect(() => {
        async function executeRequest() {
            const data = await getAllChat(userId);
            setChat(data.data);

            const users = [];
            data.data.forEach(element => {
                if (element.seller.id !== userId) {
                    users.push(element.seller);
                } else if (element.client.id !== userId) {
                    users.push(element.client);
                }
            });

            setUserChat(users);
        }

        executeRequest();
    }, [userId]);

    return (
        <div className="choose-chat-container">
            {userChat.map(user => (
                <ChooseChatUser key={user.id} user={user} />
            ))}
        </div>
    );
}

export default ChooseChat;

import { useState, useEffect } from "react";
import "./ChooseChatUser.scss"
import { Link, useNavigate } from 'react-router-dom';
import { IconUser } from "../IconUser/iconUser";


function ChooseChatUser({user,chat,lastMessage}) {
    const navigate = useNavigate();

    const handleClick = () => {
        sessionStorage.setItem("otherUser",user.id);
        sessionStorage.setItem("chat",chat);
        navigate('/chat');
    };


    return (
        <div onClick={handleClick} className="container-user-chat" style={{ cursor: 'pointer' }}>
            <div className="user-part">
                <IconUser id={user.icon} />
                <ul>
                    <li><h3>{user.name}</h3></li>
                    <p>{lastMessage.content}</p>
                </ul>
            </div>

        </div>
    );
}

export default ChooseChatUser;
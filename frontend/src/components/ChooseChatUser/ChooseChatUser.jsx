import { useState, useEffect } from "react";
import "./ChooseChatUser.scss"
import { Link, useNavigate } from 'react-router';
import { IconUser } from "../IconUser/iconUser";


function ChooseChatUser({user,chat}) {
    const navigate = useNavigate();
    console.log(chat);

    const handleClick = () => {
        navigate('/chat', {
            state: {
                user,
                chat: chat
            }
        });
    };

    return (
        <div onClick={handleClick} className="container-user-chat" style={{ cursor: 'pointer' }}>
            <div className="user-part">
                <IconUser id={user.iconUser} />
                <h3>{user.firstName} {user.lastName}</h3>
            </div>
        </div>
    );
}

export default ChooseChatUser;
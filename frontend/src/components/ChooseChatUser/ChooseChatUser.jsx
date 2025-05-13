import { useState, useEffect } from "react";
import "./ChooseChatUser.scss"
import { Link } from 'react-router';
import { IconUser } from "../IconUser/iconUser";


function ChooseChatUser({user}){
    console.log(user);
    return(
        <>
            <Link to="/chat/1" className="container-user-chat">
                <div className="user-part">
                    <IconUser id={user.iconUser} />
                    <h3>{user.firstName}&nbsp;{user.lastName}</h3>
                </div>
                <p></p>
            </Link>
        </>
    );
}

export default ChooseChatUser;
import { useState, useEffect } from "react";
import { IconUser } from "../IconUser/iconUser";

function ChooseChatUser({user}){
    console.log(user);
    return(
        <>
            <div className="container-user-chat">
                <div className="user-part">
                    <IconUser id={user.iconUser} />
                    <h3>{user.firstName}{user.lastName}</h3>
                </div>
                <p>Dernier message de l'utilisateur</p>
            </div>
        </>
    );
}

export default ChooseChatUser;
import { useState, useEffect } from "react";
import { IconUser } from "../IconUser/iconUser";
// import { randomKey } from "../../service/randomKey";

function ChooseChatUser({user}){
    return(
        <>
            <div className="container-user-chat">
                <div className="user-part">
                    <IconUser id={5} />
                    <h3>Nom de l'utilisateur</h3>
                </div>
                <p>Dernier message de l'utilisateur</p>
            </div>
        </>
    );
}

export default ChooseChatUser;
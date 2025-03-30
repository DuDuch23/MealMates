import { useState, useEffect } from "react";
import { useParams } from 'react-router'
import { getUser } from "../../service/requestApi";
import Avis from "../../components/Avis/Avis";

import './UserProfile.css';

function UserProfile(){
    // const {id} = useParams();
    // const [dataUser,setDataUser] = useState([]);

    // useEffect(()=>{
    //     getUser({id});
    // },
    // [{id}]);

    return(
        <>
            <div id="page-user">
                <div id="identy-user">
                    <img id="image-user"  alt="user image" />
                    <ul>
                        <li>Nom de l'utilisateur</li>
                        <li>Adresse de l'utilisateur</li>
                    </ul>
                </div>

                <ul id="params-user">
                    <li>
                        Préférence de l'utilisateur:<br/>
                    </li>
                    <li>
                        Disponibilité de l'utilisateur:<br/>
                    </li>
                </ul>

                {/* creer un composant pour le slider avis afin de pouvoir gerer le fait que certain utilisateur n'ont pas d'avis */}
                <Avis />
            </div>
        </>
    );
}

export default UserProfile;
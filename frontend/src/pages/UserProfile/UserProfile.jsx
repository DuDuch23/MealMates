import { useState, useEffect } from "react";
import { useParams } from 'react-router'
import { getUser } from "../../service/requestApi";

import './UserProfile.css';

function UserProfile(){
    const {id} = useParams();
    const [dataUser,setDataUser] = useState([]);

    useEffect(()=>{
        getUser({id});
    },
    [{id}]);

    return(
        <>
            <div>
                <h2>Mon profil</h2>
            </div>
        </>
    );
}

export default UserProfile;
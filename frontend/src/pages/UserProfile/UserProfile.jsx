import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { getUser } from "../../service/requestApi";

import './UserProfile.css';

function UserProfile() {
    // état pour stocker les infos de l'utilisateur
    const [user, setUser] = useState(null);

    // récupère l'id depuis l'URL
    const params = useParams();
    const userId = params.id;

    // récupère le token dans le localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        // fonction pour appeler l'API
        async function fetchUserData() {
            if (userId && token) {
                try {
                    const response = await getUser({ id: userId, token: token });
                    setUser(response);
                } catch (err) {
                    console.error("Erreur lors de la récupération des données :", err);
                }
            }
        }

        fetchUserData();
    }, [userId, token]);

    return (
    <>
        <div className="card-user">
            <nav>
                <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                <h2>MealMates</h2>
            </nav>
        </div>
    </>);
}

export default UserProfile;

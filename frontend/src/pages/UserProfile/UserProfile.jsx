import { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { getUser } from "../../service/requestApi";
import Avis from "../../components/Avis/Avis";

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
        <div id="page-user">
            <div id="identy-user">
                <img id="image-user" alt="Image de l'utilisateur" />
                <ul>
                    {user && user.data ? (
                        <>
                            <li>{user.data.firstName} {user.data.lastName}</li>
                            <li>{user.data.location}</li>
                        </>
                    ) : (
                        <li>Chargement...</li>
                    )}
                </ul>
            </div>

            <ul id="params-user">
              <li>
                Préférences de l'utilisateur :
                {user ? (
                  <ul>
                    {user.data.map((pref, index) => (
                        <li key={index}>{pref.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucune préférence renseignée</p>
                )}
              </li>
            </ul>

            <div id="slider-avis">
                {/* Composant pour les avis à insérer plus tard */}
                {/* <Avis avisList={user.data.avis} /> */}
            </div>
        </div>
    );
}

export default UserProfile;

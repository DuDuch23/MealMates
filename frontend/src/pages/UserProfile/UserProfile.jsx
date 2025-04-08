import { useState, useEffect } from "react";
import { useParams,Link } from 'react-router';
import { getUser } from "../../service/requestApi";
import IconUser from "../../components/IconUser.jsx/iconUser";
import Header from "../../components/Header/Header";
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
            <IconUser id={1}/>
            <div className="content-user">
                <div className="container-link">
                    <Link to="/">Mes informations</Link>
                    <span></span>
                    <Link to="/">MealCard</Link>
                    <span></span>
                    <Link to="/">Modifier mon compte</Link>
                </div>
                <div className="container-info-user">
                    <div className="basics-elements">
                        <div><p>Mon nom</p></div>
                        <div><p>Mon Prénom</p></div>
                        <div><p>Mon adresse email</p></div>
                    </div>
                    <div className="preferences">
                        
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default UserProfile;

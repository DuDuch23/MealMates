import { useState, useEffect } from "react";
import { useParams,Link } from 'react-router';
import { getUser } from "../../service/requestApi";
import { IconUser } from "../../components/IconUser/iconUser";
import randomId from "../../service/randomKey";
import Header from "../../components/Header/Header";
import './UserMealCard.css';

function UserMealCard() {
    // état pour stocker les infos de l'utilisateur
    const [user, setUser] = useState(null);

    // récupère l'id depuis l'URL
    const params = useParams();
    const userId = params.id;

    // récupère le token dans le localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
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
    }, [userId]);

    const infoUser = () => {
        if (user && user.data) {
            const moyenne = user.data.ratingsReceived.map((cur) => 
                cur.score
            );
            return (
                <>
                    <ul className="list-user">
                        <li><p>{user.data.firstName}</p></li>
                        <li><p>{moyenne}</p></li>
                    </ul>
                    <div>
                        <p>
                            Ou me trouver : <br/>
                            {user.data.location}
                        </p>
                    </div>
                </>
            );
        } else {
            return <p>Chargement des informations...</p>;
        }
    };
    
    const userPreference = () => {
        if (user && user.data.preferences) {
            return (
                <div className="preferences">
                    <h3>Mes offres :</h3>
                    <ul>
                        {user.data.preferences.map((preference) => (
                            <li key={randomId()}>{preference}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return <p>Aucune préférence disponible.</p>;
        }
    };

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
                    <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                    <span></span>
                    <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                    <span></span>
                    <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                </div>
                <div className="container-info-user">
                    <div className="basics-elements">
                        {infoUser()}
                    </div>
                    {userPreference()}
                </div>
            </div>
        </div>
    </>);
}

export default UserMealCard;

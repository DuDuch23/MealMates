import { useState, useEffect } from "react";
import { useParams,Link } from 'react-router';
import { getUser } from "../../service/requestApi";
import IconUser from "../../components/IconUser.jsx/iconUser";
import randomId from "../../service/randomKey";
import Header from "../../components/Header/Header";
import './UserModify.css';

function UserModify() {
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
            return (
                <>
                    <div><p>{user.data.firstName}</p></div>
                    <div><p>{user.data.lastName}</p></div>
                    <div><p>{user.data.email}</p></div>
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
                    <h3>Mes préférences</h3>
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

    
    console.log(user);

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
                    <form action="#">
                        {/* nom et prénom */}
                        <div>
                            <input type="text" name="lastName"/>
                            <input type="text" name="firstName"/>
                        </div>
                        {/* email */}
                        <div>
                            <label htmlFor="email">Mon email</label>
                            <input type="text" name="" />
                        </div>
                        {/* ville */}
                        <div>
                            <label htmlFor="Ville/Pays">Ma ville</label>
                            <input type="text" name="" />
                        </div>
                        {/* adresse rue */}
                        <div>
                            <label htmlFor="Adresse">Mon adresse</label>
                            <input type="text" name="" />
                        </div>
                        {/* préference */}
                    </form>
                </div>
            </div>
        </div>
    </>);
}

export default UserModify;

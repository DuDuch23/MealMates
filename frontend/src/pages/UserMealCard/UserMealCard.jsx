import { useState, useEffect } from "react";
import { useParams,Link } from 'react-router';
import { getUser,getOfferBySeller } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import { IconUser } from "../../components/IconUser/iconUser";
import randomId from "../../service/randomKey";
import './UserMealCard.css';

function UserMealCard() {
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;

    const [user, setUser] = useState(null);
    const [userOffer,setOfferUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) return;

            try {
                const localData = await getUserIndexDB(userId);

                if (localData) {
                    setUser(localData);
                    console.log("Utilisateur depuis IndexedDB :", localData);
                } else {
                    const token = localStorage.getItem("token");
                    const remoteData = await getUser({ user: userId });
                    setUser(remoteData.data);
                    console.log("Utilisateur depuis API :", remoteData.data);
                }
                const data = await getOfferBySeller(userId);
                console.log("Utilisateur depuis offer :", data);
                setOfferUser(data.data);
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                setError("Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, []);

    const userIcon = () =>{
        if (user){ 
            console.log(user.iconUser);
            return (user.iconUser)
        }
    }; 

    const infoUser = () => {
        if (user) {
            return (
                <>
                    <ul className="list-user">
                        <li><p>{user.firstName}</p></li>
                    </ul>
                    <div>
                        <p>
                            Ou me trouver : <br/>
                            {user.location}
                        </p>
                    </div>
                </>
            );
        } else {
            return <p>Chargement des informations...</p>;
        }
    };

    const userPreference =  () => {
        if (userOffer) {
            return (
                <div className="preferences">
                    <h3>Mes offres :</h3>
                    <ul>
                        {userOffer.map((offer) => (
                            <li key={randomId()}>{offer.product}</li>
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
                <Link to={"/"}>
                    <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                    <h2>MealMates</h2>
                </Link>
            </nav>
            <IconUser id={userIcon()}/>
            <div className="content-user">
                <div className="container-link">
                    <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                    <span>
                      <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                      </svg>
                    </span>
                    <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                    <span>
                      <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                      </svg>
                    </span>
                    <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                </div>
                <div className="container-info-user">
                    <div className="basics-elements card">
                        {infoUser()}
                    </div>
                    {userPreference()}
                </div>
            </div>
        </div>
    </>);
}

export default UserMealCard;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getUser, editUser } from "../../service/requestApi";
import { getUserIndexDB, updateUserIndexDB } from "../../service/indexDB";
import { IconUser, ChooseYourIcon } from "../../components/IconUser/iconUser";
import styles from './UserModify.module.css';

function UserModify() {
    const [user, setUser] = useState(null);
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;

    const userSession = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();

    const [idIcon, setIdIcon] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAdress] = useState("");
    const [option, setOption] = useState("");

    // ✅ Redirection sécurisée si l'utilisateur veut modifier son propre profil
    useEffect(() => {
        if (userId === userSession?.id) {
            navigate("/offer");
        }
    }, [userId, userSession?.id, navigate]);

    // ✅ Récupération de l'utilisateur depuis l'indexDB
    useEffect(() => {
        async function fetchUserData() {
            if (userId) {
                try {
                    const localData = await getUserIndexDB(userId);
                    setUser(localData);
                } catch (err) {
                    console.error("Erreur lors de la récupération des données :", err);
                }
            }
        }
        fetchUserData();
    }, [userId]);

    // ✅ Pré-remplissage des champs avec les données utilisateur
    useEffect(() => {
        if (user) {
            setIdIcon(user.idIcon || 1);
            setEmail(user.email || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setCity(user.city || "");
            setAdress(user.address || "");
            setOption(user.option || "");
        }
    }, [user]);

    const handleIconChange = (id) => {
        setIdIcon(id);
    };

    const handleEdit = async (event) => {
        event.preventDefault();

        const userData = {
            userId,
            idIcon,
            email,
            firstName,
            lastName,
            city,
            address,
            option,
        };

        try {
            const res = await editUser({ userData });
            if (res.code === 200) {
                await updateUserIndexDB({ userId, userData });
                alert("Informations mises à jour avec succès !");
                navigate(`/userProfile/${userId}`);
            } else {
                alert("Erreur lors de la mise à jour.");
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            alert("Une erreur est survenue.");
        }
    };

    return (
        <>
            <div className={styles.cardUser}>
                <nav>
                    <Link to={"/"}>
                        <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                        <h2>MealMates</h2>
                    </Link>
                </nav>

                <div className={styles["user-face"]}>
                    <IconUser id={idIcon} />
                    <ChooseYourIcon onValueChange={handleIconChange} />
                </div>

                <div className={styles["content-user"]}>
                    <div className="container-link">
                        <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                        <span>
                            <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="1.26" y1="0" x2="1.26" y2="35.92" stroke="#EFF1F5" strokeWidth="1.24" />
                            </svg>
                        </span>
                        <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                        <span>
                            <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="1.26" y1="0" x2="1.26" y2="35.92" stroke="#EFF1F5" strokeWidth="1.24" />
                            </svg>
                        </span>
                        <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                    </div>

                    <div className={styles["container-info-user"]}>
                        <form onSubmit={handleEdit}>
                            {/* nom et prénom */}
                            <div className={styles["name-select"]}>
                                <input type="text" name="lastName" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                <input type="text" name="firstName" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>

                            {/* email */}
                            <div>
                                <input type="email" id={styles.email} name="email" placeholder="Mon email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            {/* ville */}
                            <div>
                                <input type="text" id={styles.city} name="city" placeholder="Ma ville" value={city} onChange={(e) => setCity(e.target.value)} />
                            </div>

                            {/* adresse rue */}
                            <div>
                                <input type="text" id={styles.address} name="address" placeholder="Mon adresse" value={address} onChange={(e) => setAdress(e.target.value)} />
                            </div>

                            {/* préférences */}
                            <div>
                                <label htmlFor="preferences">Mes préférences :</label>
                                <select name="preference" id={styles["preference-select"]} value={option} onChange={(e) => setOption(e.target.value)}>
                                    <option value="">--Choisir une préférence--</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="vegetarian">Végétarien</option>
                                    <option value="no-preference">Aucune préférence</option>
                                </select>
                            </div>

                            <button type="submit">Enregistrer</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserModify;

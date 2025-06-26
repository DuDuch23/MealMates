import styles from './Header.module.scss';
// import { Link, useNavigate } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { IconUser } from '../IconUser/iconUser';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo-mealmates.png';
import { getProfile, refreshToken, logOut } from '../../service/requestApi';

export default function Header({ onProfileClick }) {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const [userData, setUserData] = useState(null);

    // Enregistre l'utilisateur dans sessionStorage s'il est chargé
    useEffect(() => {
        if (userData) {
            sessionStorage.setItem("user", JSON.stringify(userData.user));
        }
    }, [userData]);

    // Récupère l'utilisateur stocké (si présent)
    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserData({ user: parsedUser });
            } catch (e) {
                console.error("Erreur lors du parsing de l'utilisateur stocké.");
                sessionStorage.removeItem("user");
            }
        }
    }, []);

    // Récupère les données de l'utilisateur depuis l'API
    useEffect(() => {
        if (token) {
            try {
                refreshToken(token);
                const { username } = jwtDecode(token);

                const fetchUserProfile = async () => {
                    const profile = await getProfile({ email: username, token });
                    setUserData(profile);
                };

                fetchUserProfile();
            } catch (error) {
                console.error("Le token est invalide ou expiré", error);
            }
        }
    }, [token]);

    const handleDeconnexion = () => {
        const userId = sessionStorage.getItem("user");
        logOut(userId);
        sessionStorage.clear();
        navigate('/');
    };

    const renderUserSection = () => {
        if (userData) {
            return (
                <>
                    <Link className={styles['button-user-info-desktop']} key="profil" to={`/userProfile/${userData.user.id}`}>
                        <IconUser id={userData.user.iconUser}/>
                        <p>{userData.user.firstName}</p>
                    </Link>
                    <li className={styles['button-user-info-mobile']} key="inscription" onClick={onProfileClick}>
                        <IconUser id={userData.user.iconUser}/>
                        <p>{userData.user.firstName}</p>
                    </li>
                </>
            );
        } else {
            return (
                <>
                    <li className={styles['button-sign-in']}>
                        <Link to="/inscription">Inscription</Link>
                    </li>
                    <li className={styles['button-login']}>
                        <Link to="/connexion">Connexion</Link>
                    </li>
                </>
            );
        }
    };

    return (
        <section className={styles.header}>
            <div className={styles.header__container}>
                <div className={styles.header__left}>
                    <ul className={styles.header__leftMenu}>
                        <li>
                            <Link className={styles.logo} to="/">
                                <img src={logo} alt="Logo MealMates" />
                                <h1>MealMates</h1>
                            </Link>
                        </li>

                        {userData && (
                            <>
                                <li><Link to="/offer">Offres</Link></li>
                                <li><Link to="/ChooseChat">Messages</Link></li>
                                <li><Link to="/addOffer">Ajouter une offre</Link></li>
                                <li><Link to="/" onClick={handleDeconnexion}>Se déconnecter</Link></li>
                            </>
                        )}
                    </ul>
                </div>

                <div className={styles.header__right}>
                    <ul className={styles.header__rightInfo}>
                        {renderUserSection()}
                    </ul>
                </div>
            </div>
        </section>
    );
}

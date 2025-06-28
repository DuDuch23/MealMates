import styles from './Header.module.scss';
import { Link } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { IconUser } from '../IconUser/iconUser';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo-mealmates.png';
import { getProfile, refreshToken, logOut } from '../../service/requestApi';

export default function Header({ onProfileClick }) {
    const token = sessionStorage.getItem("token");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (userData) {
            sessionStorage.setItem("user", JSON.stringify(userData.user));
        }
    }, [userData]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserData({ user: parsedUser });
            } catch (e) {
                console.error("Erreur de parsing user depuis sessionStorage");
                sessionStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        if (token) {
            try {
                refreshToken( token );
                const user = jwtDecode(token);
                const fetchUserProfile = async () => {
                    const email = user.username;
                    const profile = await getProfile({ email, token });
                    setUserData(profile);
                };
                fetchUserProfile();
            } catch (error) {
                console.error("Le token est invalide ou ne peut pas être décodé", error);
            }
        }
    }, [token]);

    const handleDeconnexion = () => {
        const userId = sessionStorage.getItem("user");
    
        logOut(userId);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        
        navigate("/");
    };

    const infoUser = () => {
        if (userData) {
            return (
                <>
                    <Link className={styles['button-user-info-desktop']} key="profil" to={`/userProfile/${userData.user.id}`}>
                        <IconUser iconId={userData.user.iconUser}/>
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
                    <li className={styles['button-sign-in']} key="inscription">
                        <Link className={styles['button-sign-in-link']} key="inscription" to="/inscription">Inscription</Link>
                    </li>
                    <li className={styles['button-login']} key="connexion">
                        <Link className={styles['button-login-in-link']} key="connexion" to="/connexion">Connexion</Link>
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
                            <Link className={styles.logo} key="home" to="/">
                                <img src={logo} alt="Logo MealMates" />
                                <h1>MealMates</h1>
                            </Link>
                        </li>
                        {
                            userData && 
                            <>
                                <div className={styles.header__leftMenuUser}>
                                    <li>
                                        <Link key="offer" to="/offer">
                                            Offres
                                        </Link>
                                    </li>
                                    <li>
                                        <Link key="ChooseChat" to="/ChooseChat">
                                            Messages
                                        </Link>
                                    </li>
                                    <li>
                                        <Link key="addOffer" to="/addOffer">
                                            Ajouter une offre
                                        </Link>
                                    </li>
                                    <li>
                                        <Link key="logout" to="/" onClick={handleDeconnexion}>
                                            Se déconnecter
                                        </Link>
                                    </li>
                                </div>
                            </>
                        }
                    </ul>
                </div>
                <div className={styles.header__right}>
                    <ul className={styles.header__rightInfo}>
                        {infoUser()}
                    </ul>
                </div>
            </div>
        </section>
    );
}
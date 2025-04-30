import styles from './Header.module.css';
import { Link } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import { IconUser } from '../IconUser/iconUser';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo-mealmates.png';
import { getProfile, refreshToken } from '../../service/requestApi';

export default function Header({ onProfileClick }) {
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (userData) {
        localStorage.setItem("user", userData.user.id);
        }
    }, [userData]);

    useEffect(() => {
        if (token) {
            try {
                refreshToken({ token });
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

    const infoUser = () => {
        if (userData) {
            return (
                <li className={styles.header__user} key="inscription" onClick={onProfileClick}>
                    <IconUser id={userData.user.iconUser}/>
                   <p>{userData.user.firstName}</p>
                </li>
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
            <div className={styles.header__left}>
                <img src={logo} alt="Logo MealMates" />
                <h1>MealMates</h1>
            </div>
            <div className={styles.header__right}>
                <ul className={styles.header__rightInfo}>
                    {infoUser()}
                </ul>
            </div>
        </section>
    );
}

import styles from './Header.module.scss';
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
                <li className='button-sign-in button-user' key="inscription" onClick={onProfileClick}>
                    <IconUser id={userData.user.iconUser}/>
                   <p>{userData.user.firstName}</p>
                </li>
            );
        } else {
            return (
                <>
                    <li className={styles['button-sign-in']} key="inscription">
                        <Link to="/inscription">Inscription</Link>
                    </li>
                    <li className={styles['button-log-in']} key="connexion">
                        <Link to="/connexion">Se connecter</Link>
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
            <div className={styles['header-right']}>
                <ul>
                    {infoUser()}
                </ul>
            </div>
        </section>
    );
}

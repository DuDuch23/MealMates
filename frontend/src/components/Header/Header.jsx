import './Header.css';
import { Link } from 'react-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo-mealmates.png';
import { getProfile, refreshToken } from '../../service/requestApi';
import { IconUser } from '../IconUser/iconUser';

export default function Header() {
    const token = localStorage.getItem("token");
    
    const [userData, setUserData] = useState(null);
    
    if(userData != null){
        localStorage.setItem("user",userData.user.id);
    }

    useEffect(() => {
        if (token) {
            try {
                refreshToken({token});

                const user = jwtDecode(token);
                
                const fetchUserProfile = async () => {
                    const email = user.username;
                    const profile = await getProfile({email,token});
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
                <li className='button-sign-in button-user' key="inscription">
                    <IconUser id={userData.user.iconUser}/>
                   <Link to={`/userProfile/${userData.user.id}`}>{userData.user.firstName}</Link>
                </li>
            );
        } else {
            return (
                <>
                    <li className='button-sign-in' key="inscription">
                        <Link to="/inscription">Inscription</Link>
                    </li>
                    <li className='button-log-in' key="connexion">
                        <Link to="/connexion">Se connecter</Link>
                    </li>
                </>
            );
        }
    };

    return (
        <section className="header">
            <div className="header-left">
                <img src={logo} alt="Logo MealMates" />
                <h1>MealMates</h1>
            </div>
            <ul className="header-right">
                {infoUser()}
            </ul>
        </section>
    );
}
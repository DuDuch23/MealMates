import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo-mealmates.png';

export default function Header() {
    const [menuMobile, setMenuMobile] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false); // Nouvel état pour cacher complètement
    const [closeMenuMobile, setCloseMenuMobile] = useState(false);
    const [stateUser, setStateUser] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setStateUser([
                <li className='header-primary__inscription' key="inscription"><Link to="/inscription">Inscription</Link></li>,
                <li className='header-primary__connexion' key="connexion"><Link to="/connexion">Se connecter</Link></li>
            ]);
        } else {
            setStateUser([
                <li key="deconnexion"><Link to="/deconnexion">Déconnexion</Link></li>,
            ]);
        }
    }, [token]);

    useEffect(() => {
        if (menuMobile) {
            setMenuVisible(true);
            setCloseMenuMobile(false);
        } else if (closeMenuMobile) {
            setTimeout(() => {
                setMenuVisible(false);
            }, 500); // Cache après la durée de l'animation
        }
    }, [menuMobile, closeMenuMobile]);

    return (
        <header className="header-primary">
            <div className='header-primary__logo'>
                <img src={Logo} alt="Panier" className="header-primary__panier" />
                <h1 className={`${menuMobile ? "slide-left-header" : ""} ${closeMenuMobile ? "slide-right-header" : ""}`}>
                    MealMates
                </h1>
            </div>
            <ul className='header-primary__nav-desktop'>
                {stateUser}
            </ul>

            <button className="header-primary__btn-menu-mobile" onClick={() => setMenuMobile(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 30 30">
                    <path d="M 3 7 A 1 1 0 1 0 3 9 L 27 9 A 1 1 0 1 0 27 7 L 3 7 z M 3 14 A 1 1 0 1 0 3 16 L 27 16 A 1 1 0 1 0 27 14 L 3 14 z M 3 21 A 1 1 0 1 0 3 23 L 27 23 A 1 1 0 1 0 27 21 L 3 21 z"></path>
                </svg>
            </button>

            {menuVisible && (
                <div className={`container-menu-mobile ${closeMenuMobile ? "slide-right" : "slide-left"}`}>
                    <nav className="menu-mobile">
                        <div className="nav-top">
                            <h1>MealMates</h1>
                            <button className="close-btn" onClick={() => {
                                setCloseMenuMobile(true);
                                setMenuMobile(false);
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 50 50">
                                    <path d="M 40.78 7.27 A 2 2 0 0 0 39.39 7.88 L 25.05 22.22 L 10.71 7.88 A 2 2 0 0 0 9.28 7.28 A 2 2 0 0 0 7.88 10.71 L 22.22 25.05 L 7.88 39.39 A 2 2 0 1 0 10.71 42.21 L 25.05 27.88 L 39.39 42.21 A 2 2 0 1 0 42.21 39.39 L 27.88 25.05 L 42.21 10.71 A 2 2 0 0 0 40.78 7.27 z"></path>
                                </svg>
                            </button>
                        </div>
                        <ul>
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/">Suggestions</Link></li>
                            <li><Link to="/">Mon panier</Link></li>
                            {stateUser}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}

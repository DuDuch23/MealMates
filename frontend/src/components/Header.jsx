import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';

export default function Header() {
    const [menuMobile, setMenuMobile] = useState(false);
    const [close, setClose] = useState(false);

    const handleMenuMobile = () => {
        setMenuMobile(true);
        setClose(false);
    };

    const closeMenuMobile = () => {
        setClose(true);
        setTimeout(() => {
            setMenuMobile(false);
            setClose(false);
        }, 500);
        return () => clearTimeout(timeOut);
    }

    return (
        <>
            <header className='header-primary'>
                <h1 className={`${menuMobile ? "slide-left-header" : "" } ${close ? "slide-right-header" : ""}`}>MealMates</h1>
                <button className="btn-menu-mobile " onClick={handleMenuMobile} aria-expanded={menuMobile}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="30" viewBox="0 0 30 30">
                <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
                </svg>
                </button>
            {menuMobile && (
                <div className={`container-menu-mobile ${close ? "slide-right" : "slide-left"}`}>
                    <nav className='menu-mobile'>
                        <div className='nav-top'>
                            <h1>MealMates</h1>
                            <button className='close-btn' onClick={closeMenuMobile} aria-expanded={menuMobile}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 50 50">
                            <path d="M 40.783203 7.2714844 A 2.0002 2.0002 0 0 0 39.386719 7.8867188 L 25.050781 22.222656 L 10.714844 7.8867188 A 2.0002 2.0002 0 0 0 9.2792969 7.2792969 A 2.0002 2.0002 0 0 0 7.8867188 10.714844 L 22.222656 25.050781 L 7.8867188 39.386719 A 2.0002 2.0002 0 1 0 10.714844 42.214844 L 25.050781 27.878906 L 39.386719 42.214844 A 2.0002 2.0002 0 1 0 42.214844 39.386719 L 27.878906 25.050781 L 42.214844 10.714844 A 2.0002 2.0002 0 0 0 40.783203 7.2714844 z"></path>
                            </svg>
                            </button>
                        </div>
                        <ul>
                            <li><Link to="/">Accueil</Link></li>
                            <li><Link to="/">Suggestions</Link></li>
                            <li><Link to="/">Mon panier</Link></li>
                            <li className='btn'><Link to="/inscription">Inscription</Link></li>
                            <li className='btn'><Link to="/connexion">Se connecter</Link></li>
                        </ul>
                    </nav>
                </div>
            )}
            </header>

        </>
    );
}
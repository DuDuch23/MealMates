import React, { useState } from 'react';
import {Link} from 'react-router-dom';

export default function App() {
    const [menuMobile, setMenuMobile] = useState(false);

    const handleMenuMobile = () => {
        setMenuMobile(prevState => !prevState);
    };

    return (
        <header>
            <h1>MealMates</h1>
            <button onClick={handleMenuMobile} aria-expanded={menuMobile}>
                {menuMobile ? 'Fermer' : 'Menu'}
            </button>

            {menuMobile && (
                <nav>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/">Suggestions</Link></li>
                        <li><Link to="/">Mon panier</Link></li>
                        <li className='btn'><Link to="/">Inscription</Link></li>
                        <li className='btn'><Link to="/">Se connecter</Link></li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
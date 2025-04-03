import React, { useState, useEffect } from 'react';
import './Home.css';
import logo from '../../assets/logo-mealmates.png';
import map from '../../assets/landing-map.png';

function App() {
    return (
        <section className="landing">
            <section className="header">
                <div className="header-left">
                    <img src={logo}></img>
                    <h1>MealMates</h1>
                </div>
                <div className="header-right">
                    <button className="button-sign-in">Inscription</button>
                    <button className="button-log-in">Connexion</button>
                </div>
            </section>
            <section className="top">
                <h1>Et si on mangait moins cher, plus respectueux de la planète?</h1>
            </section>
            <section className="inbetween">
                <p>Luttez contre le gaspillage en achetant à d'autres particuliers, et proposez vos propres surplus alimentaires.</p>
            </section>
            <section className="bottom">
                <div className="left">
                    <div className="circle"></div>
                    <img src={map}></img>
                </div>
                <div className="right">
                    <h1>Obtenez des offres locales, qui suivent vos offres alimentaires</h1>
                    <button>M'inscrire maintenant</button>
                    <div className="footer">
                        <p>© Mealmates 2025</p>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default App;

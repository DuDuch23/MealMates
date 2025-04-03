import React, { useState, useEffect } from 'react';
import './Home.css';
import bg1 from '../../assets/logo-mealmates.png';

function App() {
    return (
        <section className="landing">
            <section className="header">
                <div className="header-left">
                    <img src={bg1}></img>
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
            <section className="bottom">
                <div className="left"></div>
                <div className="right"></div>
            </section>
        </section>
    );
}

export default App;

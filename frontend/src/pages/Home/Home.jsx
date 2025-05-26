import styles from './Home.module.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import UserLocationMap from '../../components/GoogleMaps/GoogleMaps';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [pos, setPos] = useState(null);
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const navigate = useNavigate();
    // if(token && user){
    //     navigate("/offer");
    //     console.log("Vous êtes connecté, redirection vers la page d'accueil.");
    // }
    // else{
    //     console.log("Vous n'êtes pas connecté, redirection vers la page de connexion.");
    // }

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
        (position) => 
            setPos({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => {
            console.warn("Erreur de géolocalisation :", error);
            const fallback = { lat: 48.8566, lng: 2.3522 };
            console.log("Fallback position utilisée :", fallback);
            setPos(fallback);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
        }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

    return (
        <section className={styles.landing}>
            <section className={styles.top}>
                <h1>Et si on mangeait moins cher, plus respectueux de la planète ?</h1>
            </section>

            <section className={styles.inbetween}>
                <p>Luttez contre le gaspillage en achetant à d'autres particuliers, et proposez vos propres surplus alimentaires.</p>
            </section>

            <section className={styles.bottom}>
                <div className={styles.bottom__maps}>
                    <div className={styles.bottom__circle}></div>
                </div>

                <div className={styles.bottom__right}>
                    <h2>Obtenez des offres locales, qui suivent vos offres alimentaires</h2>
                    <button>M'inscrire maintenant</button>
                </div>
            </section>
            <footer className={styles.footer}>
                <p>© Mealmates 2025</p>
            </footer>
        </section>
    );
}

export default App;

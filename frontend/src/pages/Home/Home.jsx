import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './Home.css';
import logo from '../../assets/logo-mealmates.png';
import map from '../../assets/landing-map.png';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import Searchbar from '../../components/Searchbar/Searchbar';
import { searchOfferByTitle } from '../../service/requestApi';


function App() {
    const [stateUser, setStateUser] = useState([]);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        try {
            if (storedUser && storedUser !== "undefined") {
                return JSON.parse(storedUser);
            }
        } catch (error) {
            console.error("Erreur lors du parsing de l'utilisateur :", error);
        }
        return null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setStateUser([
                <li className='button-sign-in' key="inscription"><Link to="/inscription">Inscription</Link></li>,
                <li className='button-log-in' key="connexion"><Link to="/connexion">Se connecter</Link></li>
            ]);
        } else {
            setStateUser([
                <li className='button-deconnexion' key="deconnexion"><Link to="/deconnexion">Déconnexion</Link></li>,
            ]);
        }
    }, [token]);

    const handleSearch = async (query) => {
        try {
            const results = await searchOfferByTitle(query);
            console.log("Résultats de recherche :", results);
        } catch (error) {
            console.error("Erreur de recherche :", error);
        }
    };

    const [userLocation, setUserLocation] = useState(null);
    const getUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
            });
            const { latitude, longitude } = position.coords;
            setUserLocation({
                latitude: latitude,
                longitude: longitude,
            });
            getUserLocation();
            console.log("User location:", userLocation);
            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
            console.log("Token:", token);
            console.log("User:", user);
            console.log("State user:", stateUser);
        });
    }


    return (
        <section className="landing">
            <div className='header-container'>
                <section className="header">
                    <div className="header-left">
                        <img src={logo}></img>
                        <h1>MealMates</h1>
                    </div>
                    <div className="header-right">
                        {stateUser}
                    </div>
                </section>
                <div className='menu-mobile'>
                    <Header />
                </div>
            </div>
            {token && <Searchbar  onSearch={handleSearch} />}
            <button onClick={getUserLocation}>Get User Location</button>

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

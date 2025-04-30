import styles from './Home.module.scss';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';
import { searchOfferByTitle,getProfile,refreshToken,getVeganOffers,getOffers,getLastChanceOffers,getAgainOffers,getLocalOffers,} from '../../service/requestApi';
import UserLocationMap from '../../components/GoogleMaps/GoogleMaps';
import { jwtDecode } from 'jwt-decode';
import SliderSection from '../../components/SliderOffers/SliderOffers';

function App() {
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);
    const [pos, setPos] = useState(null);
    const [offers, setOffers] = useState([]);
    const [veganOffers, setVeganOffers] = useState([]);
    const [againOffers, setAgainOffers] = useState([]);
    const [lastChanceOffers, setLastChanceOffers] = useState([]);
    const [localOffers, setLocalOffers] = useState([]);
    const [userPos, setUserPos] = useState(null);

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

    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (query) => {
        try {
            const results = await searchOfferByTitle(query);
            console.log("Résultats de recherche :", results);
            if (results && results.data) {
                setSearchResults(results.data);
            } else {
                setSearchResults([]); 
            }
        } catch (error) {
            console.error("Erreur de recherche :", error);
        }
    };
  

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
        (position) => 
            setUserPos({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => {
            console.warn("Erreur de géolocalisation :", error);
            const fallback = { lat: 48.8566, lng: 2.3522 };
            console.log("Fallback position utilisée :", fallback);
            setUserPos(fallback);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
        }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {

    const fetchOffers = async () => {
        try {
            const data = await getOffers();
            if (data && data.data) {
                console.log("offers",data);
                setOffers(data.data);
            } else {
                console.log("Erreur ou offres vides");
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des offres:', err);
            setOffers([]);
        }
    };

    const fetchVeganOffers = async () => {
        try {
            const data = await getVeganOffers();
            if(data && data.data) {
                console.log("vegan",data);
                setVeganOffers(data.data);
            } else {
                console.log("Erreur ou offres vegans vides");
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des offres vegan:', err);
            setVeganOffers([]);
        }
    };

    const fetchLastChanceOffers = async () => {
        try {
            const data = await getLastChanceOffers();
            if(data && data.data){
                console.log("last", data);
                setLastChanceOffers(data.data);
            } else{
                console.log("Erreur ou offres last chance vides");
            }
        } catch (err){
            console.error('Erreur lors de la récupération des offres last chance:', err);
            setLastChanceOffers([]);
        }
    };
    if(token){
        const fetchAgainOffers = async () => {
            try {
                const data = await getAgainOffers(token);
                if(data && data.data){
                    console.log("again", data);
                    setAgainOffers(data.data);
                } else{
                    console.log("Erreur ou offres again vides");
                }
            } catch (err){
                console.error('Erreur lors de la récupération des offres again :', err);
                setAgainOffers([]);
            }
        };
        fetchAgainOffers();
    }

    const fetchLocalOffers = async () => {
        try {
            const data = await getLocalOffers();
            if(data && data.data){
                console.log("local", data);
                setLocalOffers(data.data);
            } else{
                console.log("Erreur ou offres locales vides");
            }
        } catch (err){
            console.error('Erreur lors de la récupération des offres locales :', err);
            setLocalOffers([]);
        }
    };

    fetchOffers();
    fetchVeganOffers();
    fetchLastChanceOffers();
    fetchLocalOffers();
    }, []);

  if (!userData) {
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
                    <UserLocationMap offers={offers} onPosition={setPos} />
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
  } else {
        return (
            <section className={styles.landing}>
                <section className={styles.top}>
                    <h1>Besoin de fraîcheur ?</h1>
                </section>
                <SearchBar onSearch={handleSearch} />
                <section className={styles.bottom}>
                    <section className={styles.bottom__maps}>
                        <div className={styles.bottom__circle}></div>
                        <UserLocationMap offers={offers} onPosition={setPos} />
                    </section>
                    <section className={styles['offers']}>
                    {searchResults.length > 0 ? (
                            <SliderSection title="Résultats de recherche" offers={searchResults} />
                        ) : (
                            <>
                            {token ?? (
                                <SliderSection title="Recommander à nouveau" offers={againOffers} />
                            )}
                            <SliderSection title="Dernière chance" offers={lastChanceOffers} />
                            <SliderSection title="Ce soir je mange vegan" offers={veganOffers} />
                            <SliderSection title="Tendances locales" offers={localOffers} />
                            </>
                        )}
                    </section>
                </section>
            </section>
        );
    }
}

export default App;

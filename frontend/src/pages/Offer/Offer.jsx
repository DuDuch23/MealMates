import { useState,useEffect } from "react";
import { searchOfferByTitle,
        getVeganOffers,
        getOffers,
        getLastChanceOffers,
        getAgainOffers,
        getLocalOffers } from "../../service/requestApi";
import {Link} from "react-router";
import styles from "./Offer.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import SliderSection from '../../components/SliderOffers/SliderOffers';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';


function Offer(){
    const token = localStorage.getItem("token");
    const [userData, setUserData] = useState(null);
    const [pos, setPos] = useState(null);
    const [offers, setOffers] = useState([]);
    const [veganOffers, setVeganOffers] = useState([]);
    const [againOffers, setAgainOffers] = useState([]);
    const [lastChanceOffers, setLastChanceOffers] = useState([]);
    const [localOffers, setLocalOffers] = useState([]);
    const [userPos, setUserPos] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    useEffect(() => {
        if (userData) {
            localStorage.setItem("user", userData.user.id);
        }
    }, [userData]);
    
    useEffect(() => {
        if (!token) {
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

    useEffect(() => {

        // const fetchOffers = async () => {
        //     try {
        //         const data = await getOffers();
        //         if (data && data.data) {
        //             console.log("offers",data);
        //             setOffers(data.data);
        //         } else {
        //             console.log("Erreur ou offres vides");
        //         }
        //     } catch (err) {
        //         console.error('Erreur lors de la récupération des offres:', err);
        //         setOffers([]);
        //     }
        // };
    
        const fetchVeganOffers = async () => {
            try {
                const data = await getVeganOffers();
                if(data && data.data) {
                    // console.log("vegan",data);
                    setVeganOffers(data.data);
                } else {
                    // console.log("Erreur ou offres vegans vides");
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
                    // console.log("last", data);
                    setLastChanceOffers(data.data);
                } else{
                    console.log("Erreur ou offres last chance vides");
                }
            } catch (err){
                console.error('Erreur lors de la récupération des offres last chance:', err);
                setLastChanceOffers([]);
            }
        };
        const fetchAgainOffers = async () => {
            try {
                const token = localStorage.getItem('token'); // Ou autre méthode pour récupérer le JWT
                if (!token) {
                    console.error("Aucun token trouvé");
                    return;
                }
                const data = await getAgainOffers(token );
                console.log("again", data);
                if(data && data.data){
                    // console.log("again", data);
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
    
        const fetchLocalOffers = async () => {
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const data = await getLocalOffers(latitude, longitude);
                    if (data && data.data) {
                        console.log("local", data);
                        setLocalOffers(data.data);
                    } else {
                        console.log("Erreur ou offres locales vides");
                    }
                }, (err) => {
                    console.error("Erreur de géolocalisation", err);
                });
            } catch (err) {
                console.error('Erreur lors de la récupération des offres locales :', err);
                setLocalOffers([]);
            }
        };
    
        // fetchOffers();
        fetchVeganOffers();
        fetchLastChanceOffers();
        fetchLocalOffers();
    }, []);
    
    
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

    return(
    <div className={styles["container-offer"]}>
        <nav className={styles["container-offer__type"]}>
            <div className={styles["container__type-list"]}>
                <Swiper className={styles["type-offer-swiper"]} slidesPerView={4} spaceBetween={10}>
                    <SwiperSlide>
                        <img src="/img/offre/sushi.png" alt="icon de sushi" />
                        <p>Sushi</p>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/offre/burger.png" alt="" />
                        <p>Burger</p>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/offre/tarte.png" alt="" />
                        <p>Tarte</p>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/offre/produits-frais.png" alt="" />
                        <p>Produit Frais</p>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/img/offre/derniere-chance.png" alt="" />
                        <p>Derniére Chance</p>
                    </SwiperSlide>
                </Swiper>
            </div>
        </nav>
        <nav className={styles["container__filter"]}>
            <ul className={styles["container__filter-reference-list"]}>
                <li>Vegan</li>
                <li>Hight Protein</li>
                <li>Halal</li>
                <li>Low Carb</li>
            </ul>
        </nav>
        <Link id={styles["new-offer"]} key="new-offer" to={'/addOffer'}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9V19M9 14H19M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z" stroke="#F3F3F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p>Ajouter une nouvelle offre</p>
        </Link>
        <SearchBar onSearch={handleSearch} />
        <div className={styles["container-section"]}>
                {searchResults.length > 0 ? (
                    <>
                        <SliderSection title="Résultats de recherche" offers={searchResults} />
                        <SliderSection title="Recommander à nouveau" offers={againOffers} />
                        <SliderSection title="Dernière chance" offers={lastChanceOffers} />
                        <SliderSection title="Ce soir je mange vegan" offers={veganOffers} />
                        <SliderSection title="Tendances locales" offers={localOffers} />
                    </>
                ) : (
                    <>
                        <SliderSection title="Recommander à nouveau" offers={againOffers} />
                        <SliderSection title="Dernière chance" offers={lastChanceOffers} />
                        <SliderSection title="Ce soir je mange vegan" offers={veganOffers} />
                        <SliderSection title="Tendances locales" offers={localOffers} />
                    </>
                )}
        </div>
    </div>
    );
}

export default Offer;
import { useState, useEffect } from "react";
import { searchOfferByTitle,
        getVeganOffers,
        getOffers,
        getLastChanceOffers,
        getAgainOffers,
        getLocalOffers } from "../../service/requestApi";
import { Link } from "react-router";
import styles from "./Offer.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import AllCategory from "../../components/AllCategory/AllCategory";
import SliderSection from '../../components/SliderOffers/SliderOffers';
import { Swiper, SwiperSlide } from 'swiper/react';
import OffersMap from '../../components/GoogleMaps/GoogleMaps';
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";

import 'swiper/css';


function Offer(){
    const token = sessionStorage.getItem("token");
    const [userData, setUserData] = useState(null);
    const [pos, setPos] = useState(null);
    const [userPos, setUserPos] = useState(null);
    const [offers, setOffers] = useState([]);
    const [veganOffers, setVeganOffers] = useState([]);
    const [againOffers, setAgainOffers] = useState([]);
    const [lastChanceOffers, setLastChanceOffers] = useState([]);
    const [localOffers, setLocalOffers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMap, setShowMap] = useState(false);

    // Loading spinner
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [loadingVegan, setLoadingVegan] = useState(true);
    const [loadingAgain, setLoadingAgain] = useState(true);
    const [loadingLastChance, setLoadingLastChance] = useState(true);
    const [loadingLocal, setLoadingLocal] = useState(true);
    

    useEffect(() => {
        if (userData) {
            sessionStorage.setItem("user", userData.user.id);
        }
    }, [userData]);

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

        const fetchOffers = async () => {
            try {
                const data = await getOffers();
                if (data && data.data) {
                    // console.log("offers",data);
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
                setLoadingVegan(true);
                const data = await getVeganOffers();
                if(data && data.data) {
                    // console.log("vegan",data);
                    setVeganOffers(data.data);
                } else {
                    console.log("Erreur ou offres vegans vides");
                }
            } catch (err) {
                console.error('Erreur lors de la récupération des offres vegan:', err);
                setVeganOffers([]);
            } finally {
                setLoadingVegan(false);
            }
        };
    
        const fetchLastChanceOffers = async () => {
            try {
                setLoadingLastChance(true);
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
            } finally {
                setLoadingLastChance(false);
            }
        };
        const fetchAgainOffers = async () => {
            try {
                setLoadingAgain(true);
                const token = sessionStorage.getItem('token'); // Ou autre méthode pour récupérer le JWT
                if (!token) {
                    console.error("Aucun token trouvé");
                    return;
                }
                const data = await getAgainOffers(token);
                if(data && data.data){
                    // console.log("again", data);
                    setAgainOffers(data.data);
                } else{
                    console.log("Erreur ou offres again vides");
                }
            } catch (err){
                console.error('Erreur lors de la récupération des offres again :', err);
                setAgainOffers([]);
            } finally {
                setLoadingAgain(false);
            }
        };
        fetchAgainOffers();
    
        const fetchLocalOffers = async () => {
            try {
                setLoadingLocal(true);
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
            } finally {
                setLoadingLocal(false);
            }
        };
    
        fetchOffers();
        fetchVeganOffers();
        fetchLastChanceOffers();
        fetchLocalOffers();
    }, []);
    
    
    const handleSearch = async (query) => {
        try {
            setSearchQuery(query);
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

    const renderSlider = (loading, title, offers, type) => (
        loading ? (
            <SliderSection title={title}>
            {[...Array(5)].map((_, idx) => <SkeletonCard key={idx} />)}
            </SliderSection>
        ) : (
            <SliderSection title={title} offers={offers} type={type} />
        )
    );

    return(
    <section className={styles["container-offer"]}>
        {/* <nav className={styles["container-offer__type"]}>
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
        </nav> */}
        <SearchBar onSearch={handleSearch} />

        <nav className={styles["container-offer__filter"]}>
            <ul className={styles["container-offer__filter-reference-list"]}>
                {/* <AllCategory /> */}
            </ul>
        </nav>
        <div className={styles["container-offer__new-offer-show-map"]}>
            <Link className={styles["container-offer__new-offer"]} key="new-offer" to={'/addOffer'}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 9V19M9 14H19M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z" stroke="#F3F3F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>Ajouter une nouvelle offre</p>
            </Link>
            <button className={styles["container-offer__show-map"]} onClick={() => setShowMap(!showMap)}>
                <p>Afficher la carte des offres</p>
            </button>
        </div>
        {showMap && (
            <div className={styles["container-offer__map"]} style={{ height: "80vh", width: "100%", top: 0, left: 0, zIndex: 98 }}>
                <OffersMap userPos={pos} offers={offers} setUserPos={setUserPos} />
            </div>
        )}
        <div className={styles["container-offer__slider"]}>
            {searchResults.length > 0 ? (
                <>
                    <SliderSection title={`Résultats pour "${searchQuery}"`} offers={searchResults} type={searchQuery} />
                    {renderSlider(loadingAgain, "Recommander à nouveau", againOffers, "again")}
                    {renderSlider(loadingLastChance, "Dernière chance", lastChanceOffers, "dernière chance")}
                    {renderSlider(loadingVegan, "Ce soir je mange vegan", veganOffers, "vegans")}
                    {renderSlider(loadingLocal, "Tendances locales", localOffers, "locals")}
                </>
            ) : (
                <>
                    {renderSlider(loadingAgain, "Recommander à nouveau", againOffers, "again")}
                    {renderSlider(loadingLastChance, "Dernière chance", lastChanceOffers, "dernière chance")}
                    {renderSlider(loadingVegan, "Ce soir je mange vegan", veganOffers, "vegans")}
                    {renderSlider(loadingLocal, "Tendances locales", localOffers, "locals")}
                </>
            )}
        </div>
    </section>
    );
}

export default Offer;
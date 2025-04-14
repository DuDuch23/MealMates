import './Home.css';
import React from 'react';
import { useState, useEffect } from 'react';
import map from '../../assets/landing-map.png';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import Searchbar from '../../components/SearchBar/SearchBar';
import { searchOfferByTitle, getProfile, refreshToken, getVeganOffers } from '../../service/requestApi';
import logo from '../../assets/logo-mealmates.png';
import UserLocationMap from '../../components/mapGoogle';
import { jwtDecode } from 'jwt-decode';
import { Swiper, SwiperSlide } from 'swiper/react';

function App() {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);

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

  const handleSearch = async (query) => {
    try {
      const results = await searchOfferByTitle(query);
      console.log("Résultats de recherche :", results);
    } catch (error) {
      console.error("Erreur de recherche :", error);
    }
  };

  const infoUser = () => {
    if (userData) {
      return (
        <li className='button-sign-in' key="inscription">
          <Link to={`/userProfile/${userData.user.id}`}>{userData.user.firstName}</Link>
        </li>
      );
    } else {
      return (
        <>
          <li className='button-sign-in' key="inscription">
            <Link to="/inscription">Inscription</Link>
          </li>
          <li className='button-log-in' key="connexion">
            <Link to="/connexion">Se connecter</Link>
          </li>
        </>
      );
    }
  };

  // Mettre plus tard car en prod le user bug dans une condition si user est true (connecté sur la page) alors affiche, sinon la page par défaut
  const [veganOffers, setVeganOffers] = useState([]);
  useEffect(() => {
    const fetchVeganOffers = async () => {
        try {
            const data = await getVeganOffers();
            if (data && data.data) {
                setVeganOffers(data.data); 
            } else {
                console.log(data);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des offres vegan:', err);
            setVeganOffers([]);
        }
    };

    fetchVeganOffers();
  }, []);
  return (
    <section className="landing">
      {/* <div className='header-container'>
        <section className="header">
          <div className="header-left">
            <img src={logo} alt="Logo" />
            <h1>MealMates</h1>
          </div>
          <div className="header-right">
            {infoUser()}
          </div>
        </section>
        <div className='menu-mobile'>
            <Header />
        </div>
      </div> */}
      
      {token && <Searchbar onSearch={handleSearch} />}
      
      <section className="top">
        <h1>Et si on mangeait moins cher, plus respectueux de la planète ?</h1>
      </section>

      <section className="inbetween">
        <p>Luttez contre le gaspillage en achetant à d'autres particuliers, et proposez vos propres surplus alimentaires.</p>
      </section>

      <section className="bottom">
        <div className="left">
          <div className="circle"></div>
          <UserLocationMap />
        </div>

        <div className="right">
          <h1>Obtenez des offres locales, qui suivent vos offres alimentaires</h1>
          <button>M'inscrire maintenant</button>
          <div className="footer">
            <p>© Mealmates 2025</p>
          </div>
        </div>
      </section>
      <section className="vegan-offers">
        <h2>Ce soir je mange vegan</h2>
        {veganOffers.length === 0 ? (
          <p>Aucune offre végane pour le moment</p>
        ) : (
          <Swiper spaceBetween={20} slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}>
            {veganOffers.map((offer) => (
              <SwiperSlide key={offer.id}>
                <div className="offer-card">
                  <h3>{offer.product}</h3>
                  <p>{offer.description}</p>
                  <p>{offer.price} €</p>
                  <p>{offer.pickupLocation}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>
    </section>
  );
}

export default App;
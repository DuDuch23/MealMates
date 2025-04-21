import styles from './Home.module.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';
import { searchOfferByTitle, getProfile, refreshToken, getVeganOffers } from '../../service/requestApi';
import UserLocationMap from '../../components/GoogleMaps/Googlemaps';
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

//   const infoUser = () => {
//     if (userData) {
//       return (
//         <li className={styles['button-sign-in']} key="inscription">
//           <Link to={`/userProfile/${userData.user.id}`}>{userData.user.firstName}</Link>
//         </li>
//       );
//     } else {
//       return (
//         <>
//           <li className={styles['button-sign-in']} key="inscription">
//             <Link to="/inscription">Inscription</Link>
//           </li>
//           <li className={styles['button-log-in']} key="connexion">
//             <Link to="/connexion">Se connecter</Link>
//           </li>
//         </>
//       );
//     }
//   };

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

  const [offers, setOffers] = useState([]);
  useEffect(() => {
    const getOffers = async () => {
      try {
        const data = await getOffers();
        if (data && data.data) {
          setOffers(data.data);
        } else {
          console.log(data);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des offres:', err);
        setOffers([]);
      }
    };

    getOffers();
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
                  <div className={styles.bottom__left}>
                      <div className={styles.bottom__circle}></div>
                      <UserLocationMap />
                  </div>
          
                  <div className={styles.bottom__right}>
                      <h2>Obtenez des offres locales, qui suivent vos offres alimentaires</h2>
                      <button>M'inscrire maintenant</button>
                  </div>
              </section>
              <footer className={styles.footer}>
                  <p>© Mealmates 2025</p>
              </footer>
      
              <section className={styles['vegan-offers']}>
              <h2>Ce soir je mange vegan</h2>
              {veganOffers.length === 0 ? (
                  <p>Aucune offre végane pour le moment</p>
              ) : (
                  <Swiper
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                      640: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                  }}
                  >
                  {veganOffers.map((offer) => (
                      <SwiperSlide key={offer.id}>
                      <div className={styles['offer-card']}>
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
  }else{
      return(
          <section className={styles.landing}>
              <section className={styles.top}>
                  <h1>Besoin de fraîcheur ?</h1>
              </section>
              <section className={styles.search}>
                  <SearchBar onSearch={handleSearch} />
              </section>
              <section className={styles.maps}>
                  <UserLocationMap offers={offers}/>
              </section>
          </section>
      )
  }
}

export default App;

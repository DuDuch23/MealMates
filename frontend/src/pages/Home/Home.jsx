import styles from './Home.module.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import OffersMap from '../../components/GoogleMaps/GoogleMaps';
import { AiFillStar } from "react-icons/ai";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import logo from '../../assets/logo-mealmates.png';
import AutoCarousel from '../../components/AutoCarousel/AutoCarousel';

function App() {
    const [pos, setPos] = useState(null);
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");
    const navigate = useNavigate();
    
    if(token && user){
        navigate("/offer");
        console.log("Vous êtes connecté, redirection vers la page d'accueil.");
    }
    else{
        console.log("Vous n'êtes pas connecté, redirection vers la page de connexion.");
    }

  useEffect(() => {
    if (token && user) {
      navigate("/offer");
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) =>
        setPos({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => {
        console.warn("Erreur de géolocalisation :", error);
        const fallback = { lat: 48.8566, lng: 2.3522 };
        setPos(fallback);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [token, user, navigate]);

  const reviews = [
    {
      name: "Louis Dupont",
      avatar: "https://i.pravatar.cc/150?img=3",
      date: "12 juin 2025",
      text: "Super concept, j’ai réduit mes déchets et rencontré des voisins sympas.",
      stars: 5
    },
    {
      name: "Julie Martin",
      avatar: "https://i.pravatar.cc/150?img=5",
      date: "8 juin 2025",
      text: "Facile d’utilisation et très pratique pour écouler des surplus.",
      stars: 4
    },
    {
      name: "Mohamed El Amrani",
      avatar: "https://i.pravatar.cc/150?img=7",
      date: "2 juin 2025",
      text: "Je recommande à 100%, ça devrait exister depuis longtemps.",
      stars: 5
    }
  ];

  return (
    <section className={styles.landing}>
      <section className={styles.top}>
        <h1>Et si on mangeait moins cher, plus respectueux de la planète ?</h1>
      </section>

      <section className={styles.bottom}>
        <div className={styles.bottom__maps}>
        </div>
        <div className={styles.bottom__right}>
          <h2>Obtenez des offres locales, proches de chez vous</h2>
          <button onClick={() => navigate("/inscription")}>M'inscrire maintenant</button>
        </div>
      </section>

      <section className={styles.products}>
        <h2>Une vaste gamme de produits</h2>
        <AutoCarousel />
      </section>

      <section className={styles.features}>
        <h2>Pourquoi choisir Mealmates ?</h2>
        <div className={styles.features__grid}>
          <div className={styles.feature}>
            <h3>Anti-gaspillage</h3>
            <p>Réduisez le gaspillage alimentaire en vendant ou achetant des surplus locaux.</p>
          </div>
          <div className={styles.feature}>
            <h3>Communautaire</h3>
            <p>Rencontrez vos voisins et renforcez le lien social autour d'une bonne cause.</p>
          </div>
          <div className={styles.feature}>
            <h3>Économique</h3>
            <p>Faites des économies en achetant des aliments de qualité à petit prix.</p>
          </div>
        </div>
      </section>

      <section className={styles.reviews}>
        <h2>Avis de nos utilisateurs</h2>
        <div className={styles.reviews__list}>
          {reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <div className={styles.review__header}>
                <img src={review.avatar} alt={review.name} />
                <div>
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </div>
              </div>
              <p>{review.text}</p>
              <div className={styles.review__stars}>
                {[...Array(review.stars)].map((_, i) => <AiFillStar key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footer__content}>
          <div className={styles.footer__logo}>
            <img src={logo} alt="Mealmates Logo" />
            <p>Mealmates</p>
          </div>
          <div className={styles.footer__links}>
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Contact</a>
          </div>
          <div className={styles.footer__socials}>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
          <div className={styles.footer__credits}>
            <p>© Mealmates 2025 - Mangeons mieux, ensemble.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}

export default Home;

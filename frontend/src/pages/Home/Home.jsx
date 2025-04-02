import React, { useState, useEffect } from 'react';
import { getOffers } from '../../service/requestApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';
import mainImg from '../../../public/img/main-img-homePage.jpg';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

function App() {
    const [offers, setOffers] = useState([]);
    console.log(offers);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const dataOffers = await getOffers();
                console.log("Données récupérées :", dataOffers);
                setOffers(dataOffers.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des offres :", error);
            }
        };
        fetchOffers();
    }, []);

    return (
        <div className="home">
            <h1 className="home__title">
                Et si ce que l’on consommait sauverait le monde et nos économies ?
            </h1>

            <div className='first-impression'>
                <p>
                Chaque choix de consommation a un impact. Aujourd’hui, nous avons le pouvoir d’adopter une approche plus responsable, bénéfique à la fois pour notre budget et pour l’environnement. En privilégiant des produits issus de circuits courts, du recyclage ou encore de l’économie circulaire, nous réduisons le gaspillage et favorisons une production plus durable. 
                </p>
                <img src={mainImg} alt="Main banner" />
            </div>

            <h2 id='second-impression'>Un appercu des offres de notre communiqué :</h2>
            <Swiper
                className="home__swiper"
                spaceBetween={50}
                slidesPerView={1.2}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    769: { slidesPerView: 3.5 },
                }}
            >
                {offers.map((offer) => (
                    <SwiperSlide key={offer.id} className="card">
                        <div className="card__images-container">
                            <Swiper spaceBetween={50} slidesPerView={1} pagination={{ clickable: true }} navigation>
                                {offer.photosNameOffer?.map((photo, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={`${BASE_URL}${UPLOADS_URL}${photo}`}
                                            alt={`Photo ${index + 1}`}
                                            className="card-image"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        <h2>{offer.title}</h2>
                        <p>{offer.description}</p>
                        <p className="price">{offer.price} €</p>
                        <button className="btn">Acheter</button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default App;

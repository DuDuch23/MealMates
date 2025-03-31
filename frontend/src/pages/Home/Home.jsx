import React, { use } from 'react';
// import './Home.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { getOffers } from '../../service/requestApi';
import { Swiper, SwiperSlide } from 'swiper/react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL;

function App(){
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        getOffers().then((dataOffers) => {
            console.log("Données récupérées :", dataOffers);
            setOffers(dataOffers.data)}
        );
    }, []);

    return(
        <>
        <section className="home">
            <h1>Et si ce que l’on consommait sauverai le monde et nos économies ?</h1>

            <Swiper
                spaceBetween={50}
                slidesPerView={1.2}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                breakpoints={{
                    768: {
                    slidesPerView: 2,  
                    },
                    769: {
                    slidesPerView: 4,
                    },
                }}>
                {offers.map((offer) => (
                    <a key={offer.id} href="" className='card'>
                        <SwiperSlide className='card__container'>
                            <div className='card__images-container'>
                                <Swiper
                                spaceBetween={50}
                                slidesPerView={1}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}
                                >
                                    {offer.photosNameOffer?.map((photo, index) => (
                                        <SwiperSlide className='card'>
                                            <img 
                                                key={index} 
                                                src={`${BASE_URL}${UPLOADS_URL}${photo}`} 
                                                alt={`Photo ${index + 1}`} 
                                                className='card-image'
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                            <h2>{offer.title}</h2>
                            <p>{offer.description}</p>
                            <p className='price'>{offer.price} €</p>
                            <button className='btn'>Acheter</button>
                        </SwiperSlide>
                    </a>
                ))}
            </Swiper>
        </section>
        </>
    )
}

export default App;
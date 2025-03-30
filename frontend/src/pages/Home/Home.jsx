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
            slidesPerView={3}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            >
                
                {offers.map((offer) => (
                    <a href="">
                        <SwiperSlide key={offer.id} className='card'>
                            <div className='card-images'>
                                {offer.photosNameOffer?.map((photo, index) => (
                                    <img 
                                        key={index} 
                                        src={`${BASE_URL}${UPLOADS_URL}${photo}`} 
                                        alt={`Photo ${index + 1}`} 
                                        className='card-image'
                                    />
                                ))}
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
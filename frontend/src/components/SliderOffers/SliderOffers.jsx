import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from "react-router";
import styles from "./SliderOffers.module.scss";
import React from 'react';
import CardOffer from '../CardOffer/CardOffer';

export default function SliderSection({ title, offers = [], type, children }) {

  return (
    <section className={styles['slider-offer']}>
      <div className={styles['slider-offer__header']}>
        <h2>{title}</h2>
        {type && (
          <Link to={`/offers/${type}`} className={styles["slider-section__link"]}>
            Voir toutes les offres {type}
          </Link>
        )}
      </div>

      <Swiper
        spaceBetween={20}
        slidesPerView={1.25}
        breakpoints={{ 
          640: { slidesPerView: 1.25 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 } 
        }}
      >
        {children ? (
          React.Children.map(children, (child, idx) => (
            <SwiperSlide key={idx}>{child}</SwiperSlide>
          ))
        ) : (
          offers.map(o => (
            <SwiperSlide key={o.id}>
              <CardOffer offer={o} />
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </section>
  );
}
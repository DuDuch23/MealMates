import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from "react-router";
import styles from "./SliderOffers.module.css";

export default function SliderSection({ title, offers = [], type }) {
  if (!offers.length) return null;

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

      <Swiper spaceBetween={20}
              slidesPerView={1}
              breakpoints={{ 
                640:{slidesPerView:1},
                768:{slidesPerView:2},
                1024:{slidesPerView:3} 
                }}>

        {offers.map(o => (
          <SwiperSlide key={o.id}>
            <div>
              <h3>{o.product}</h3>
              <p>{o.description}</p>
              <p>{o.price} €</p>
              <p>{o.pickupLocation}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
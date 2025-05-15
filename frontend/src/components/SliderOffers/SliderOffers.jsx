import { Swiper, SwiperSlide } from 'swiper/react';
import {Link} from "react-router";
import styles from "./SliderOffers.module.scss";

export default function SliderSection({ title, offers = [], type }) {
  if (!offers.length) return null;
  const uploadsBaseUrl = import.meta.env.VITE_UPLOADS_URL;

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
              slidesPerView={1.25}
              breakpoints={{ 
                640:{slidesPerView:1.25},
                768:{slidesPerView:2},
                1024:{slidesPerView:3} 
                }}>

        {offers.map(o => (
          <SwiperSlide key={o.id}>
            <Link to={`/offer/${o.id}`} className={styles["slider-offer__link"]}>
              <div className={styles["slider-offer__card"]}>
                <div className={styles["slider-offer__info-top"]}>
                  {o.images?.length > 0 && (
                    <img
                      className={styles["slider-offer__image"]}
                      src={`${uploadsBaseUrl}/${o.images[0].link}`}
                      alt={o.product}
                    />
                  )}
                </div>
                <div className={styles["slider-offer__info-middle"]}>
                  <h3>{o.product}</h3>
                  {
                    o.categories?.length > 0 && (
                      <div className={styles["slider-offer__info-middle__categories"]}>
                        {o.categories.map(c => 
                          <p key={c.id}>{c.name}</p>
                        )}
                      </div>
                    )
                  }
                  <p>{o.price}€</p>
                </div>
                <div className={styles["slider-offer__info-seller"]}>
                  <div className={styles["slider-offer__info-seller__seller"]}>
                    <p>
                      {o.seller.firstName}
                    </p>
                    <p>
                      {o.seller.lastName}
                    </p>
                  </div>
                  {/* <p>{o.seller.ratingsReceived}</p> */}
                  <p>4.75/5</p>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
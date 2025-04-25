import { Swiper, SwiperSlide } from 'swiper/react';

export default function SliderSection({ title, offers = [] }) {
  if (!offers.length) return null;

  return (
    <section style={{ marginBottom: '3rem' }}>
      <h2>{title}</h2>

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
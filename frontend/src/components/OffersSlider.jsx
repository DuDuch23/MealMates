import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2"
import OfferCard from "./OfferCard"
import "swiper/css"
import "swiper/css/navigation"

const arrowButtonClass =
  "flex size-9 cursor-pointer items-center justify-center rounded-full bg-surface-raised text-white shadow-md transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-30"

/**
 * Carrousel horizontal d'offres (Swiper). Accepte soit une liste `offers`,
 * soit des enfants arbitraires (ex. cartes squelettes de chargement).
 */
export default function OffersSlider({ title, offers = [], children }) {
  const [prevButton, setPrevButton] = useState(null)
  const [nextButton, setNextButton] = useState(null)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const slides = children
    ? React.Children.toArray(children)
    : offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)

  const updateEdges = (swiper) => {
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">{title}</h2>

        <div className="flex shrink-0 gap-2">
          <button
            ref={setPrevButton}
            type="button"
            aria-label="Offres précédentes"
            disabled={isBeginning}
            className={arrowButtonClass}
          >
            <HiChevronLeft className="size-5" />
          </button>
          <button
            ref={setNextButton}
            type="button"
            aria-label="Offres suivantes"
            disabled={isEnd}
            className={arrowButtonClass}
          >
            <HiChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {prevButton && nextButton && (
        <Swiper
          modules={[Navigation]}
          navigation={{ prevEl: prevButton, nextEl: nextButton }}
          onSwiper={updateEdges}
          onSlideChange={updateEdges}
          onResize={updateEdges}
          spaceBetween={20}
          slidesPerView={1.15}
          grabCursor
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
          }}
          className="!pb-2"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.key ?? index} className="h-auto">
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  )
}

import styles from "./AutoCarousel.module.css";

const images = [
  "../../assets/carousel/background-form.png",
  "../../assets/carousel/background-form.png",
  "../../assets/carousel/background-form.png",
  "../../assets/carousel/background-form.png",
];

export default function AutoCarouselCarousel() {
  // On duplique les images pour une boucle infinie
  const carouselImages = [...images, ...images];

  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {carouselImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Panier ${index % images.length + 1}`}
            className={styles.image}
          />
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import styles from "./AutoCarousel.module.css";

export default function AutoCarousel() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
        const urls = data.map((img) => img.url);
        setImages([...urls, ...urls]);
      })
      .catch((err) => console.error("Erreur chargement des images :", err));
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Image ${index % (images.length / 2) + 1}`}
            className={styles.image}
          />
        ))}
      </div>
    </div>
  );
}

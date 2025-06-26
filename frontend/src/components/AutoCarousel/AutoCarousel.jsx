import { useEffect, useState } from "react";
import styles from "./AutoCarousel.module.css";

export default function AutoCarousel() {
  const [images, setImages] = useState([]);

  useEffect(() => {
<<<<<<<<< Temporary merge branch 1
    fetch("/api/images")
=========
    fetch("https://localhost:8000/api/images")
>>>>>>>>> Temporary merge branch 2
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data) => {
<<<<<<<<< Temporary merge branch 1
        const urls = data.map((img) => img.url);
        setImages([...urls, ...urls]);
=========
        const urls = data.map((img) => `https://localhost:8000${img.url}`);
        setImages([...urls, ...urls]); 
>>>>>>>>> Temporary merge branch 2
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

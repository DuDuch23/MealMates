import { useEffect, useState } from "react";
import { getImageHomePage } from "../../service/requestApi";
import styles from "./AutoCarousel.module.css";

export default function AutoCarousel() {
  const [images, setImages] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const requestImage = async () => {
      const res = await getImageHomePage();
      setImages(res);
    };
    requestImage();
  }, []);

  const carouselImage = () => {
    return images.map((src, index) => {
      console.log("Image URL:", src);
      return (
        <img
          key={index}
          src={`${API_BASE_URL}${src.url}`}
          alt={`Image ${index + 1}`}
          className={styles.image}
        />
      );
    });
  };

  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
        {carouselImage()}
      </div>
    </div>
  );
}

import { useRef, useState, useEffect } from "react";
import styles from "./addOffer.module.scss";

function AddOffer() {
  const [part1, setPart1] = useState("part-1");
  const [part2, setPart2] = useState("part-2");
  const [part3, setPart3] = useState("part-3");

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectOption, setSelectOption] = useState("");

  console.log(imagePreviews[0]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    const files = Array.from(event.target.files);
    const newImages = [...images, ...files];
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages(newImages);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSlide = () => {
    setPart1("part-1 slide");
    setPart2("part-2 slide");
  };

  const handleReverseSlide = () => {
    setPart1("part-1 reverse-slide");
    setPart2("part-2 reverse-slide");
  };

  const handleOption = (event) => {
    setSelectOption(event.target.value);
  };

  return (
    // className={styles["part-form"]
    <form id="form" action="#">
      
      {/* part 1 */}
      <div id={styles["part-1"]}>

        <div className={styles["photo-input"]}>
          <svg
            onClick={handleImageClick}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            style={{ cursor: "pointer" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
            />
          </svg>

          <input
            ref={fileInputRef}
            name="photo"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div className={styles["photo-slider"]}>
            {imagePreviews.length > 0 && (
                imagePreviews.map((preview, index) => (
                  <img key={preview + index} src={preview} alt="Aperçu" />
                ))
            )}
          </div>
        </div>

        <div className={styles["titre-input"]}>
          <input type="text" name="titre" placeholder="titre du produit" />
        </div>

        <div className={styles["type-input"]}>
          <input type="text" name="description" placeholder="type du produit"/>
        </div>

        <div className={styles["description-input"]}>
          <input type="text" name="description" placeholder="description du produit"/>
        </div>

        <p className={styles["button-check"]} onClick={handleSlide}>
          Continuer -{">"}
        </p>

      </div>

      {/* part 2 */}
      <div className={styles["part-form"]}>

        {imagePreviews.length > 0 && (
          <img id={styles["photo-first"]} key={0} src={imagePreviews[0]} alt="Aperçu" />
        )}

        <div className={styles["quantite"]}>
          <input type="text" name="quantity" placeholder="quantité disponible" />
        </div>

        <div className={styles["date-final"]}>
          <input type="text" name="final-date" placeholder="date consommation recommadé" />
        </div>

        <div className={styles["prix"]}>
          
          <select name="" id=""></select>
          <input type="text" name="final-date" placeholder="date consommation recommadé" />
        </div>

        <p className={styles["button-check"]} onClick={handleSlide}>
          Continuer -{">"}
        </p>
      </div>

      {/* part 3 */}
      <div className={styles["part-form"]}>

        <div className={styles["quantite"]}>
          <input type="text" name="quantity" placeholder="quantité disponible" />
        </div>

        <div className={styles["date-final"]}>
          
        </div>

        <div className={styles["prix"]}>
          
          <select name="" id=""></select>
          <input type="text" name="final-date" placeholder="date consommation recommadé" />
        </div>

        <button className={styles["button-check"]} onClick={handleSlide}>
          Continuer -{">"}
        </button>
      </div>
    </form>
  );
}

export default AddOffer;

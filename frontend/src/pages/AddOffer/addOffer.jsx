import { useRef, useState } from "react";
import randomId from "../../service/randomKey";
import "./addOffer.scss";

function AddOffer() {
  // Fonctionnement du formulaire
  const [part1, setPart1] = useState("part-1");
  const [part2, setPart2] = useState("part-2");

  // Informations du formulaire
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectOption, setSelectOption] = useState("");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...images, ...files];
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages(newImages);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSlide = () => {
    setPart1("part-1 slide");
    setPart2("part-2 slide");
  };

  const handleReverseSlide = () => {
    setPart1("part-1 reverse-slide");
    setPart2("part-2 reverse-slide");
  }

  const handleOption = (event) => {
    setSelectOption(event.target.value);
  };

  return (
    <>
      <form action="#">
        <div className={part1}>
          <div className="photo-input">
            <label htmlFor="photo"></label>

            <svg onClick={handleImageClick} xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" 
                strokeWidth={1.5} stroke="currentColor" 
                className="size-6" style={{ cursor: "pointer" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
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

            <div className="photo-slider">
              {imagePreviews.length > 0 && (
                <div className="container-image-offer">
                  {imagePreviews.map((preview) => (
                    <img key={randomId()} src={preview} alt="Aperçu" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="titre-input">
            <label htmlFor="titre">Ajouter un titre à votre annonce :</label>
            <input type="text" name="titre" />
          </div>

          <div className="description-input">
            <label htmlFor="description">Ajouter une description :</label>
            <input type="text" name="description" />
          </div>

          <p id="button-check" onClick={handleSlide}>
            La suite -{">"}
          </p>
        </div>

        <div className={part2}>
            <p id="button-return" onClick={handleReverseSlide}>{"<"}- Un petit retour</p>

            <div className="disponibilite">
              <h3>Disponibilité de la collecte :</h3>
              <ul>
                <li>
                  <label>Début :</label>
                  <input type="date" name="startDate" />
                </li>
                <li>
                  <label>Fin :</label>
                  <input type="date" name="endDate" />
                </li>
              </ul>
            </div>

            <div className="date-limit">
              <label htmlFor="limit-date">Date limite de consommation :</label>
              <input type="date" name="limit-date" />
            </div>

            <div className="quantite">
              <label htmlFor="quantite">Quantité disponible :</label>
              <input type="text" name="quantite" />
            </div>

            <div className="prix-option">
              <h3>Mes options :</h3>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="prix"
                  checked={selectOption === "prix"}
                  onChange={handleOption}
                />
                Prix
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="gratuit"
                  checked={selectOption === "gratuit"}
                  onChange={handleOption}
                />
                Gratuit
              </label>
              <label>
                <input
                  type="radio"
                  name="option"
                  value="prix-dynamique"
                  checked={selectOption === "prix-dynamique"}
                  onChange={handleOption}
                />
                Prix dynamique
              </label>
          </div>

          <button>Valider</button>
        </div>
      </form>
    </>
  );
}

export default AddOffer;

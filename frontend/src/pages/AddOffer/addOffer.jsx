import { useState } from "react";
import randomId from "../../service/randomKey";
import "./addOffer.scss";

function AddOffer() {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [part1, setPart1] = useState("part-1");
  const [part2, setPart2] = useState("part-2");

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

  return (
    <>
      <form action="#">
        <div className={part1}>
          <div className="photo-input">
            <label htmlFor="photo"></label>
            <input
              name="photo"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
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
            <label htmlFor="description">Ajouter une description</label>
            <input type="text" name="description" />
          </div>

          <p id="button-check" onClick={handleSlide}>
            La suite -{">"}
          </p>
        </div>

        <div className={part2}>
          <div className="disponibilité">
            <label>Disponibilité de la collecte :</label>
            <ul>
              <li>
                <input type="date" name="startDate" />
              </li>
              <li>
                <input type="date" name="endDate" />
              </li>
            </ul>
          </div>

          <div className="date-limit">
            <label htmlFor="limit-date">Date limite de consommation :</label>
            <input type="text" name="limit-date" />
          </div>

          <div className="quantite">
            <label htmlFor="quantite">Quantité disponible</label>
            <input type="text" name="quantite" />
          </div>

          <div className="prix-option">
            <label htmlFor="option-prix">Mes options :</label>
            <input type="checkbox" />
          </div>
        </div>
      </form>
    </>
  );
}

export default AddOffer;

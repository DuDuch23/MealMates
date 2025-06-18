import { useRef, useState } from "react";
import randomId from "../../service/randomKey";
import styles from "./addOffer.module.css";
import { geocodeLocation, newOffer } from "../../service/requestApi"; // adapte le chemin si besoin
import AllCategories from "../../components/AllCategory/AllCategory";


function AddOffer() {
  const [formData, setFormData] = useState({
    product: "",
    description: "",
    quantity: 1,
    startDate: "",
    endDate: "",
    expirationDate: "",
    option: "prix",
    price: "",
    pickupLocation: "",
    isRecurring: false,
    isVegan: false,
    latitude: null,
    longitude: null,
    categories: [],
    availableSlots: [],
  });

  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectOption, setSelectOption] = useState(formData.option);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState({});
  const [addressNotFound, setAddressNotFound] = useState(false);

  const validateForm = () => {
    const newError = {};
    if (!formData.product) newError.product = "Titre requis";
    if (!formData.description) newError.description = "Description requise";
    if (!formData.startDate) newError.startDate = "Date de début requise";
    if (!formData.endDate) newError.endDate = "Date de fin requise";
    if (!formData.expirationDate) newError.expirationDate = "Date limite requise";
    if (!formData.quantity || isNaN(formData.quantity)) newError.quantity = "Quantité invalide";
    if (formData.option === "prix" && (!formData.price || isNaN(formData.price))) newError.price = "Prix requis";
    if (!formData.pickupLocation) newError.pickupLocation = "Adresse requise";
    if (!formData.latitude || !formData.longitude) newError.pickupLocation = "Adresse introuvable";
    if (formData.categories.length === 0) newError.categories = "Sélectionner au moins une catégorie";
    if (formData.availableSlots.length === 0) newError.availableSlots = "Ajouter au moins un créneau";

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "categories") {
          value.forEach((id) => data.append("categories[]", id));
        } else if (key === "availableSlots") {
          data.append("availableSlots", JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });
      images.forEach((image) => 
        data.append("photos_offer[]", image));
      try{
        await newOffer(data, true);
      } catch(error){
        console.error("Erreur lors de la soumission de l'offre :", error);
      }
    }
    else{
      console.error("Formulaire invalide :", validateForm());
    }
  };
  
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleCategoryChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter((id) => id !== value)
        : [...prev.categories, value],
    }));
  };

  const handleAddSlot = () => {
    const time = prompt("Ajouter un créneau horaire (ex: 10h-12h)");
    if (time) {
      setFormData((prev) => ({
        ...prev,
        availableSlots: [...prev.availableSlots, time],
      }));
    }
  };

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData((prev) => ({ ...prev, pickupLocation: address }));
    setAddressNotFound(false);

    try {
      const coords = await geocodeLocation(address);
      if (coords?.lat && coords?.lng) {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng,
        }));
        setAddressNotFound(false);
      } else {
        return (
          <p>Address introuvable</p>
        );
      }
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        latitude: null,
        longitude: null,
      }));
      setAddressNotFound(true);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles["photo-input"]}>
          <label htmlFor="photo"></label>

          <svg
            onClick={() => fileInputRef.current.click()}
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
            name="photos_offer[]"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          <div className={styles["photo-slider"]}>
            {imagePreviews.length > 0 && (
              <div className={styles["container-image-offer"]}>
                {imagePreviews.map((preview) => (
                  <img key={randomId()} src={preview} alt="Aperçu" />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles["container-inputs"]}>
          <label htmlFor="product">Produit</label>
          <input type="text"
          name="product"
          value={formData.product}
          onChange={(e) => { 
            setFormData({ ...formData, product: e.target.value });
          }} />
          {error.product && <p className={styles.error}>{error.product}</p>}
        </div>

        <div className={styles["container-inputs"]}>
          <label htmlFor="description">Description</label>
          <input type="text"
          name="description"
          value={formData.description}
          onChange={(e) => { 
            setFormData({ ...formData, description: e.target.value });
          }} />
          {error.description && <p className={styles.error}>{error.description}</p>}
        </div>


        <div>
          <div className={styles.disponibilite}>
            <div className={styles["container-inputs"]}>
              <label>Début :</label>
              <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={(e) => { 
                setFormData({ ...formData, startDate: e.target.value });
              }} />
              {error.startDate && <p className={styles.error}>{error.startDate}</p>}
            </div>
            <div className={styles["container-inputs"]}>
              <label>Fin :</label>
              <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={(e) => { 
                setFormData({ ...formData, endDate: e.target.value });
              }} />
              {error.endDate && <p className={styles.error}>{error.endDate}</p>}
            </div>
          </div>

          <div className={styles["container-inputs"]}>
            <label htmlFor="expirationDate">Date limite de consommation :</label>
            <input
            type="date"
            name="expirationDate" 
            value={formData.expirationDate}
            onChange={(e) => { 
              setFormData({ ...formData, expirationDate: e.target.value });
            }} />
            {error.expirationDate && <p className={styles.error}>{error.expirationDate}</p>}
          </div>

          <div className={styles["container-inputs"]}>
            <label htmlFor="quantite">Quantité disponible :</label>
            <input
            type="text"
            name="quantite"
            value={formData.quantity}
            onChange={(e) => { 
              setFormData({ ...formData, quantity: e.target.value });
            }} />
            {error.quantity && <p className={styles.error}>{error.quantity}</p>}
          </div>

          <div className={styles["container-inputs"]}>
            <label htmlFor="pickupLocation">Localisation :</label>
            <input
              type="text"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleAddressChange}
            />
            {error.pickupLocation && <p className={styles.error}>{error.pickupLocation}</p>}
            {addressNotFound && <p className={styles.error}>Adresse introuvable.</p>}
          </div>

          <div className={styles["container-inputs"]}>
            <label htmlFor="isRecurring">Récurrent :</label>
            <select
              value={selectOption}
              onChange={(e) => {
                const value = e.target.value;
                setSelectOption(value);
                setFormData({ ...formData, option: value });
              }}
            >
              <option value="prix">Prix</option>
              <option value="gratuit">Gratuit</option>
              <option value="prix-dynamique">Prix dynamique</option>
            </select>

            {selectOption === "prix" && (
              <>
                <input
                  type="number"
                  value={formData.price}
                  placeholder="Prix"
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {error.price && <p className={styles.error}>{error.price}</p>}
              </>
            )}
          </div>

            <div className={styles["container-inputs"]}>
              <label>Catégorie(s) :</label>
              <AllCategories
                value={formData.categories}
                onChange={(cats) =>
                  setFormData((prev) => ({ ...prev, categories: cats }))
                }
              />
            </div>
            {error.categories && <p className={styles.error}>{error.categories}</p>}

            <div className={styles["container-inputs"]}>
              <button type="button" onClick={handleAddSlot}>
                Ajouter un créneau
              </button>
              <ul>
                {formData.availableSlots.map((slot, idx) => (
                  <li key={idx}>{slot}</li>
                ))}
              </ul>
              {error.availableSlots && <p className={styles.error}>{error.availableSlots}</p>}
            </div>

          <button type="submit">Valider</button>
        </div>
      </form>
    </div>
  );
}

export default AddOffer;
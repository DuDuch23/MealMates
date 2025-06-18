import { useRef, useState, useEffect } from "react";
import randomId from "../../service/randomKey";
import styles from "./addOffer.module.css";
import { geocodeLocation, newOffer } from "../../service/requestApi";
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
  const [error, setError] = useState({});
  const [addressNotFound, setAddressNotFound] = useState(false);

  const validateForm = () => {
    const newError = {};
    if (!formData.product) newError.product = "Titre requis";
    // (Other validations here...)
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

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
    images.forEach((image) => data.append("photos_offer[]", image));

    try {
      await newOffer(data, true);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'offre :", error);
    }
  };

  const handleImageChange = (event) => {
    event.preventDefault();
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setFormData((prev) => ({ ...prev, pickupLocation: address }));
    try {
      const coords = await geocodeLocation(address);
      setFormData((prev) => ({
        ...prev,
        latitude: coords.lat,
        longitude: coords.lng,
      }));
      setAddressNotFound(false);
    } catch {
      setAddressNotFound(true);
    }
  };

  // ...return JSX same as in preprod version

  return (
    <form onSubmit={handleSubmit}>
      {/* image uploader */}
      {/* fields for product, description, dates, quantity, price, address, categories */}
      {/* AllCategories + addSlot */}
      {/* error display + submit button */}
    </form>
  );
}

export default AddOffer;

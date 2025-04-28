import React, { useState } from 'react';
import { newOffer } from '../../service/requestApi';
import { useNavigate } from 'react-router';

function CreateOffer() {
    const [product, setProduct] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [expirationDate, setExpirationDate] = useState('');
    const [price, setPrice] = useState('');
    const [isDonation, setIsDonation] = useState(false);
    const [pickupLocation, setPickupLocation] = useState('');
    const [availableSlots, setAvailableSlots] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [photos_offer, setPhotosOffer] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        switch (name) {
            case 'product':
                setProduct(value);
                break;
            case 'description':
                setDescription(value);
                break;
            case 'quantity':
                setQuantity(Number(value));
                break;
            case 'expirationDate':
                setExpirationDate(value);
                break;
            case 'price':
                setPrice(value);
                break;
            case 'isDonation':
                setIsDonation(checked);
                break;
            case 'pickupLocation':
                setPickupLocation(value);
                break;
            case 'availableSlots':
                setAvailableSlots(value);
                break;
            case 'isRecurring':
                setIsRecurring(checked);
                break;
            default:
                break;
        }
    };

    const handleFileChange = (e) => {
        setPhotosOffer([...e.target.files]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            setError(null);
    
            if (!product || !description || !quantity || !expirationDate) {
                setError("Le produit, la description, la quantité et la date d'expiration sont requis.");
                return;
            }
    
            const formData = new FormData();
            formData.append('product', product);
            formData.append('description', description);
            formData.append('quantity', quantity);
            formData.append('expirationDate', expirationDate);
            formData.append('price', price);
            formData.append('isDonation', isDonation);
            formData.append('pickupLocation', pickupLocation);
            formData.append('availableSlots', availableSlots);
            formData.append('isRecurring', isRecurring);
    
            // Ajouter toutes les photos
            photos_offer.forEach((file) => {
                formData.append('photos_offer[]', file);
            });
    
            const response = await newOffer(formData, true);
    
            setIsSuccess(true);
            setIsFormValid(true);
            setData(response);
    
            // navigate('/'); // après succès
        } catch (error) {
            console.error("Erreur lors de la création de l'offre : ", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="product" placeholder="Produit" onChange={handleChange} required />
            <textarea name="description" placeholder="Description" onChange={handleChange} required />
            <input type="number" name="quantity" placeholder="Quantité" min="1" onChange={handleChange} required />
            <input type="date" name="expirationDate" onChange={handleChange} required />
            <input type="number" name="price" placeholder="Prix (€)" step="0.01" onChange={handleChange} />
            <label>
                <input type="checkbox" name="isDonation" onChange={handleChange} />
                C'est un don
            </label>
            <input type="text" name="pickupLocation" placeholder="Lieu de collecte" onChange={handleChange} required />
            <input type="text" name="availableSlots" placeholder="Disponibilité (ex: Lundi 18h-20h)" onChange={handleChange} />
            <label>
                <input type="checkbox" name="isRecurring" onChange={handleChange} />
                Publication récurrente
            </label>
            <input type="file" name="photos_offer" multiple onChange={handleFileChange} />
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Publication en cours..." : "Publier l'offre"}
            </button>
        </form>
    );
}

export default CreateOffer;

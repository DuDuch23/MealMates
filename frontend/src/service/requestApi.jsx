import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from "./api";
import { deleteUserIndexDB } from './indexDB';

const token = sessionStorage.getItem("token");

export async function geoCoding(location) {
    try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAP;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
    } catch (error) {
        console.error("Erreur API :", error);
        throw new Error("Aucune coordonnée trouvée.");
    }
}

// Mettre à jour le token depuis sessionStorage
export async function refreshToken(navigate) {
    const token = sessionStorage.getItem("token");
    const expiration = sessionStorage.getItem("token_expiration");
  
    if (!token || !expiration || Date.now() >= parseInt(expiration, 10)) {
      console.warn("Token expiré ou absent.");
      sessionStorage.clear();
      indexedDB.deleteDatabase("mealmates");
      navigate("/connexion");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expiré");
      }
    } catch (e) {
      sessionStorage.clear();
      indexedDB.deleteDatabase("mealmates");
      navigate("/connexion");
    }
}

export async function logIn({ email, password }) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        console.log(response);

        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

export async function newUser({ email, password, confirmPassword, firstName, lastName }) {
    try {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const response = await fetch(`${API_BASE_URL}/api/user/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                password_confirm: confirmPassword,
                firstName: firstName,
                lastName: lastName,
            }),
        });

        await response.json();
        const token = await logIn({ email, password });
        sessionStorage.setItem("token",token.token);
        await getProfile({email});

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// User
export async function getUser({ user}) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/get`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: user }),
        });

        return await response.json();

    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
}

export async function editUser({ userData}) {
    try {
        const body = {
            id: userData.userId,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            iconUser: userData.idIcon,
        };

        if (userData.password) {
            body.password = userData.password;
            body.password_confirm = userData.confirmPassword;
        }

        const response = await fetch(`${API_BASE_URL}/api/user/edit`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/delete/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

export async function getProfile({ email, token }) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

export async function logOut({id}) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/logout`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            console.log("Déconnexion réussie");
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    deleteUserIndexDB(id);
}

// Chat
export async function getAllChat(id) {
    const token = sessionStorage.getItem("token");
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/get/all`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                { 
                    "id": id
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    } 
}

export async function getPolling({chat,lastMessage}){
    if(!lastMessage){
        lastMessage = "0000-00-00 00:00:00";
    }
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/polling/data`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                { 
                    "chat": chat,
                    'lastMessage': lastMessage
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    } 
}

export async function getChat({userId,chat}){
    console.log({userId,chat});
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/get`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                { 
                    'id': userId,
                    'chat': chat,
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    }
}

export async function sendMessage({user,chat,message}){
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/send/message`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    'user': user,
                    'chat': chat,
                    'content': message, 
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    }
}

// Offer

export async function getOfferId(id){
    try{
        const response = await fetch(`${API_BASE_URL}/api/offers/get/${id}`,{
            method: 'GET',
            headers:{
                accept: 'application/json'
            },
        });
        return await response.json();
    }catch(error){
        console.error(err);
        return { result: [] };
    }
}

export async function getOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getVeganOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/vegan?limit=10&offset=0`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getLocalOffers(lat, lng, radius = 5) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/local?lat=${lat}&lng=${lng}&radius=${radius}`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getLastChanceOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/last-chance`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getAgainOffers(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/again`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization:`Bearer ${token}`
            },
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getOfferBySeller(id){
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/get/seller`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "id": id }),
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function searchOfferByTitle(title) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keyword: title }),
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

export async function newOffer(data, isFormData = false) {
    try {
        // Envoi des données sous FormData sans utiliser JSON.stringify
        const response = await fetch(`${API_BASE_URL}/api/offers/new`, {
            method: "POST",
            body: data, // Ne pas utiliser JSON.stringify ici pour FormData
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                // Pas besoin de Content-Type avec FormData
            },
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erreur lors de la création de l'offre.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

export async function geocodeLocation(location) {
    try{
        const apiKey = import.meta.env.VITE_GEOCODING_API;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }
    } catch(error) {
        console.error("Erreur API :", error);
        // throw new Error("Aucune coordonnée trouvée.");
        return { result: [] };
    }
}

export async function fetchFilteredOffers(filters) {
    try{
        const response = await fetch(`${API_BASE_URL}/api/offers/filter`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
            credentials: "include",
        });

        return await response.json();
    } catch(error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
};

export async function getCategory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/category`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getOfferById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

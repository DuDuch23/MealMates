import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router";
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

export async function getValidToken() {
    let token = sessionStorage.getItem("token");
    if (!token) return null;

    try {
        const infoToken = jwtDecode(token);
        const now = Date.now() / 1000;

        if (infoToken.exp < now) {
            // Token expiré, on tente le refresh
            const newToken = await getNewAccessToken();
            return newToken;
        }

        return token; // toujours valide
    } catch (e) {
        console.error("Token invalide :", e);
        return await getNewAccessToken();
    }
}

export async function getImageHomePage(){
    try {
        const url = `${API_BASE_URL}/api/images`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API logIn :", error);
        throw error;
    }
}


// Mettre à jour le token depuis sessionStorage
export async function refreshToken(navigate) {
    const token = sessionStorage.getItem("token");
    const infoToken = jwtDecode(token);
    const now = Date.now() / 1000;

    if (infoToken.exp < now) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        return false; 
    }

    return true; 
}


export async function logIn({ email, password }) {
    try {
        const url = `${API_BASE_URL}/api/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        // console.log(response);

        return await response.json();
    } catch (error) {
        console.error("Erreur API logIn :", error);
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

export async function getUser({ user }) {
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

export async function getTokenSSo({token}){
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/ssoUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API:", error);
        throw error;
    }
}

// connexion sso avec google
export async function getSSO() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/sso`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: Impossible de récupérer les infos SSO`);
    }

    const ssoData = await response.json();
    sessionStorage.setItem("user", JSON.stringify(ssoData));

    return ssoData;
    }catch (error) {
    console.error("Erreur API getSSOInfoFromApi :", error);
    return null;
  }
}

export async function editUser({ userData }) {
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

        const v_token = await getValidToken();
        console.log(v_token);
        const response = await fetch(`${API_BASE_URL}/api/user/edit`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${v_token}`,
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
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/user/delete/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id }),
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
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error(`Erreur ${response.status} : accès non autorisé`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur API getProfile :", error);
        throw error;
    }
}

export async function logOut({id}) {
    sessionStorage.removeItem("token_expiration");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    deleteUserIndexDB(id);
}

// Chat
export async function createChat({client, offer, seller}){
    // console.log(client.id, offer, seller);
    const token = sessionStorage.getItem("token");
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/create`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                { 
                    "seller": seller,
                    "client": client.id,
                    "offer": offer
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    } 
}

export async function getInfoChat({id}){
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/get/${id}`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                { 
                    "id": id,
                }
            ),
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    } 
}

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

export async function sendMessageQr({userId,chat,message}){
    console.log(userId,chat,message);
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/send/message/qr`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    'user': userId,
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

export async function sendMessage({userId,chat,message}){
    try{
        const response = await fetch(`${API_BASE_URL}/api/chat/send/message`,{
            method: 'POST',
            headers:{
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(
                {
                    'user': userId,
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

export async function generateStripeLink({chat}){
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/${chat}/create-stripe`, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const stripeUrl = data.url;

        const res = {
            data : data,
            url : stripeUrl
        };
        return res;

    } catch (error) {
      console.error('Erreur lors de la création du lien Stripe :', error);
    }
}

// Offer
export async function getOfferSingle(id){
    try{
        const response = await fetch(`${API_BASE_URL}/api/offers/get/${id}`,{
            method: 'GET',
            headers: { accept: 'application/json' },
        });
        return await response.json();
    }catch(error){
        return console.error(error);
    }
}

export async function getOffers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers`, {
            method: 'GET',
            headers: { accept: 'application/json',
                authorization: `Bearer ${token}`, 
            },
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export const getFilteredOffers = async (filters, pos) => {
  const query = new URLSearchParams();

  if (filters.categories && filters.categories.length > 0) {
    filters.categories.forEach(category => {
      query.append("category", category);
    });
  }

  if (filters.diets) {
    if (filters.diets.includes("vegan")) query.append("vegan", true);
    if (filters.diets.includes("sans gluten")) query.append("glutenFree", true);
  }

  if (filters.price?.min) query.append("priceMin", filters.price.min);
  if (filters.price?.max) query.append("priceMax", filters.price.max);
  if (filters.minRating) query.append("ratingMin", filters.minRating);

  if (filters.maxDistance && pos) {
    query.append("lat", pos.lat);
    query.append("lng", pos.lng);
    query.append("maxDistance", filters.maxDistance);
  }

  if (filters.expiryDate?.max) {
    query.append("expiryBefore", filters.expiryDate.max);
  }

  const res = await fetch(`${API_BASE_URL}/api/offers/filter?${query.toString()}`, {
    headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json'
    }
    });
  return res.json();
};

export async function getVeganOffers() {
    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/offers/vegan?limit=10&offset=0`, {
            method: 'GET',
            headers: { 
                accept: 'application/json',
                authorization: `Bearer ${token}`,
            }
        });

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getLocalOffers(lat, lng, radius = 5) {
    try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/offers/local?lat=${lat}&lng=${lng}&radius=${radius}`, {
            method: 'GET',
            headers: { 
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
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
            headers: { accept: 'application/json',
                authorization: `Bearer ${token}`, 
            },
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
                authorization: `Bearer ${token}`
            },
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function getOfferBySeller(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/get/seller`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id }),
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
            credentials: "include", // <- Important
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

export async function searchOffersByCriteria(criteria) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/search/filters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(criteria),
            credentials: "include",
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

export async function newOffer(formData) {
  const res = await fetch(`${API_BASE_URL}/api/offers/new`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: formData,
    credentials: "include",
  });

  let payload;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    payload = await res.json();
  } else {
    payload = await res.text();
  }

  return {
    status: res.status,
    ok: res.ok,
    body: payload,
    headers: res.headers,
  };
}

export async function editOffer(formData, idOffer) {
    const res = await fetch(`${API_BASE_URL}/api/offers/edit/${idOffer}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: formData,
        credentials: "include",
    });

    let payload;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        payload = await res.json();
    } else {
        payload = await res.text();
    }

    return {
        status: res.status,
        ok: res.ok,
        body: payload,
        headers: res.headers,
    };
}



export async function geocodeLocation(location) {
    try{
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
        return { result: [] };
    }
}

export async function fetchFilteredOffers(filters) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/offers/search/filters`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filters),
            credentials: "include", 
        });

        return await response.json();
    } catch (error) {
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
    } catch (error) {
        console.error("Erreur API getCategory :", error);
        return { data: [] }; 
    }
}

export async function createOrder(offerId){
    try{
        const response = await fetch(`${API_BASE_URL}/api/order/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                "offerId": offerId,
            }),
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

export async function fetchStats(userId, token){
    try{
        const response = await fetch(`${API_BASE_URL}/api/user/${userId}/dashboard`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: "include",
        });

        return await response.json();
    } catch(error){
        console.error("Erreur API :", error);
        return { result: [] };
    }
}


export async function sendRating(reviewData) {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData)
  });
  if (!res.ok) throw new Error("Erreur lors de l'envoi de l'évaluation");
  return res.json();
}

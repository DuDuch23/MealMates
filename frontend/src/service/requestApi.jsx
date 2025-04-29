import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from "/src/service/api";


// Mettre à jour le token depuis localStorage
export async function refreshToken({token}) {
    const infoToken = jwtDecode(token);
    const now = Date.now() / 1000;

    if (infoToken.exp < now) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/connexion");
    }
}

export async function logIn({ email, password }) {
    try {
        const response = await fetch("https://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}


export async function getUser({ user, token }) {
    try {
        const response = await fetch(`https://127.0.0.1:8000/api/user/get`, {
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

export async function newUser({ email, password, confirmPassword, firstName, lastName }) {
    try {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        await fetch(`${API_BASE_URL}/api/user/new`, {
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

        await logIn({ email, password });

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

export async function editUser({ userData, token }) {
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

        const response = await fetch(`https://127.0.0.1:8000/api/user/edit`, {
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

export async function deleteUser(id, token) {
    try {
        const response = await fetch(`https://127.0.0.1:8000/api/user/delete/`, {
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
        const response = await fetch(`https://127.0.0.1:8000/api/user/profile`, {
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
        const response = await fetch(`https://127.0.0.1:8000/api/offers/vegan?limit=10&offset=0`, {
            method: 'GET',
            headers: { accept: 'application/json' },
        });

        console.log(response.json());
        return await response.json();
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

        return await response.json();
    } catch (err) {
        console.error(err);
        return { result: [] };
    }
}

export async function logOut() {
    try {
        const response = await fetch(`https://127.0.0.1:8000/api/logout`, {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            console.log("Déconnexion réussie");
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export async function searchOfferByTitle(title) {
    try {
        const response = await fetch(`https://127.0.0.1:8000/api/offers/search`, {
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

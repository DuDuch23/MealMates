import { jwtDecode } from 'jwt-decode';

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

// login user
export async function logIn({ email, password }) {
    try {
        const response = await fetch(`https://groupe-5.lycee-stvincent.net/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        });

        console.log(response.json);
        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// récupérer un user
export async function getUser({ id,token }) {
    try {
        const request = await fetch("https://groupe-5.lycee-stvincent.net/api/user/get", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": id,
            })
        });

        return await request.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// créer un utilisateur
export async function newUser({ email, password, confirmPassword, firstName, lastName }) {
    try {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const request = await fetch("https://groupe-5.lycee-stvincent.net/api/user/new", {
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

// modifier un utilisateur
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

        const request = await fetch("https://groupe-5.lycee-stvincent.net/api/user/edit", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
        });

        return await request.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// supprimer un utilisateur
export async function deleteUser(id) {
    try {
        const request = await fetch("https://groupe-5.lycee-stvincent.net/api/user/delete/", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                "id": id
            }),
        });

        return await request.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// profil utilisateur
export async function getProfile({ email,token }) {
    try {
        const request = await fetch("https://groupe-5.lycee-stvincent.net/api/user/profile", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
            }),
        });

        return await request.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Offres
export async function getOffers() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    return fetch('https://groupe-5.lycee-stvincent.net/api/offers', options)
        .then((response) => response.json())
        .catch((err) => {
            console.error(err);
            return {
                result: []
            };
        });
}

export async function getVeganOffers() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        }
    };

    return fetch('https://groupe-5.lycee-stvincent.net/api/offers/vegan?limit=10&offset=0', options)
        .then((response) => response.json())
        .catch((err) => {
            console.error(err);
            return {
                result: []
            };
        });
}

export async function logOut() {
    try {
        const response = await fetch("https://groupe-5.lycee-stvincent.net/api/logout", {
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
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: title }),
        credentials: "include",
    };
    const response = await fetch("https://groupe-5.lycee-stvincent.net/api/offers/search", options);
    const data = await response.json();
    console.log("search response", data);
    return data;
}
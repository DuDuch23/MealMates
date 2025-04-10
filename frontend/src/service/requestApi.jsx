import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from "react-router";

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
        const response = await fetch("https://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
            credentials: "include",
        });

        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// récupérer un user
export async function getUser({ id,token }) {
    try {
        const request = await fetch("https://127.0.0.1:8000/api/user/get", {
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
        console.log({ email, password, confirmPassword, firstName, lastName });

        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const request = await fetch("https://localhost:8000/api/user/new", {
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
export async function editUser({ id, idIcon, email, password, confirmPassword, firstName, lastName }) {
    try {
        const request = await fetch("https://127.0.0.1:8000/api/user/edit/", {
            method: "POST",  // Remplace GET par POST
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id" : id,
                "idIcon" : idIcon,
                "email": email,
                "password": password,
                "password_confirm":confirmPassword,
                "firstName":firstName,
                "lastName": lastName,
            }),
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
        const request = await fetch("https://127.0.0.1:8000/api/user/delete/", {
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
        const request = await fetch("https://localhost:8000/api/user/profile", {
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

    return fetch('https://127.0.0.1:8000/api/offers', options)
        .then((response) => response.json())
        .catch((err) => {
            console.error(err);
            return { result: [] };
        });
}

export async function logOut() {
    try {
        const response = await fetch("https://127.0.0.1:8000/api/logout", {
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
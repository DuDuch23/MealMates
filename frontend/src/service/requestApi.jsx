import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// Login User
export async function logIn({ email, password }) {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Get a User
export async function getUser({ id, token }) {
    try {
        const response = await axios.post(
            `${API_URL}/user/get`,
            { id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Create a New User
export async function newUser({ email, password, confirmPassword, firstName, lastName }) {
    try {
        if (!email || !password || !confirmPassword || !firstName || !lastName) {
            throw new Error("All fields are required.");
        }

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match.");
        }

        const response = await axios.post(`${API_URL}/user/new`, {
            email,
            password,
            password_confirm: confirmPassword,
            firstName,
            lastName
        });

        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Edit a User
export async function editUser({ data, token }) {
    try {
        const response = await axios.put(
            `${API_URL}/user/edit/`,
            {
                email: data.email,
                password: data.password,
                password_confirm: data.password,
                firstName: data.firstName,
                lastName: data.lastName
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Delete a User
export async function deleteUser(id, token) {
    try {
        const response = await axios.delete(`${API_URL}/user/delete/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: { id }
        });

        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// Get Offers
export async function getOffers() {
    try {
        const response = await axios.get(`${API_URL}/offers`, {
            headers: {
                accept: "application/json"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Erreur API :", error);
        return { result: [] };
    }
}

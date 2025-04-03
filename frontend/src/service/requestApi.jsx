
/* User*/
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

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// recuperer un user
export async function getUser({id}) {
    try{
        const request = await fetch (`https://127.0.0.1:8000/api/user/get`,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body:JSON.stringify({
                "id": id,
            })
        });

        return await response.json();
    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// creer un utilisateur
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

        logIn(
            {
                email,
                password
            }
        );

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// modifier un user
export async function editUser({data}) {
    try{
        const request = await fetch ("https://127.0.0.1:8000/api/user/edit/",{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
            body : JSON.stringify({
                "email" : data[email],
                "password" : data[password],
                "password_confirm" : data[password],
                "firstName" : data[firstName],
                "lastName" : data[lastName],   
            }),
        });
        
        return await request.json();

    }catch(error){
        console.error("erreur api :", error);
        throw error;
    }
}

// supprimer un user
export async function deleteUser(id) {
    try{
        const request = await fetch ("https://127.0.0.1:8000/api/user/delete/",{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
            body : JSON.stringify({ 
                "id":id 
            }),
        });
        
        return await request.json();

    }catch(error){
        console.error("erreur api :", error);
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
            return  {result : []};
        });
}

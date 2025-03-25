const token = '';

// User

// login user
export async function logIn({ email, password }) {
    try {
        const response = await fetch("https://localhost:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: email,
                password: password
            }),
        });

        return await response.json();

    } catch (error) {
        console.error("Erreur API :", error);
        throw error;
    }
}

// recuperer un user
export async function getUser({id}) {
    try{
        const request = await fetch ("https://127.0.0.1:8000/api/user/get/",{
            method: "POST",
            headers: {Authorization: `Bearer ${token}`},
            body:JSON.stringify({
                "id": id,
            })
        });
        return await request.json();

    }catch(error){
        console.error("erreur api :", error);
        throw error;
    }
}

// creer un utilisateur
export async function newUser({email,password,password_confirm,nameUser,surname}) {
    try{
        const request = await fetch ("https://127.0.0.1:8000/api/user/new/",{
            method: "GET",
            headers: {Authorization: `Bearer ${token}`},
            body : JSON.stringify({
                "email" : email,
                "password" : password,
                "password_confirm" : password_confirm,
                "name" : nameUser,
                "surname" : surname, 
            }),
        });
        
        return await request.json();

    }catch(error){
        console.error("erreur api :", error);
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
                "name" : data[nameUser],
                "surname" : data[surname],   
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
    try{
        const request = await fetch ("https://127.0.0.1:8000/api/offers",{
            method: "GET",
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        return await request.json();

    }catch(error){
        console.error("erreur api :", error);
        throw error;
    }
}
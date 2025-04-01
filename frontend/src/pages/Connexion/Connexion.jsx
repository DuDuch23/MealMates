import { useState } from "react";
import { logIn } from "../../service/requestApi";
import GoogleLoginButton from "../../components/ssoGoogle";

// css
import "./Connexion.scss";

function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null); 
    const [user, setUser] = useState(null);  // Ajout de l'état pour stocker l'utilisateur Google

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await logIn({ email, password });
            setData(response);
            console.log("Réponse API :", response);
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };

    return (
        <>
            <h1>MealMates</h1>
            <div className="action">
                <form onSubmit={handleSubmit}>
                    <div className="content-element-form">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" placeholder="Test@email.com" onChange={handleEmail} />
                    </div>
                    <div className="content-element-form">
                        <label htmlFor="password">Mot de Passe:</label>
                        <input type="password" name="password" placeholder="password" onChange={handlePassword} />
                    </div>
                    <div className="content-element-form two-input">
                        <div className="two-input" id="password">
                            <label htmlFor="#">Se souvenir de moi</label>
                            <input type="checkbox" name="" />
                        </div>
                        <a href="#">Mot de passe oublié ?</a>
                    </div>
                    <button type="submit">Connexion</button>
                </form>
                
                <div className="otherAction">
                    <p>Ou connexion avec</p>
                    <GoogleLoginButton setUser={setUser} />
                </div>

                {user && (
                    <div className="user-info">
                        <p>Connecté en tant que : {user.name}</p>
                        <img src={user.picture} alt="Avatar" />
                    </div>
                )}
            </div>
        </>
    );
}

export default Connexion;

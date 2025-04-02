import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../service/requestApi";
import GoogleLoginButton from "../../components/ssoGoogle.jsx";
import "./Connexion.scss";

function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await logIn({ email, password });
            if (response.token) {
                localStorage.setItem("token", response.token);
                navigate("/");
            } else {
                setError("Connexion échouée. Vérifiez vos identifiants.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    const handleSSOSuccess = (userData) => {
        localStorage.setItem("token", userData.token);
        navigate("/");
    };

    return (
        <div className="connexion-container">
            <h1>MealMates</h1>
            <div className="action">
                <form onSubmit={handleSubmit}>
                    <div className="content-element-form">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Test@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="content-element-form">
                        <label htmlFor="password">Mot de Passe:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Connexion</button>
                </form>
                <div className="otherAction">
                    <p>Ou connexion avec</p>
                    <GoogleLoginButton onSuccess={handleSSOSuccess} />
                </div>
            </div>
        </div>
    );
}

export default Connexion;

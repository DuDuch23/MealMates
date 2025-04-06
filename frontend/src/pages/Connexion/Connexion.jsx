import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn } from "../../service/requestApi";
import GoogleLoginButton from "../../components/SsoGoogle";
import "./Connexion.css";

function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState(null); 
    const [error, setError] = useState(null);
    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);

    const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log("Handle submit called with email:", email, "and password:", password);
            const response = await logIn({ email, password });

            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                setUser(response.user);
                navigate("/"); 
            } else {
                setError("Email ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Email ou mot de passe incorrect.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <section className="connexion">
            <h1>MealMates</h1>
            <div className="action">
            <form onSubmit={handleSubmit}>
                <div className="content-element-form">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Test@email.com" onChange={handleEmail}/>
                </div>
                <div className="content-element-form">
                <label htmlFor="password">Mot de Passe</label>
                <input type="password" name="password" placeholder="password" onChange={handlePassword} />
                </div>
                <button type="submit">Connexion</button>
                {error && <p className="error">{error}</p>}
            </form>
            <div className="otherAction">
                <p>Ou connexion avec</p>
                <GoogleLoginButton setUser={setUser} />
            </div>
            {user && (
                <div className="user-info">
                <p>Connecté en tant que : {user.name}</p>
                <img src={user.picture} alt="Avatar" />
                <button onClick={handleLogout}>Déconnexion</button>
                </div>
            )}
            </div>
        </section>
    );
}

export default Connexion;

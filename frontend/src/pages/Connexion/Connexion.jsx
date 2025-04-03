import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../service/requestApi";
import GoogleLoginButton from "../../components/ssoGoogle";
import "./Connexion.css";

function Connexion() {
  // const
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null); 
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
      await logIn({ email, password });
      navigate("/");

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
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

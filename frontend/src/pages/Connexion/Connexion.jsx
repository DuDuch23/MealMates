import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn } from "../../service/requestApi";
import logo from '../../assets/logo-mealmates.png';

import GoogleLoginButton from "../../components/SsoGoogle";
import styles from "./Connexion.css";

function Connexion() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
      const response = await logIn({ email, password });
      if(response.token){
        localStorage.setItem("token",response.token);
        localStorage.setItem("user",JSON.stringify(response.user));
        setUser(response.user);
        navigate("/");
      }else{
        setError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

    return (
        <div className={styles.container}>
          <div className={styles["title-logo"]}>
            <img src={logo} alt="logo" className={styles.logo} />
            <h1>MealMates</h1>
          </div>
          <div className={styles.action}>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className={styles["content-element-form"]}>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" placeholder="Test@email.com" onChange={handleEmail}/>
              </div>
              <div className={styles["content-element-form"]}>
                <label htmlFor="password">Mot de Passe</label>
                <input type="password" name="password" placeholder="password" onChange={handlePassword} />
              </div>
              <button type="submit">Connexion</button>
              <div className={styles.otherAction}>
                <p>Ou connexion avec</p>
                <GoogleLoginButton setUser={setUser} />
              </div>
            </form>
          </div>
        </div>
    );
}

export default Connexion;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn, getProfile } from "../../service/requestApi";
import { addUserIndexDB } from "../../service/indexDB";
import CryptoJS from "crypto-js";
import logo from '../../assets/logo-mealmates.png';
import styles from "./Connexion.module.css";
import GoogleLoginButton from "../../components/SsoGoogle";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "default-key";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const expiration = sessionStorage.getItem("token_expiration");

    if (token && expiration && Date.now() < parseInt(expiration, 10)) {
      navigate("/offer");
    } else {
      sessionStorage.clear(); // token périmé
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await logIn({ email, password });

      if (response.token) {
        const token = response.token;
        const expiration = Date.now() + 60 * 60 * 1000; // 1h

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("token_expiration", expiration.toString());

        const profile = await getProfile({ email, token });
        sessionStorage.setItem("user",profile.user.id);
        console.log(profile.user);
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(profile.user), SECRET_KEY).toString();

        await addUserIndexDB({ ...profile.user, encrypted: encryptedUser });
        navigate("/offer");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
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
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles["content-element-form"]}>
            <label htmlFor="password">Mot de Passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Connexion</button>

          <div className={styles.otherAction}>
            <p>Ou connexion avec</p>
            <GoogleLoginButton />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Connexion;

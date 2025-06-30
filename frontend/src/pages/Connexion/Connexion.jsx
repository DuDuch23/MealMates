import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { logIn, getProfile } from "../../service/requestApi";
import { addUserIndexDB } from "../../service/indexDB";
import CryptoJS from "crypto-js";
import logo from '../../assets/logo-mealmates.png';
import GoogleLoginButton from "../../components/SsoGoogle";
import styles from "./Connexion.module.css";

const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "MyBackupSecret123!";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        navigate("/");
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
        sessionStorage.removeItem("user");
      }
    }
  }, [navigate]);

  // Gestion générique des inputs
  const handleInputChange = useCallback(
    (setter) => (event) => setter(event.target.value),
    []
  );

  // Soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await logIn({ email, password });

      if (response.token) {
        const token = response.token;

        const { user: profileUser } = await getProfile({ email, token });

        const expiration = Date.now() + 60 * 60 * 1000;

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("token_expiration", expiration.toString());
        sessionStorage.setItem("user", JSON.stringify(profileUser)); // stocke tout l'objet

        // Chiffre et stocke dans IndexDB
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(profileUser),
          SECRET_KEY
        ).toString();

        await addUserIndexDB({ ...profileUser, encrypted });

        console.log("Navigation vers /offer...");
        navigate("/offer");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.block}>
      <div className={styles.container}>
        <div className={styles.titleLogo}>
          <img src={logo} alt="logo MealMates" className={styles.logo} />
          <h1>MealMates</h1>
        </div>

        <div className={styles.action}>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className={styles.contentElementForm}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                aria-label="Email"
                value={email}
                onChange={handleInputChange(setEmail)}
                required
              />
            </div>

            <div className={styles.contentElementForm}>
              <label htmlFor="password">Mot de Passe</label>
              <input
                id="password"
                type="password"
                aria-label="Mot de Passe"
                value={password}
                onChange={handleInputChange(setPassword)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Connexion"}
            </button>

            <div className={styles.otherAction}>
              <p>OU</p>
              <GoogleLoginButton />
            </div>

            <div className={styles.contentElementForm}>
              <p className={styles.linkText} onClick={() => navigate("/")}>
                Retour au menu
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Connexion;

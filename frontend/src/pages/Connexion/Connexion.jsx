import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn, getProfile } from "../../service/requestApi";
import { addUserIndexDB } from "../../service/indexDB";
import CryptoJS from "crypto-js";
import logo from '../../assets/logo-mealmates.png';
import GoogleLoginButton from "../../components/SsoGoogle";
import styles from "./Connexion.module.css";


function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        navigate("/");
      } catch (error) {
        console.error("Erreur de parsing JSON :", error);
        localStorage.removeItem("user"); // Nettoyer pour éviter d'autres erreurs
      }
    }
  }, [navigate]);

  // Gestion des inputs de manière générique
  const handleInputChange = (setter) => (event) => setter(event.target.value);

  // Gérer la soumission du formulaire de connexion
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await logIn({ email, password });
      console.log("Réponse du serveur :", response);
      if (response.token) {
        const token = response.token;
        const fullUser = await getProfile({email});
        console.log()

        // Stocker dans localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(fullUser.user.id));

        const profile = await getProfile({ email, token });
        sessionStorage.setItem("user",profile.user.id);
        console.log(profile.user);
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(profile.user), SECRET_KEY).toString();

        // Ajouter l'utilisateur à IndexedDB
        await addUserIndexDB(fullUser.user);
        navigate("/");
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
      <div className={styles.titleLogo}>
        <img src={logo} alt="logo" className={styles.logo} />
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.contentElementForm}>
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

          <div className={styles.contentElementForm}>
          <p className={styles.linkText} onClick={() => navigate("/")}>
            Retour au menu
          </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Connexion;
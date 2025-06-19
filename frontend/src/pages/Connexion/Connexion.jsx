import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
<<<<<<< HEAD
import { logIn } from "../../service/requestApi";
import Header from "../../components/Header/Header";
import GoogleLoginButton from "../../components/SsoGoogle.jsx";
=======
import { logIn, getProfile } from "../../service/requestApi";
import { addUserIndexDB } from "../../service/indexDB";
import CryptoJS from "crypto-js";
import logo from '../../assets/logo-mealmates.png';
import GoogleLoginButton from "../../components/SsoGoogle";
import styles from "./Connexion.module.css";
const SECRET_KEY = import.meta.env.VITE_CRYPTO_KEY || "default-key";
>>>>>>> e94a387a0300ad288eb176126e4eb6e535013fd8


function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

<<<<<<< HEAD
                        {/* <GoogleLoginButton setUser={setUser} /> */}
    return (
        <div className="mobile">
            <Header />
            <div className="action">
                <h1>MealMates</h1>
                {/* <form onSubmit={handleSubmit}>
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
                </form> */}
=======
  // Gestion des inputs de manière générique
  const handleInputChange = (setter) => (event) => setter(event.target.value);
>>>>>>> e94a387a0300ad288eb176126e4eb6e535013fd8

  // Gérer la soumission du formulaire de connexion
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 
    try {
      const response = await logIn({ email, password });
      if (response.token) {
        const token = response.token;
        const fullUser = await getProfile({email, token});
        const { user: profileUser } = await getProfile({ email, token });

        // Stocker dans sessionStorage
        const expiration = Date.now() + 60 * 60 * 1000;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("token_expiration", expiration.toString());
        sessionStorage.setItem("user", JSON.stringify(profileUser.id));

        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify(profileUser),
          SECRET_KEY
        ).toString();
        await addUserIndexDB({ ...profileUser, encrypted });

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
    <div className={styles.block}>
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
<<<<<<< HEAD
        </div>
    );
=======

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
>>>>>>> e94a387a0300ad288eb176126e4eb6e535013fd8
}

export default Connexion;
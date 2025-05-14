import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn, getProfile } from "../../service/requestApi";
import { addUserIndexDB } from "../../service/indexDB";
import logo from '../../assets/logo-mealmates.png';
import GoogleLoginButton from "../../components/SsoGoogle";
import styles from "./Connexion.module.css"; // ✅ CSS Module



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
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await logIn({ email, password });
      if (response.token) {
        const token = response.token;
        const fullUser = await getProfile({ email});

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(fullUser.user.id));

        setUser(fullUser.id);

        await addUserIndexDB(fullUser.user);
        navigate("/");
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
              name="email"
              placeholder="Test@email.com"
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
              name="password"
              placeholder="********"
              value={password}
              onChange={handleInputChange(setPassword)}
              required
            />
          </div>

          <button type="submit">Connexion</button>

          <div className={styles.otherAction}>
            <p>Ou connexion avec</p>
            <GoogleLoginButton setUser={setUser} />
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

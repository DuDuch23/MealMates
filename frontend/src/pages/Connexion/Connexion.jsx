import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { logIn,getUser } from "../../service/requestApi";
import { addUser, getUser } from "../../service/indexDB";
import logo from '../../assets/logo-mealmates.png';
import styles from "./Connexion.module.css";
import GoogleLoginButton from "../../components/SsoGoogle";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Gérer l'email et le mot de passe
  const handleEmail = (event) => setEmail(event.target.value);
  const handlePassword = (event) => setPassword(event.target.value);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/");
    }
  }, [navigate]);


  // Gérer la soumission du formulaire de connexion
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateFields()) return;

    try {
      const response = await logIn({ email, password });
      if (response.token) {
        // Stocker le token et l'utilisateur dans localStorage et IndexedDB
        const user = response.user;
        const token = response.token;
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setUser(response.user);

        const res = await getUser({user,token});

        // Ajouter l'utilisateur à IndexedDB
        addUser(res);
        
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
              type="email"
              name="email"
              placeholder="Test@email.com"
              value={email}
              onChange={handleEmail}
            />
          </div>
          <div className={styles["content-element-form"]}>
            <label htmlFor="password">Mot de Passe</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={password}
              onChange={handlePassword}
            />
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { addUserIndexDB } from "../../service/indexDB";
import { newUser,logIn , getProfile } from "../../service/requestApi";
import logo from '../../assets/logo-mealmates.png';
import backgroundForm from '../../assets/background-form.png';
import { Link } from "react-router";



// css
import styles from "./Inscription.module.css";

function Inscription(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [data, setData] = useState(null);
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);

    const handleEmail = (event) => setEmail(event.target.value);
    const handlePassword = (event) => setPassword(event.target.value);
    const handleFirstName = (event) => setFirstName(event.target.value);
    const handleLastName = (event) => setLastName(event.target.value);
    const handleConfirmPassword = (event) => setConfirmPassword(event.target.value);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!email || !password || !confirmPassword || !firstName || !lastName) {
                setError("Tous les champs sont obligatoires.");
                console.log("Tous les champs sont obligatoires.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Les mots de passe ne correspondent pas.");
                console.log("Les mots de passe ne correspondent pas.");
                return;
            }
            if(!error){
                setError(null);
                const response = await newUser({ email, password, confirmPassword, firstName, lastName});
                console.log(response);
            }
            setError(null);
            console.log(error);
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
        navigate("/");
    };

    return(
        <>
            <div className={styles["container"]}>
                <div className={styles["title-logo"]}>
                    <img src={logo} alt="logo" className="logo"/>
                    <h1>MealMates</h1>
                </div>
                <div className={styles["action"]}>
                {error && <p className="error">{error}</p>}
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={styles["content-element"]}>
                            <div className={styles["content-element-form"]}>
                                <label htmlFor="last-name">Nom</label>
                                <input type="last-name" name="lastName" placeholder="Nom" value={lastName} onChange={handleLastName}/>
                            </div>
                            <div className={styles["content-element-form"]}>
                                <label htmlFor="name">Prénom</label>
                                <input type="name" name="firstName" placeholder="Prénom" value={firstName} onChange={handleFirstName}/>
                            </div>
                        </div>
                        <div className={styles["content-element-form"]}>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" placeholder="Veuillez renseigner votre email" value={email} onChange={handleEmail}/>
                        </div>
                        <div className={styles["content-element-form"]}>
                            <label htmlFor="password">Mot de Passe</label>
                            <input type="password" name="password" placeholder="Votre mot de passe..." value={password} onChange={handlePassword}/>
                        </div>
                        <div className={styles["content-element-form"]}>
                            <label htmlFor="confirm-password">Confimer le mot de passe</label>
                            <input type="password" name="confirmPassword" placeholder="Vérification de votre mot de passe" value={confirmPassword} onChange={handleConfirmPassword}/>
                        </div>
                        <button type="submit">Inscription</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Inscription;
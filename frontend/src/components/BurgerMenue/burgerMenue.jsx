import styles from "./burgerMenue.module.css";
import {getUserIndexDB} from "../../service/indexDB"
import { logOut } from "../../service/requestApi";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { IconUser } from '../IconUser/iconUser';
import logo from '../../assets/logo-mealmates.png';


export default function BurgerMenue({ onProfileClick }) {
  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = sessionStorage.getItem("user");
      if(storedUser){
        const {id} = JSON.parse(storedUser);
        if(id){
          try {
            const data = await getUserIndexDB(id);
            setUserData(data);
          } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const profilUser = () => {
    console.log("profilUser", userData);
    if (userData) {
      return (
        <li>
          <IconUser id={userData.iconUser || 4} />
          <p>
            <Link to={`/userProfile/${userData.id}`}>Mon profil</Link>
          </p>
        </li>
      );
    }
    // return null; 
  };

  const navigate = useNavigate();

  const handleDeconnexion = () => {
    const userId = sessionStorage.getItem("user");

    logOut(userId); // Exécute ton logout
    sessionStorage.removeItem("user"); // On nettoie sessionStorage
    sessionStorage.removeItem("token");
    
    navigate("/"); // Redirige
  };

  return (
    <>
      {
        !isOpen &&(
          <nav className={styles["menu-mobile"]}>
            <ul className={styles["menu-mobile__nav-top"]}>
              <li>
                  <Link className={styles.logo} key="home" to="/">
                      <img src={logo} alt="Logo MealMates" />
                      <h1>MealMates</h1>
                  </Link>
              </li>
              <button type="button" onClick={toggleMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
                <path d="M 0 2 L 0 4 L 24 4 L 24 2 Z M 0 11 L 0 13 L 24 13 L 24 11 Z M 0 20 L 0 22 L 24 22 L 24 20 Z"></path>
                </svg>
              </button>
            </ul>
            <ul className={styles["menu-mobile__nav-bottom"]}>
              {userData && (
                <>
                  {profilUser()}
                  <li><Link to="/dashboard">Tableau de bord</Link></li>
                </>
              )}
              <li>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg> */}
                <Link to="/offer">Page d'offre</Link>
              </li>
              <li>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg> */}
                <Link to="/ChooseChat">Chat</Link>
              </li>
              <li>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg> */}
                <Link to="/addOffer">Créer une Offre</Link>
              </li>
              <li id={styles["log-out"]} onClick={handleDeconnexion}>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg> */}
                <p >Se déconnecter</p>
              </li>
            </ul>
          </nav>
        )
      }
    </>
  );
}

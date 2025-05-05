
import {getUserIndexDB} from "../../service/indexDB"
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { IconUser } from '../IconUser/iconUser';

export default function BurgerMenue({ onProfileClick }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("user");
      const id  = Number(userId);
      console.log(id);
      if (id) {
        try {
          const data = await getUserIndexDB(id);
          setUserData(data);
          console.log(data);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const profilUser = () => {
    if (userData) {
      return (
        <li>
          <IconUser id={userData.iconUser || 'default-icon-id'} />
          <p>
            <Link to={`/userProfile/${userData.id}`}>Mon Profil</Link>
          </p>
        </li>
      );
    }
    return null;  // Retourne null si userData n'est pas encore disponible
  };

  return (
    <>
      <ul className="ul-burger">
        <svg onClick={onProfileClick} xmlns="http://www.w3.org/2000/svg" id="delete-burger-menue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        {profilUser()}  {/* Appel de la fonction profilUser */}
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <Link to="/offer">Page d'offre</Link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <Link to="/ChooseChat">Chat</Link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <Link to="/createOffer">Créer une Offre</Link>
        </li>
        <li>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          <Link to="/deconnexion">Se déconnecter</Link>
        </li>
      </ul>
    </>
  );
}

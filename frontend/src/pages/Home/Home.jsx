import { useState, useEffect } from 'react';
import './Home.css';
import { jwtDecode } from 'jwt-decode';
import logo from '../../assets/logo-mealmates.png';
import map from '../../assets/landing-map.png';
import { Link } from 'react-router-dom';
import { getProfile, refreshToken } from '../../service/requestApi';
import UserLocationMap from '../../components/mapGoogle';

function App() {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);

  if (userData != null) {
    localStorage.setItem("user", userData.user.id);
  }

  useEffect(() => {
    if (token) {
      try {
        refreshToken({ token });

        const user = jwtDecode(token);

        const fetchUserProfile = async () => {
          const email = user.username;
          const profile = await getProfile({ email, token });
          setUserData(profile);
        };

        fetchUserProfile();
      } catch (error) {
        console.error("Le token est invalide ou ne peut pas être décodé", error);
      }
    }
  }, [token]);

  const infoUser = () => {
    if (userData) {
      return (
        <li className='button-sign-in' key="inscription">
          <Link to={`/userProfile/${userData.user.id}`}>{userData.user.firstName}</Link>
        </li>
      );
    } else {
      return (
        <>
          <li className='button-sign-in' key="inscription">
            <Link to="/inscription">Inscription</Link>
          </li>
          <li className='button-log-in' key="connexion">
            <Link to="/connexion">Se connecter</Link>
          </li>
        </>
      );
    }
  };

  return (
    <section className="landing">
      <section className="header">
        <div className="header-left">
          <img src={logo} alt="Logo MealMates" />
          <h1>MealMates</h1>
        </div>
        <div className="header-right">
          {infoUser()}
        </div>
      </section>

      <section className="top">
        <h1>Et si on mangeait moins cher, plus respectueux de la planète ?</h1>
      </section>

      <section className="inbetween">
        <p>Luttez contre le gaspillage en achetant à d'autres particuliers, et proposez vos propres surplus alimentaires.</p>
      </section>

      <section className="bottom">
        <div className="left">
          <div className="circle"></div>
          <UserLocationMap />
        </div>

        <div className="right">
          <h1>Obtenez des offres locales, qui suivent vos offres alimentaires</h1>
          <button>M'inscrire maintenant</button>
          <div className="footer">
            <p>© Mealmates 2025</p>
          </div>
        </div>
      </section>
    </section>
  );
}

export default App;

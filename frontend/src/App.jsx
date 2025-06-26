import React, { Suspense, lazy, useState, useEffect } from 'react';
// import { Routes, Route, useNavigate } from 'react-router';
import { getUserIndexDB, deleteUserIndexDB } from './service/indexDB';
import NavLayout from './Layout/NavLayout';
import logo from '../src/assets/logo-mealmates.png';

// Chargement différé des composants
const Home = lazy(() => import('./pages/Home/Home'));
const Offer = lazy(() => import('./pages/Offer/Offer'));
const AddOffer = lazy(() => import('./pages/AddOffer/addOffer'));
const SingleOffer = lazy(() => import('./pages/SingleOffer/SingleOffer'));
const Connexion = lazy(() => import('./pages/Connexion/Connexion'));
const UserModify = lazy(() => import('./pages/UserModify/UserModify'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));
const Inscription = lazy(() => import('./pages/Inscription/Inscription'));
const Deconnexion = lazy(() => import('./pages/Deconnexion/Deconnexion'));
const UserMealCard = lazy(() => import('./pages/UserMealCard/UserMealCard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard/UserDashboard'));
const Chat = lazy(() => import('./pages/Chat/Chat'));
const ChooseChat = lazy(() => import('./pages/ChooseChat/ChooseChat'));

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifie si le token est expiré et déconnecte l'utilisateur
  useEffect(() => {
    const logout = async () => {
      const expiration = sessionStorage.getItem("token_expiration");
      try {
        if (expiration && Date.now() > Number(expiration)) {
          await deleteUserIndexDB();
          sessionStorage.clear();
          navigate("/connexion");
        }
      } catch (err) {
        console.error("Erreur pendant la déconnexion :", err);
        navigate("/connexion");
      }
    };
    logout();
  }, [navigate]);

  // Récupère l'utilisateur depuis le sessionStorage et l'IndexedDB
  useEffect(() => {
    async function fetchUser() {
      try {
        const userSession = sessionStorage.getItem("user");
        if (userSession) {
          const parsedUser = JSON.parse(userSession);
          if (parsedUser && parsedUser.id) {
            const id = parseInt(parsedUser.id, 10);
            const userData = await getUserIndexDB(id);
            setUser(userData);
          } else {
            setUser(false);
          }
        } else {
          setUser(false);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
        setUser(false);
      }
    }
    fetchUser();
  }, [navigate]);

  return (
    <Suspense
      fallback={
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}>
          <img src={logo} alt="Logo MealMates" />
        </div>
      }
    >
      <Routes>
        {/* Routes avec la barre de navigation */}
        <Route element={<NavLayout />}>
          {/* Route d'accueil */}
          {user === null ? (
            <Route path="/" element={<p style={{ textAlign: 'center', marginTop: '20vh' }}>Chargement...</p>} />
          ) : user ? (
            <Route path="/" element={<Offer />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}

          {/* Discussions */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/ChooseChat" element={<ChooseChat />} />

          {/* Offres */}
          <Route path="/offer" element={<Offer />} />
          <Route path="/addOffer" element={<AddOffer />} />
          <Route path="/offer/:id" element={<SingleOffer />} />

          {/* Utilisateur */}
          <Route path="/userProfile/:id" element={<UserProfile />} />
          <Route path="/userMealCard/:id" element={<UserMealCard />} />
          <Route path="/userModify/:id" element={<UserModify />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* Authentification */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/deconnexion" element={<Deconnexion />} />

        {/* Page non trouvée */}
        <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '20vh' }}>Page non trouvée</h1>} />
      </Routes>
    </Suspense>
  );
}

export default App;

import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { getUserIndexDB, deleteUserIndexDB } from './service/indexDB';
import NavLayout from './Layout/NavLayout';
import logo from '../src/assets/logo-mealmates.png';

// Chargement différé des composants

// Commun
const Home = React.lazy(() => import('./pages/Home/Home'));

// Offre
const Offer = React.lazy(() => import('./pages/Offer/Offer'));
const AddOffer = React.lazy(() => import('./pages/AddOffer/addOffer'));
const SingleOffer = React.lazy(() => import('./pages/SingleOffer/SingleOffer'));

// User
const Connexion = React.lazy(() => import('./pages/Connexion/Connexion'));
const UserModify = React.lazy(() => import('./pages/UserModify/UserModify'));
const UserProfile = React.lazy(() => import('./pages/UserProfile/UserProfile'));
const Inscription = React.lazy(() => import('./pages/Inscription/Inscription'));
const Deconnexion = React.lazy(() => import('./pages/Deconnexion/Deconnexion'));
const UserMealCard = React.lazy(() => import('./pages/UserMealCard/UserMealCard'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard/UserDashboard'));

// Chat
const Chat = React.lazy(()=> import('./pages/Chat/Chat'));
const ChooseChat = React.lazy(()=>import('./pages/ChooseChat/ChooseChat'));
const Qrcode = React.lazy(()=>import('./pages/QrCode/QrCode'));
const Confirmation = React.lazy(()=>import('./pages/Confirmation/Confirmation'));

// Erreur 404 (redirection)
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const expiration = sessionStorage.getItem("token_expiration");

        if (expiration && Date.now() > Number(expiration)) {
          await deleteUserIndexDB();
          sessionStorage.clear();
          console.warn("Session expirée, mais redirection désactivée.");
          navigate("/connexion");
        }
      } catch (err) {
        console.error("Erreur pendant la déconnexion :", err);
        navigate("/connexion");
      }
    };

    logout();
  }, []); // Retrait de [navigate] pour éviter ré-exécution inutile

  useEffect(() => {
    async function fetchUser() {
      try {
        const userSession = sessionStorage.getItem("user");
        if (userSession) {
          const parsedUser = JSON.parse(userSession);
          const id = parseInt(parsedUser.id, 10);
          const userData = await getUserIndexDB(id);
          setUser(userData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur :", err);
      }
    }

    fetchUser();
  }, []);

  return (
    <Suspense fallback={
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <img src={logo} alt="Logo MealMates" />
      </div>
    }>
      <Routes>
        {/* route avec la nav bar */}
        <Route element={<NavLayout />}>
          {/* Home selon connexion */}
          {user ? (
            <Route path="/" element={<Offer />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}

          {/* discussion user */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/ChooseChat" element={<ChooseChat />} />

          {/* offer */}
          <Route path="/offer" element={<Offer />} />
          <Route path="/addOffer" element={<AddOffer />} />
          <Route path="/offer/:id" element={<SingleOffer />} />

          {/* user profile */}
          <Route path="/userProfile/:id" element={<UserProfile />} />
          <Route path="/userMealCard/:id" element={<UserMealCard />} />
          <Route path="/userModify/:id" element={<UserModify />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Route>

        {/* auth */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/deconnexion" element={<Deconnexion />} />

        {/* qrcode */}
        <Route path="/qrcode/:id" element={< Qrcode />} />
        <Route path="/confirmation" element={< Confirmation />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;

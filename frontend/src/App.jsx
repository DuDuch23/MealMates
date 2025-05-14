import React, { Suspense, lazy, useState,useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { getUserIndexDB } from './service/indexDB';
import NavLayout from './Layout/NavLayout';
import logo from '../src/assets/logo-mealmates.png';

// Chargement différé des composants

// Commun
const Home = React.lazy(() => import('./pages/Home/Home'));

// Offre
const Offer = React.lazy(() => import('./pages/Offer/Offer'));
const AddOffer = React.lazy(() => import('./pages/AddOffer/addOffer'));
const OfferCard = React.lazy(() => import('./pages/OfferCard/OfferCard'));
const SingleOffer = React.lazy(() => import('./pages/SingleOffer/SingleOffer'));

// User
const Connexion = React.lazy(() => import('./pages/Connexion/Connexion'));
const UserModify = React.lazy(() => import('./pages/UserModify/UserModify'));
const UserProfile = React.lazy(() => import('./pages/UserProfile/UserProfile'));
const Inscription = React.lazy(() => import('./pages/Inscription/Inscription'));
const Deconnexion = React.lazy(() => import('./pages/Deconnexion/Deconnexion'));
const UserMealCard = React.lazy(() => import('./pages/UserMealCard/UserMealCard'));

// Chat
const Chat = React.lazy(()=> import('./pages/Chat/Chat'));
const ChooseChat = React.lazy(()=>import('./pages/ChooseChat/ChooseChat'));
function App() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("user");

  useEffect(() => {
    async function fetchUser() {
      if (userId) {
        const id = parseInt(userId);
        const userData = await getUserIndexDB(id);
        setUser(userData);
      }
    }
    fetchUser();
  }, [userId]);

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
          <Route path="/" element={user ? <Offer /> : <Home />} />
          {/* discution user */}
          <Route path="/chat" element={<Chat />} />
          <Route path='/ChooseChat' element={<ChooseChat/>}/>
          {/* offer */}
          <Route path="/offer" element={<Offer />} />
          <Route path='/addOffer' element={<AddOffer />}/>
          <Route path='/offerCard' element={<OfferCard/>}/>
          <Route path="/offer/:id" element={<SingleOffer />} />
        </Route>
        {/* user profile */}
        <Route path="/userProfile/:id" element={<UserProfile />} />
        <Route path="/userMealCard/:id" element={<UserMealCard />} />
        <Route path="/userModify/:id" element={<UserModify />} />
        {/* connexion */}
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/deconnexion" element={<Deconnexion />} />
      </Routes>
    </Suspense>
  );
}

export default App;
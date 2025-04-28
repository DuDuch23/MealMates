import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import NavLayout from './Layout/NavLayout';

// Chargement différé des composants

// Commun
const Home = React.lazy(() => import('./pages/Home/Home'));

// Offre
const Offer = React.lazy(()=> import('./pages/Offer/Offer'));

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
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen p-4">Chargement...</div>}>
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/offer" element={<Offer />} />
          <Route path='/ChooseChat' element={<ChooseChat/>}/>
          <Route path="/chat" element={<Chat />} />
        </Route>
        <Route path="/userProfile/:id" element={<UserProfile />} />
        <Route path="/userMealCard/:id" element={<UserMealCard />} />
        <Route path="/userModify/:id" element={<UserModify />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/deconnexion" element={<Deconnexion />} />
      </Routes>
    </Suspense>
  );
}

export default App;
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import NavLayout from './Layout/NavLayout';

// Chargement différé des composants
const Home = React.lazy(() => import('./pages/Home/Home'));
const Connexion = React.lazy(() => import('./pages/Connexion/Connexion'));
const Inscription = React.lazy(() => import('./pages/Inscription/Inscription'));
const UserProfile = React.lazy(() => import('./pages/UserProfile/UserProfile'));
const UserMealCard = React.lazy(() => import('./pages/UserMealCard/UserMealCard'));
const UserModify = React.lazy(() => import('./pages/UserModify/UserModify'));
const Deconnexion = React.lazy(() => import('./pages/Deconnexion/Deconnexion'));
const Offer = React.lazy(()=> import('./pages/Offer/Offer'));

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen p-4">Chargement...</div>}>
      <Routes>
        <Route path="/" element={<NavLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path='/offer' element={<NavLayout/>}>
          <Route index element={<Offer />} />
        </Route>
        <Route path="userProfile/:id" element={<UserProfile />} />
        <Route path="userMealCard/:id" element={<UserMealCard />} />
        <Route path="userModify/:id" element={<UserModify />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription /> } />
        <Route path="/deconnexion" element={<Deconnexion /> } />
      </Routes>
    </Suspense>
  );
}

export default App;
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavLayout from './Layout/NavLayout';

// Chargement différé des composants
const Home = lazy(() => import('./pages/Home/Home'));
const Connexion = lazy(() => import('./pages/Connexion/Connexion'));
const Inscription = lazy(() => import('./pages/Inscription/Inscription'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen p-4">Chargement...</div>}>
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/userProfile/:id" element={<UserProfile />} />
        </Route>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription /> } />
        <Route path="/deconnexion" element={<Inscription /> } />
      </Routes>
    </Suspense>
  );
}

export default App;
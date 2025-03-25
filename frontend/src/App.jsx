import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavLayout from './Layout/NavLayout';

// Chargement différé des composants
const Home = lazy(() => import('./pages/Home'));
const Connexion = lazy(() => import('./pages/Connexion/Connexion'));
const Inscription = lazy(() => import('./pages/Inscription/Inscription'));
const UserProfile = lazy(() => import('./pages/UserProfile/UserProfile'));

function App() {
  return (
    <Suspense fallback={<div className="text-center p-4">Chargement...</div>}>
      <Routes>
        <Route element={<NavLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profileUser/:id" element={<UserProfile />} />
        </Route>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription /> } />
      </Routes>
    </Suspense>
  );
}

export default App;

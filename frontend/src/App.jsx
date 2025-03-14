import { Route,Routes } from 'react-router';
import Header from './components/Header';
import NavLayout from './NavLayout';
import Home from './pages/Home'
import Connexion from './pages/Connexion/Connexion';
import Inscription from './pages/Inscription/Inscription';

function App() {
  return (
   <>
    <Routes>
      <Route element={<NavLayout />}>
        <Route path="/" element={<Home/>} />
      </Route>
      <Route path="/connexion" element={<Connexion/>}/>
      <Route path="/inscription" element={<Inscription/>} />
    </Routes>
  </> 
  );
}

export default App;
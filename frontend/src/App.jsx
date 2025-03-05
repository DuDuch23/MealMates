import { Route,Routes } from 'react-router-dom';
import Header from './components/Header';
import Inscription from './pages/Inscription';

function App() {
  return (
   <>
    <Header/>
      <div>
    <Routes>        
      <Route path="/" element="" />
      <Route path="/inscription" element={<Inscription/>} />
    </Routes>
    </div>
    </>
   
  );
}

export default App;
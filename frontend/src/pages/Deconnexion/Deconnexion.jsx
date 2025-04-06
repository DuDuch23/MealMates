import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut } from "../../service/requestApi";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    logOut().finally(() => {
      navigate("/connexion");
    });
  }, [navigate]);

  return null;
}

export default App;
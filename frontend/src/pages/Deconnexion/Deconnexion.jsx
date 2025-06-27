import { useEffect } from "react";
import { useNavigate } from "react-router";
import { deleteUserIndexDB } from "../../service/indexDB";

function Deconnexion() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await deleteUserIndexDB();
        sessionStorage.clear();
        navigate("/connexion");
      } catch (err) {
        console.error("Erreur pendant la déconnexion :", err);
        navigate("/connexion");
      }
    };

    logout();
  }, [navigate]);

  return null;
}

export default Deconnexion;

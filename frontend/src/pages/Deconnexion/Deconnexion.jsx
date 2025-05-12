import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut } from "../../service/requestApi";
import { deleteUserIndexDB } from "../../service/indexDB";

function Deconnexion() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logOut();

      const userId = JSON.parse(localStorage.getItem("user"));
      if (userId) {
        await deleteUserIndexDB(userId);
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/connexion");
    };

    handleLogout();
  }, [navigate]);

  return null;
}

export default Deconnexion;
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { logOut } from "../../service/requestApi";

function Deconnexion() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logOut();
      navigate("/connexion");
    };

    handleLogout();
  }, [navigate]);
}

export default Deconnexion;
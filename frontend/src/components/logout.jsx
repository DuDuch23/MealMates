import React from "react";
import { googleLogout } from "@react-oauth/google";

const Logout = ({ setUser }) => {
  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    console.log("Déconnexion réussie !");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Se déconnecter
    </button>
  );
};

export default Logout;

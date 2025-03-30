import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const Login = ({ setUser }) => {
  const handleSuccess = (response) => {
    const user = jwtDecode(response.credential);
    console.log("Utilisateur connecté :", user);

    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleError = () => {
    console.log("Échec de la connexion !");
  };

  return (
    <div>
      <h3>Connectez-vous avec Google :</h3>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default Login;

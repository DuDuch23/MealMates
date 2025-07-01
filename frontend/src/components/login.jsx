import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const Login = ({ setUser }) => {
  const handleSuccess = (response) => {
    const user = jwtDecode(response.credential);

    setUser(user);
    sessionStorage.setItem("user", JSON.stringify(user.id));
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

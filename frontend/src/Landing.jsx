import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

const GoogleSSO = () => {
  const handleSuccess = (response) => {
    const user = jwtDecode(response.credential);
    console.log("User Info:", user);
    // Ici, tu peux envoyer les infos à ton backend pour gérer l'inscription
  };

  const handleError = () => {
    console.log("Échec de l'authentification");
  };

  return (
    <GoogleOAuthProvider clientId="16822055858-p2dgot93ujg9gbbsf03k56opafbmefo5.apps.googleusercontent.com">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Connexion avec Google</h2>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSSO;

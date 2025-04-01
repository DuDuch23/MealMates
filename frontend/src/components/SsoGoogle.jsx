import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = "947326609144-oed76j74qvdqh2ie1e4cdfobrtmpiq66.apps.googleusercontent.com"


const GoogleLoginButton = ({ setUser }) => {
  const handleSuccess = (response) => {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    localStorage.setItem("user", JSON.stringify(userObject));
  };

  const handleFailure = () => {
    console.error("Échec de l'authentification Google");
  };

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
  );
};

export default GoogleLoginButton;

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const CLIENT_ID = "947326609144-oed76j74qvdqh2ie1e4cdfobrtmpiq66.apps.googleusercontent.com";

const GoogleLoginButton = ({ setUser }) => {
  const handleSuccess = (response) => {
    try {
      const userObject = jwtDecode(response.credential);
      setUser(userObject);
      localStorage.setItem("user", JSON.stringify(userObject));
      console.log("Connexion réussie :", userObject);
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  };

  const handleFailure = () => {
    console.error("Échec de l'authentification Google");
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;

import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router"; 
import { getTokenSSo } from "./../service/requestApi"; // ← importe ta fonction d'auth SSO ici

const CLIENT_ID = "947326609144-oed76j74qvdqh2ie1e4cdfobrtmpiq66.apps.googleusercontent.com";

const GoogleLoginButton = ({ setUser }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential returned by Google");
      }

      const decoded = jwtDecode(credentialResponse.credential);

      const userInfo = {
        email: decoded.email,
        firstName: decoded.given_name,
        iconUser: decoded.picture,
      };

      // Stockage + affichage
      sessionStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      // Appel SSO (asynchrone)
      try {
        const ggtto = credentialResponse.credential;
        const token = await getTokenSSo({ token:ggtto });

        console.log(token);

        console.log("Token reçu du SSO :", token);
      } catch (error) {
        console.error("Erreur lors de la récupération du token SSO :", error);
        sessionStorage.removeItem("user");
      }

      // Redirection
      // navigate("/offer");

    } catch (error) {
      console.error("Erreur lors du décodage du token Google :", error);
    }
  };

  const handleFailure = () => {
    console.error("Échec de l'authentification Google");
  };

  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} useOneTap />
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        <GoogleLoginButton setUser={setUser} />
        {user && (
          <div>
            <h2>Bienvenue, {user.firstName}</h2>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;

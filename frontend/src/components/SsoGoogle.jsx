import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";


const CLIENT_ID = "947326609144-oed76j74qvdqh2ie1e4cdfobrtmpiq66.apps.googleusercontent.com";

const GoogleLoginButton = ({ setUser }) => {
  const handleSuccess = (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential returned by Google");
      }

      const userObject = jwtDecode(credentialResponse.credential);
      sessionStorage.setItem("user", JSON.stringify(userObject));
      console.log("Connexion réussie :", userObject);

      if (typeof setUser === "function") {
        setUser(userObject);
      } else {
        console.warn("setUser n'est pas une fonction.");
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
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
            <h2>Bienvenue, {user.name}</h2>
            <p>Email: {user.email}</p>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;

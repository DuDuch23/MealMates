import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { getTokenSSo } from "./../service/requestApi";

const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ setUser }) => {
  const navigate = useNavigate();
  const [googleTheme, setGoogleTheme] = useState("outline"); // default to light

  // Détection du thème sombre
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = () => {
      setGoogleTheme(darkModeQuery.matches ? "filled_black" : "outline");
    };

    updateTheme(); // initial check

    darkModeQuery.addEventListener("change", updateTheme); // listen for theme changes

    return () => {
      darkModeQuery.removeEventListener("change", updateTheme);
    };
  }, []);

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

      sessionStorage.setItem("user", JSON.stringify(userInfo));
      setUser(userInfo);

      try {
        const ggtto = credentialResponse.credential;
        const token = await getTokenSSo({ token: ggtto });
        sessionStorage.setItem("token", token.token);
        
        const expiration = Date.now() + 60 * 60 * 1000;
        sessionStorage.setItem("token_expiration", expiration.toString());


      } catch (error) {
        console.error("Erreur lors de la récupération du token SSO :", error);
        sessionStorage.removeItem("user");
      }

      navigate("/offer");
    } catch (error) {
      console.error("Erreur lors du décodage du token Google :", error);
    }
  };

  const handleFailure = () => {
    console.error("Échec de l'authentification Google");
  };

  return (
    <GoogleLogin
      theme={googleTheme} // Change selon le thème système
      size="large"
      text="continue_with"
      onSuccess={handleSuccess}
      onError={handleFailure}
      useOneTap
    />
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div>
        <GoogleLoginButton setUser={setUser} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;

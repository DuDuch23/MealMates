import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

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

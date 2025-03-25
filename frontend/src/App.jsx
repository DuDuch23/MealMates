import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/login";
import Logout from "./components/logout";

const clientId = "947326609144-oed76j74qvdqh2ie1e4cdfobrtmpiq66.apps.googleusercontent.com";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <h1>Authentification Google SSO</h1>

        {user ? (
          <div>
            <h3>Bienvenue, {user.name} !</h3>
            <img src={user.picture} alt="Avatar" style={{ borderRadius: "50%", width: "80px" }} />
            <Logout setUser={setUser} />
          </div>
        ) : (
          <Login setUser={setUser} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;

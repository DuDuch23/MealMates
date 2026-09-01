import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { fetchSsoToken, storeSession } from "../services/authApi"

const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID

function LoginButton() {
  const navigate = useNavigate()
  const [googleTheme, setGoogleTheme] = useState("outline")

  // Aligne le style du bouton Google sur le thème système
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const updateTheme = () => {
      setGoogleTheme(darkModeQuery.matches ? "filled_black" : "outline")
    }

    updateTheme()
    darkModeQuery.addEventListener("change", updateTheme)

    return () => {
      darkModeQuery.removeEventListener("change", updateTheme)
    }
  }, [])

  const handleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Aucun credential retourné par Google")
      }

      const decoded = jwtDecode(credentialResponse.credential)
      const user = {
        email: decoded.email,
        firstName: decoded.given_name,
        iconUser: decoded.picture,
      }

      const ssoResponse = await fetchSsoToken(credentialResponse.credential)
      storeSession({
        token: ssoResponse.token,
        user,
      })

      navigate("/offer")
    } catch (error) {
      console.error("Erreur lors de l'authentification Google :", error)
    }
  }

  return (
    <GoogleLogin
      theme={googleTheme}
      size="large"
      text="continue_with"
      onSuccess={handleSuccess}
      onError={() => console.error("Échec de l'authentification Google")}
      useOneTap
    />
  )
}

export default function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <LoginButton />
    </GoogleOAuthProvider>
  )
}

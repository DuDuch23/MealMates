import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { fetchSsoToken, storeSession } from "../services/authApi"
import { getProfile } from "../services/userApi"
import { addUserIndexDb } from "../services/indexDb"

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
      const ssoResponse = await fetchSsoToken(credentialResponse.credential)

      // Le token seul ne suffit pas : on récupère le profil canonique
      // (id, iconUser numérique, etc.) depuis le backend, comme pour la
      // connexion classique — les champs du JWT Google (photo, prénom) ne
      // correspondent pas au format attendu par le reste de l'app.
      sessionStorage.setItem("token", ssoResponse.token)
      const { user: profileUser } = await getProfile({ email: decoded.email })

      storeSession({
        token: ssoResponse.token,
        user: profileUser,
      })
      await addUserIndexDb(profileUser)

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

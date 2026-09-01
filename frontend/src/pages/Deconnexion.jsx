import { useEffect } from "react"
import { useNavigate } from "react-router"
import { logOut } from "../services/authApi"

/** Vide la session puis redirige vers la page de connexion. */
export default function Deconnexion() {
  const navigate = useNavigate()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logOut()
      } catch (error) {
        console.error("Erreur pendant la déconnexion :", error)
      } finally {
        navigate("/connexion")
      }
    }

    performLogout()
  }, [navigate])

  return null
}

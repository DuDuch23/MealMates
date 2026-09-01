import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import logo from "../assets/logo-mealmates.png"
import landingBackground from "../assets/landing-background.png"
import GoogleLoginButton from "../components/GoogleLoginButton"
import { logIn, storeSession, getSessionUser } from "../services/authApi"
import { getProfile } from "../services/userApi"
import { addUserIndexDb } from "../services/indexDb"
import { ApiError } from "../services/apiClient"

const inputClass =
  "rounded-lg border border-white/30 bg-transparent px-4 py-3 text-white placeholder-white/60 transition-colors focus:border-white focus:outline-none"

export default function Connexion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Un utilisateur déjà connecté n'a rien à faire ici
  useEffect(() => {
    if (getSessionUser() !== null) {
      navigate("/")
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await logIn({ email, password })

      if (!response.token) {
        setError("Email ou mot de passe incorrect.")
        return
      }

      sessionStorage.setItem("token", response.token)
      const { user: profileUser } = await getProfile({ email })

      storeSession({
        token: response.token,
        user: profileUser,
      })
      await addUserIndexDb(profileUser)

      navigate("/offer")
    } catch (error) {
      console.error("Erreur lors de la connexion :", error)
      if (error instanceof ApiError && error.status === 401) {
        setError("Email ou mot de passe incorrect.")
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${landingBackground})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative z-10 flex w-full max-w-md flex-col gap-8 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-4">
          <img src={logo} alt="Logo MealMates" className="size-12" />
          <h1 className="text-3xl font-bold text-white">MealMates</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <p className="rounded bg-red-950/70 px-3 py-2 text-center text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white">
              Mot de passe <span className="text-red-400">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-white px-4 py-3 text-lg font-bold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Connexion"}
          </button>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-white">OU</p>
            <GoogleLoginButton />
          </div>

          <Link to="/" className="text-center text-white underline transition-colors hover:text-gray-300">
            Retour au menu
          </Link>
        </form>
      </div>
    </div>
  )
}

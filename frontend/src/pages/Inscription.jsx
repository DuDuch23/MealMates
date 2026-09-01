import { useState } from "react"
import { Link, useNavigate } from "react-router"
import logo from "../assets/logo-mealmates.png"
import landingBackground from "../assets/landing-background.png"
import { registerUser, logIn, storeSession } from "../services/authApi"
import { getProfile } from "../services/userApi"
import { addUserIndexDb } from "../services/indexDb"

const inputClass =
  "rounded-lg border border-white/30 bg-transparent px-4 py-3 text-white placeholder-white/60 transition-colors focus:border-white focus:outline-none"

export default function Inscription() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Tous les champs sont obligatoires.")
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)
    try {
      await registerUser({ email, password, confirmPassword, firstName, lastName })

      // Connexion automatique après la création du compte
      const loginResponse = await logIn({ email, password })
      if (!loginResponse.token) {
        navigate("/connexion")
        return
      }

      sessionStorage.setItem("token", loginResponse.token)
      const { user: profileUser } = await getProfile({ email })

      storeSession({
        token: loginResponse.token,
        user: profileUser,
      })
      await addUserIndexDb(profileUser)

      navigate("/offer")
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)
      setError("L'inscription a échoué. Vérifiez vos informations et réessayez.")
    } finally {
      setLoading(false)
    }
  }

  const renderField = ({ id, label, type, value, onChange, placeholder }) => {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-white">
          {label} <span className="text-red-400">*</span>
        </label>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required
          className={inputClass}
        />
      </div>
    )
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

          {renderField({
            id: "lastName",
            label: "Nom",
            type: "text",
            value: lastName,
            onChange: setLastName,
            placeholder: "Nom",
          })}

          {renderField({
            id: "firstName",
            label: "Prénom",
            type: "text",
            value: firstName,
            onChange: setFirstName,
            placeholder: "Prénom",
          })}

          {renderField({
            id: "email",
            label: "Email",
            type: "email",
            value: email,
            onChange: setEmail,
            placeholder: "Veuillez renseigner votre email",
          })}

          {renderField({
            id: "password",
            label: "Mot de passe",
            type: "password",
            value: password,
            onChange: setPassword,
            placeholder: "Votre mot de passe...",
          })}

          {renderField({
            id: "confirmPassword",
            label: "Confirmer le mot de passe",
            type: "password",
            value: confirmPassword,
            onChange: setConfirmPassword,
            placeholder: "Vérification de votre mot de passe",
          })}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg bg-white px-4 py-3 text-lg font-bold text-black transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? "Inscription..." : "Inscription"}
          </button>

          <Link to="/" className="text-center text-white underline transition-colors hover:text-gray-300">
            Retour au menu
          </Link>
        </form>
      </div>
    </div>
  )
}

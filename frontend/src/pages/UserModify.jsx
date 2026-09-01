import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import ProfileTabs from "../components/ProfileTabs"
import AvatarPicker from "../components/avatars/AvatarPicker"
import { editUser } from "../services/userApi"
import { getUserIndexDb, updateUserIndexDb } from "../services/indexDb"
import { getSessionUser } from "../services/authApi"

const inputClass =
  "w-full rounded-lg border border-gray-600 bg-neutral-700 px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none"

export default function UserModify() {
  const params = useParams()
  const navigate = useNavigate()
  const userId = params.id ? parseInt(params.id, 10) : null
  const sessionUser = getSessionUser()

  const [iconUser, setIconUser] = useState(1)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [saving, setSaving] = useState(false)

  // Seul le propriétaire du compte peut le modifier
  useEffect(() => {
    if (userId !== sessionUser?.id) {
      navigate("/offer")
    }
  }, [userId, sessionUser?.id, navigate])

  useEffect(() => {
    if (!userId) {
      return
    }

    const fetchUserData = async () => {
      try {
        const user = await getUserIndexDb(userId)
        if (user) {
          setIconUser(user.iconUser || 1)
          setEmail(user.email || "")
          setFirstName(user.firstName || "")
          setLastName(user.lastName || "")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }

    fetchUserData()
  }, [userId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback(null)
    setSaving(true)

    const userData = {
      userId,
      iconUser,
      email,
      firstName,
      lastName,
    }

    try {
      const response = await editUser(userData)
      if (response.code === 200) {
        await updateUserIndexDb(userId, {
          iconUser,
          email,
          firstName,
          lastName,
        })
        navigate(`/userProfile/${userId}`)
      } else {
        setFeedback({
          type: "error",
          message: "Erreur lors de la mise à jour.",
        })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error)
      setFeedback({
        type: "error",
        message: "Une erreur est survenue. Veuillez réessayer.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <div className="flex flex-col gap-8">
        <ProfileTabs userId={userId} />

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl bg-surface-raised p-8"
        >
          {feedback && (
            <p className="rounded bg-red-950 px-3 py-2 text-sm text-red-400">
              {feedback.message}
            </p>
          )}

          <AvatarPicker value={iconUser} onChange={setIconUser} />

          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="lastName" className="font-semibold text-gray-300">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="firstName" className="font-semibold text-gray-300">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Mon email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer self-start rounded-lg bg-primary px-8 py-3 font-semibold text-black transition-colors hover:bg-primary-dark hover:text-white disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  )
}

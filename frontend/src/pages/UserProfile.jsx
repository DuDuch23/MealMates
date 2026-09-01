import { useEffect, useState } from "react"
import { useParams } from "react-router"
import ProfileTabs from "../components/ProfileTabs"
import { getUser } from "../services/userApi"
import { getUserIndexDb } from "../services/indexDb"

export default function UserProfile() {
  const params = useParams()
  const userId = params.id ? parseInt(params.id, 10) : null

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUserData = async () => {
      try {
        const localUser = await getUserIndexDb(userId)
        if (localUser) {
          setUser(localUser)
        } else {
          const response = await getUser(userId)
          setUser(response.data)
        }
      } catch (fetchError) {
        console.error("Erreur lors de la récupération des données :", fetchError)
        setError("Une erreur est survenue.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return <p className="p-8 text-gray-300">Chargement...</p>
  }
  if (error) {
    return <p className="p-8 text-red-400">{error}</p>
  }
  if (!user) {
    return <p className="p-8 italic text-gray-400">Aucun utilisateur trouvé.</p>
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <div className="flex flex-col gap-8">
        <ProfileTabs userId={userId} />

        <div className="flex flex-col gap-8 rounded-2xl bg-surface-raised p-8">
          <div className="flex flex-col gap-3 text-lg text-gray-200">
            <p>{user.firstName}</p>
            <p>{user.lastName}</p>
            <p>{user.email}</p>
          </div>

          <div>
            <h3 className="mb-3 text-xl font-semibold text-gray-300">Mes préférences</h3>
            {user.preferences?.length > 0 ? (
              <ul className="list-disc pl-6 text-gray-300">
                {user.preferences.map((preference) => (
                  <li key={preference.id} className="mb-2">
                    {preference.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-400">Aucune préférence disponible.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

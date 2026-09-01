import { Link } from "react-router"
import { getSessionUser } from "../services/authApi"

/** Barre de navigation commune aux pages de profil utilisateur. */
export default function ProfileTabs({ userId }) {
  const sessionUser = getSessionUser()
  const isOwnProfile = sessionUser !== null && Number(sessionUser.id) === Number(userId)

  return (
    <nav className="flex flex-wrap items-center justify-center gap-4">
      <Link
        to={`/userProfile/${userId}`}
        className="font-medium text-white transition-colors hover:text-primary"
      >
        Mes informations
      </Link>
      <span className="text-gray-600">|</span>
      <Link
        to={`/userMealCard/${userId}`}
        className="font-medium text-white transition-colors hover:text-primary"
      >
        MealCard
      </Link>
      {isOwnProfile && (
        <>
          <span className="text-gray-600">|</span>
          <Link
            to={`/userModify/${userId}`}
            className="font-medium text-white transition-colors hover:text-primary"
          >
            Modifier mon compte
          </Link>
        </>
      )}
    </nav>
  )
}

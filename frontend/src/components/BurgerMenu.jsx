import { Link } from "react-router"
import UserAvatar from "./avatars/UserAvatar"
import { getSessionUser, logOut } from "../services/authApi"

/** Menu de navigation mobile, affiché uniquement pour un utilisateur connecté. */
export default function BurgerMenu({ onClose }) {
  const user = getSessionUser()

  const handleLogout = async () => {
    try {
      await logOut()
    } finally {
      // Rechargement complet : purge tout état dérivé de la session
      window.location.assign("/")
    }
  }

  if (user === null) {
    return null
  }

  return (
    <nav className="fixed inset-y-0 right-0 z-40 flex w-full flex-col gap-8 bg-black px-6 pt-24 pb-8 md:w-1/2 lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-20 right-6 cursor-pointer text-white transition-colors hover:text-primary"
        aria-label="Fermer le menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <Link
        to={`/userProfile/${user.id}`}
        onClick={onClose}
        className="flex items-center gap-3 text-lg text-white transition-colors hover:text-primary"
      >
        <UserAvatar iconId={user.iconUser} className="size-12" />
        Mon profil
      </Link>

      <ul className="flex flex-col gap-6 text-lg">
        <li>
          <Link to="/offer" onClick={onClose} className="text-white transition-colors hover:text-primary">
            Offres
          </Link>
        </li>
        <li>
          <Link to="/chooseChat" onClick={onClose} className="text-white transition-colors hover:text-primary">
            Messages
          </Link>
        </li>
        <li>
          <Link to="/addOffer" onClick={onClose} className="text-white transition-colors hover:text-primary">
            Ajouter une offre
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="cursor-pointer text-white transition-colors hover:text-primary"
          >
            Se déconnecter
          </button>
        </li>
      </ul>
    </nav>
  )
}

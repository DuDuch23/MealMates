import { Link } from "react-router"
import logo from "../assets/logo-mealmates.png"
import UserAvatar from "./avatars/UserAvatar"
import { getSessionUser, logOut } from "../services/authApi"

const navigationLinks = [
  {
    to: "/offer",
    label: "Offres",
  },
  {
    to: "/chooseChat",
    label: "Messages",
  },
  {
    to: "/addOffer",
    label: "Ajouter une offre",
  },
]

export default function Header({ onProfileClick }) {
  const user = getSessionUser()

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      await logOut()
    } finally {
      // Rechargement complet : purge tout état dérivé de la session
      window.location.assign("/")
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-neutral-800/60 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo MealMates" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold text-white md:text-3xl">MealMates</span>
          </Link>

          {user !== null && (
            <nav className="hidden items-center gap-6 lg:flex">
              {navigationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-200 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="cursor-pointer text-gray-200 transition-colors hover:text-primary"
              >
                Se déconnecter
              </button>
            </nav>
          )}
        </div>

        {user !== null ? (
          <>
            <Link
              to={`/userProfile/${user.id}`}
              className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-1 transition-colors hover:bg-primary-dark lg:flex"
            >
              <UserAvatar iconId={user.iconUser} className="size-10" />
              <span className="font-medium text-black">{user.firstName}</span>
            </Link>
            <button
              type="button"
              onClick={onProfileClick}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-1 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <UserAvatar iconId={user.iconUser} className="size-10" />
              <span className="font-medium text-black">{user.firstName}</span>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-3 md:gap-5">
            <Link
              to="/inscription"
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-black transition-colors hover:bg-primary-dark hover:text-white md:px-6 md:py-3"
            >
              Inscription
            </Link>
            <Link
              to="/connexion"
              className="rounded-lg border border-primary px-4 py-2 font-semibold text-primary transition-colors hover:bg-primary hover:text-black md:px-6 md:py-3"
            >
              Connexion
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

import { Link } from "react-router"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-sunken px-8 text-center">
      <h1 className="text-8xl font-bold text-red-400 drop-shadow-lg">404</h1>
      <p className="text-xl text-gray-300">Oups ! Cette page n'existe pas.</p>
      <Link
        to="/"
        className="rounded-xl bg-primary-dark px-6 py-3 text-lg text-white transition-colors hover:bg-primary hover:text-black"
      >
        Retour à l'accueil
      </Link>
    </div>
  )
}

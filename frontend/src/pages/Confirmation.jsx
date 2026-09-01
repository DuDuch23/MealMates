import { Link } from "react-router"

/** Page de remerciement affichée après un échange confirmé. */
export default function Confirmation() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121b17] p-5">
      <div className="max-w-md rounded-xl bg-[#1e2a24] p-10 text-center shadow-[0_0_15px_rgba(80,255,180,0.5)]">
        <h1 className="mb-4 text-3xl font-bold text-emerald-400 md:text-4xl">
          Merci d'avoir utilisé MealMates !
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-emerald-400">
          Nous sommes ravis que vous ayez effectué un échange avec nous.
          <br />
          Votre confiance nous honore. Bon appétit et à bientôt !
        </p>
        <Link
          to="/"
          className="inline-block rounded-lg border-2 border-emerald-400 px-8 py-3 text-emerald-400 transition-colors hover:bg-emerald-400 hover:text-[#121b17]"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

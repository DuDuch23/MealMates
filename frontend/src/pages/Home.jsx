import { useNavigate } from "react-router"
import { AiFillStar } from "react-icons/ai"
import AutoCarousel from "../components/AutoCarousel"
import landingBackground from "../assets/landing-background.png"
import illustration from "../assets/illustration.jpeg"

const reviews = [
  {
    name: "Louis Dupont",
    avatar: "https://i.pravatar.cc/150?img=8",
    date: "12 juin 2025",
    text: "Super concept, j'ai réduit mes déchets et rencontré des voisins sympas.",
    stars: 5,
  },
  {
    name: "Julie Martin",
    avatar: "https://i.pravatar.cc/150?img=5",
    date: "8 juin 2025",
    text: "Facile d'utilisation et très pratique pour écouler des surplus.",
    stars: 4,
  },
  {
    name: "Mohamed El Amrani",
    avatar: "https://i.pravatar.cc/150?img=7",
    date: "2 juin 2025",
    text: "Je recommande à 100%, ça devrait exister depuis longtemps.",
    stars: 5,
  },
]

/** Page d'accueil publique (landing) présentée aux visiteurs non connectés. */
export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-black">
      <section className="relative flex min-h-[90vh] items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${landingBackground})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

        <div className="relative z-10 flex w-11/12 max-w-4xl flex-col items-center gap-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            Et si on mangeait moins cher, plus respectueux de la planète ?
          </h1>
          <p className="max-w-2xl rounded-3xl bg-white p-6 text-lg text-gray-800 shadow-xl">
            Luttez contre le gaspillage en achetant à d'autres particuliers, et proposez vos
            propres surplus alimentaires.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-8 px-6 py-16 md:flex-row">
        <img
          src={illustration}
          alt="Illustration de plats partagés entre voisins"
          className="min-h-64 w-full rounded-2xl object-cover md:w-1/2"
        />
        <div className="flex flex-col gap-6 md:w-1/2">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Obtenez des offres locales, qui suivent vos habitudes alimentaires
          </h2>
          <button
            type="button"
            onClick={() => navigate("/inscription")}
            className="w-fit cursor-pointer rounded-2xl bg-primary-dark px-8 py-4 font-bold text-white transition-colors hover:bg-primary hover:text-black"
          >
            M'inscrire maintenant
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Une vaste sélection de produits
        </h2>
        <AutoCarousel />
      </section>

      <section className="bg-neutral-900 py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Avis de nos utilisateurs
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="flex flex-col gap-4 rounded-2xl bg-surface-sunken p-6 shadow-lg transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatar}
                    alt={`Avatar de ${review.name}`}
                    className="size-14 rounded-full border-2 border-primary-dark object-cover"
                  />
                  <div>
                    <strong className="block text-white">{review.name}</strong>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>
                </div>

                <p className="grow text-sm leading-relaxed text-gray-300">{review.text}</p>

                <div className="flex justify-center gap-1">
                  {[...Array(review.stars)].map((_, index) => (
                    <AiFillStar key={index} color="#ffc107" size={20} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

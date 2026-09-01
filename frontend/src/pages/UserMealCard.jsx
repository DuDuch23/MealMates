import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts"
import ProfileTabs from "../components/ProfileTabs"
import OfferCard from "../components/OfferCard"
import { fetchStats } from "../services/userApi"
import { getOffersBySeller } from "../services/offerApi"

const INITIAL_VISIBLE_OFFERS = 10

const statBars = [
  {
    dataKey: "transactions",
    fill: "#8884d8",
    name: "Transactions",
  },
  {
    dataKey: "kg",
    fill: "#82ca9d",
    name: "Aliments sauvés (kg)",
  },
  {
    dataKey: "earned",
    fill: "#ffc658",
    name: "€ gagnés",
  },
  {
    dataKey: "saved",
    fill: "#ff8042",
    name: "€ économisés",
  },
]

function toChartData(entries, labelKey, formatLabel = (value) => value) {
  return (entries || []).map((entry) => ({
    label: formatLabel(entry[labelKey]),
    kg: entry.kg || 0,
    transactions: entry.transactions || 0,
    earned: entry.earned || 0,
    saved: entry.saved || 0,
  }))
}

export default function UserMealCard() {
  const params = useParams()
  const userId = params.id ? parseInt(params.id, 10) : null

  const [sellerOffers, setSellerOffers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_OFFERS)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchAllData = async () => {
      try {
        const offersResponse = await getOffersBySeller(userId)
        setSellerOffers(offersResponse?.data || [])

        if (sessionStorage.getItem("token")) {
          const statsResponse = await fetchStats(userId)
          setStats(statsResponse)
        }
      } catch (fetchError) {
        console.error("Erreur lors de la récupération des données :", fetchError)
        setError("Une erreur est survenue.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [userId])

  if (loading) {
    return <p className="p-8 text-gray-300">Chargement...</p>
  }
  if (error) {
    return <p className="p-8 text-red-400">{error}</p>
  }

  const renderChart = (title, data) => {
    if (data.length === 0) {
      return null
    }

    return (
      <div>
        <p className="mb-2 font-semibold text-gray-400">{title}</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            {statBars.map((bar) => (
              <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <div className="flex flex-col gap-8">
        <ProfileTabs userId={userId} />

        <div className="flex flex-col gap-10 rounded-2xl bg-surface-raised p-4 md:p-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">Mes offres</h2>

            {sellerOffers.length === 0 ? (
              <p className="italic text-gray-400">
                Cet utilisateur n'a pas encore mis d'offre en ligne.
              </p>
            ) : (
              <>
                <ul className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sellerOffers.slice(0, visibleCount).map((offer) => (
                    <li key={offer.id}>
                      <OfferCard offer={offer} />
                    </li>
                  ))}
                </ul>

                {sellerOffers.length > visibleCount && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 5)}
                    className="cursor-pointer rounded-xl bg-primary-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-primary hover:text-black"
                  >
                    Voir plus d'offres...
                  </button>
                )}
              </>
            )}
          </section>

          {stats && (
            <section>
              <h2 className="mb-6 text-xl font-semibold text-white">Tableau de bord</h2>
              <div className="flex flex-col gap-8">
                {renderChart("Cette semaine", toChartData(stats.byWeek, "week"))}
                {renderChart(
                  "Par mois",
                  toChartData(stats.byMonth, "month", (month) =>
                    format(new Date(`${month}-01`), "MMM yy")
                  )
                )}
                {renderChart("Par année", toChartData(stats.byYear, "year"))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

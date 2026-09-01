import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import StatCard from "../components/StatCard"
import { fetchStats } from "../services/userApi"
import { getSessionUser } from "../services/authApi"

/** Tableau de bord personnel : impact anti-gaspillage de l'utilisateur. */
export default function UserDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const user = getSessionUser()

  useEffect(() => {
    if (!user?.id) {
      setError("Vous devez être connecté pour voir votre tableau de bord.")
      return
    }

    const loadStats = async () => {
      try {
        const response = await fetchStats(user.id)
        setStats(response)
      } catch (fetchError) {
        console.error("Erreur de chargement des statistiques :", fetchError)
        setError("Erreur de chargement des statistiques.")
      }
    }

    loadStats()
    // user?.id vient de sessionStorage : stable pendant la vie du composant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return <p className="p-8 text-red-400">{error}</p>
  }
  if (!stats) {
    return <p className="p-8 text-gray-300">Chargement…</p>
  }

  const pieData = Object.entries(stats.transactionsByType || {}).map(([name, value]) => ({
    name,
    value,
  }))
  const barData = (stats.byMonth || []).map((month) => ({
    month: format(new Date(`${month.month}-01`), "MMM yy"),
    kg: month.kg,
  }))

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Mon tableau de bord</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Transactions" value={stats.transactionsCount} />
        <StatCard title="Kg sauvés" value={stats.totalBoughtKg + stats.totalGivenKg} />
        <StatCard title="€ gagnés" value={`${stats.moneyEarned.toFixed(2)} €`} />
        <StatCard title="€ économisés" value={`${stats.moneySaved.toFixed(2)} €`} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar dataKey="kg" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

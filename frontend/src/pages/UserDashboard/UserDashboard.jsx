import { BarChart, Bar, XAxis, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchStats } from "../../service/requestApi";
import StatCard from "../../components/StatCard/StatCard";
import { format } from "date-fns";
import styles from "./UserDashboard.module.css";

export default function Dashboard() {
  const { data, error } = useSWR("dashboard-stats", fetchStats, { refreshInterval: 300000 });
  const [filter, setFilter] = useState("year");
  if (error) return <p>Erreur de chargement</p>;
  if (!data) return <p>Chargement…</p>;

  const pieData = Object.entries(data.transactionsByType).map(([k, v]) => ({ name: k, value: v }));
  const barData = data.byMonth.map((m) => ({ month: format(new Date(m.month + "-01"), "MMM yy"), kg: m.kg }));

  return (
    <div className={styles.user_dashboard}>
      <h1>Mon tableau de bord</h1>
      <div className={styles.statGrid}>
        <StatCard title="Transactions" value={data.transactionsCount} />
        <StatCard title="Kg sauvés" value={data.totalBoughtKg + data.totalGivenKg} />
        <StatCard title="€ gagnés" value={`${data.moneyEarned.toFixed(2)} €`} />
        <StatCard title="€ économisés" value={`${data.moneySaved.toFixed(2)} €`} />
      </div>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="week">Semaine</option>
        <option value="month">Mois</option>
        <option value="year">Année</option>
      </select>

      <div className={styles.chartsWrapper}>
        <ResponsiveContainer width="49%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <Tooltip />
            <Bar dataKey="kg" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="49%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
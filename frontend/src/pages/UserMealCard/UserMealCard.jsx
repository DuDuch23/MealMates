import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { getUser, getOfferBySeller, fetchStats } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import { IconUser } from "../../components/IconUser/iconUser";
import StatCard from "../../components/StatCard/StatCard";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, PieChart, Pie, Tooltip, ResponsiveContainer
} from "recharts";
import styles from './UserMealCard.module.css';

function UserMealCard() {
  const params = useParams();
  const userId = params.id ? parseInt(params.id) : null;

  const [user, setUser] = useState(null);
  const [userOffer, setOfferUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [filter, setFilter] = useState("year");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      if (!userId) return;

      try {
        const token = sessionStorage.getItem("token");
        const localData = await getUserIndexDB(userId);
        if (localData) {
          setUser(localData);
          console.log("Utilisateur depuis IndexedDB :", localData);
        } else {
          const remoteData = await getUser({ user: userId });
          setUser(remoteData.data);
          console.log("Utilisateur depuis API :", remoteData.data);
        }

        // Récupération offres
        const offerData = await getOfferBySeller(userId);
        setOfferUser(offerData.data);

        if (token && userId) {
            const dashboardData = await fetchStats(userId, token);
            setDashboardStats(dashboardData);
        } else {
            console.warn("Token ou userId manquant pour fetchStats");
        }

        // Récupération stats
        const statsData = await fetchStats();
        setDashboardData(statsData);

      } catch (err) {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, [userId]);

    if (loading) return <p>Chargement…</p>;
    if (error) return <p>{error}</p>;

    const userPreference =  () => {
        if (userOffer) {
            console.log(userOffer);
            return (
                <div className={styles[`offer-container`]}>
                    <h3>Mes offres :</h3>
                    <ul>
                        {userOffer.map((offer) => (
                            <li key={offer.id}>{offer.product}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return <p>Aucune préférence disponible.</p>;
        }
    };

    const renderDashboard = () => {
        if (!dashboardStats) return null;

        const pieData = dashboardStats.transactionsByType
            ? Object.entries(dashboardStats.transactionsByType).map(([k, v]) => ({ name: k, value: v }))
            : [];

        const barData = dashboardStats.byMonth
            ? dashboardStats.byMonth.map((m) => ({ month: format(new Date(m.month + "-01"), "MMM yy"), kg: m.kg }))
            : [];

        return (
            <div className={styles.user_dashboard}>
                <h2>Tableau de bord</h2>
                <div className={styles.statGrid}>
                    <StatCard title="Transactions" value={dashboardStats.transactionsCount} />
                    <StatCard title="Kg sauvés" value={dashboardStats.quantitySaved} />
                    <StatCard title="€ gagnés" value={`${dashboardStats.moneyEarned.toFixed(2)} €`} />
                    <StatCard title="€ économisés" value={`${dashboardStats.moneySaved.toFixed(2)} €`} />
                </div>
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
    };


    return (
        <div className={styles.cardUser}>
            <nav>
                <Link to={"/"}>
                <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                <h2>MealMates</h2>
                </Link>
            </nav>

            <IconUser id={user?.iconUser} />

            <div className={styles.contentUser}>
                <div className={styles.containerLink}>
                <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                <span>|</span>
                <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                <span>|</span>
                <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                </div>

                <div className={styles.containerInfoUser}>
                    <div className={`${styles.basicsElements} ${styles.card}`}>
                        <ul className={styles.listUser}>
                        <li><p>{user.firstName}</p></li>
                        </ul>
                        <div>
                        <p>Ou me trouver : <br />{user.location}</p>
                        </div>
                    </div>

                    <div className={styles.offerContainer}>
                        <h3>Mes offres :</h3>
                        <ul>
                        {userOffer && userOffer.map((offer) => (
                            <li key={offer.id}>{offer.product}</li>
                        ))}
                        </ul>
                    </div>
                {userPreference()}
                {renderDashboard()}
                </div>
            </div>
        </div>
    );
}

export default UserMealCard;

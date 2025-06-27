import { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { getUser, getOfferBySeller, fetchStats } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import { IconUser } from "../../components/IconUser/iconUser";
import StatCard from "../../components/StatCard/StatCard";
import CardOffer from "../../components/CardOffer/CardOffer";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, PieChart, Pie, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import styles from './UserMealCard.module.css';

function UserMealCard() {
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;

    const [user, setUser] = useState(null);
    const [userOffer, setOfferUser] = useState(null);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [filter, setFilter] = useState("year");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(10);

    const showMoreOffers = () => {
        setVisibleCount((prev) => prev + 5);
    };

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
            return (
                <div className={styles[`offer-container`]}>
                    <h3>Mes offres :</h3>
                    <ul>
                        {userOffer.slice(0, visibleCount).map((offer) => (
                            <CardOffer key={offer.id} offer={offer} />
                        ))}
                    </ul>
                    {userOffer.length > visibleCount && (
                        <button onClick={showMoreOffers} className={styles["show-more-button"]}>
                            Voir plus d'offres...
                        </button>
                    )}
                </div>
            );
        } else {
            return <p>Cette utilisateur n'a toujours pas mis d'offre en ligne.</p>;
        }
    };

    const renderDashboard = () => {
        if (!dashboardStats) return null;

        const pieData = dashboardStats.transactionsByType
            ? Object.entries(dashboardStats.transactionsByType).map(([k, v]) => ({ name: k, value: v }))
            : [];

        const weekData = dashboardStats.byWeek.map((m) => ({
            week: m.week,
            kg: m.kg || 0,
            transactions: m.transactions || 0,
            earned: m.earned || 0,
            saved: m.saved || 0
        }));

        const monthData = dashboardStats.byMonth.map((m) => ({
            month: format(new Date(m.month + "-01"), "MMM yy"),
            kg: m.kg || 0,
            transactions: m.transactions || 0,
            earned: m.earned || 0,
            saved: m.saved || 0
        }));

        const yearData = dashboardStats.byYear.map((m) => ({
            year: m.year,
            kg: m.kg || 0,
            transactions: m.transactions || 0,
            earned: m.earned || 0,
            saved: m.saved || 0
        }));

        return (
            <div className={styles.user_dashboard}>
                <h2>Tableau de bord</h2>
                {/* <div className={styles.statGrid}>
                    <StatCard title="Transactions" value={dashboardStats.transactionsCount} />
                    <StatCard title="Nombre d'aliments sauvés" value={dashboardStats.quantitySaved} />
                    <StatCard title="€ gagnés" value={`${dashboardStats.moneyEarned.toFixed(2)} €`} />
                    <StatCard title="€ économisés" value={`${dashboardStats.moneySaved.toFixed(2)} €`} />
                </div> */}
                <div className={styles.chartsWrapper}>
                    <p>Cette semaine</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weekData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="transactions" fill="#8884d8" name="Transactions" />
                            <Bar dataKey="kg" fill="#82ca9d" name="Aliments sauvés (kg)" />
                            <Bar dataKey="earned" fill="#ffc658" name="€ gagnés" />
                            <Bar dataKey="saved" fill="#ff8042" name="€ économisés" />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="transactions" fill="#8884d8" name="Transactions" />
                            <Bar dataKey="kg" fill="#82ca9d" name="Aliments sauvés (kg)" />
                            <Bar dataKey="earned" fill="#ffc658" name="€ gagnés" />
                            <Bar dataKey="saved" fill="#ff8042" name="€ économisés" />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={yearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="transactions" fill="#8884d8" name="Transactions" />
                            <Bar dataKey="kg" fill="#82ca9d" name="Aliments sauvés (kg)" />
                            <Bar dataKey="earned" fill="#ffc658" name="€ gagnés" />
                            <Bar dataKey="saved" fill="#ff8042" name="€ économisés" />
                        </BarChart>
                    </ResponsiveContainer>
                    {/* <ResponsiveContainer width="49%" height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer> */}
                </div>
            </div>
        );
    };


    return (
        <div className={styles.cardUser}>
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

                    {userPreference()}
                    {renderDashboard()}
                </div>
            </div>
        </div>
    );
}

export default UserMealCard;

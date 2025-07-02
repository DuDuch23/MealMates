import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import { IconUser } from "../../components/IconUser/iconUser";
import styles from './UserProfile.module.css'

const UserProfile = () => {
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;
    const actualId = JSON.parse(sessionStorage.getItem("user"));

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            if (!userId) return;

            try {
                const localData = await getUserIndexDB(userId);

                if (localData) {
                    setUser(localData);
                } else {
                    const token = sessionStorage.getItem("token");
                    const remoteData = await getUser({ user: userId, token });
                    setUser(remoteData.data);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des données :", err);
                setError("Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [userId]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>Aucun utilisateur trouvé.</p>;

    function infoUser() {
        return (
            <>
                <div><p>{user?.firstName}</p></div>
                <div><p>{user?.lastName}</p></div>
                <div><p>{user?.email}</p></div>
            </>
        );
    }

    const userPreference = () => {
        if (user) {
            return (
                <div className={styles.preferences}>
                    <h3>Mes préférences</h3>
                    {user.preferences?.length > 0 ? (
                    <ul className={styles.preferenceUser}>
                        {user.preferences.map((preference) => (
                            <li key={preference.id}>{preference.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune préférence disponible.</p>
                )}
                </div>
            );
        } else {
            return <p>Aucune préférence disponible.</p>;
        }
    };

    return (
        <>
            <div className={styles.cardUser}>
                <div className={styles.contentUser}>
                    <div className={styles.containerLink}>
                        <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                        <span>|</span>
                        <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                        <span>|</span>
                        {userId == actualId.id && (
                          <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                        )}
                    </div>
                    <div className={styles.containerInfoUser}>
                        <div className={styles.basicsElements}>
                            {infoUser()}
                        </div>
                        {userPreference()}
                    </div>
                </div>
            </div>
        </>);
};

export default UserProfile;
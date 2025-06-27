import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import { IconUser } from "../../components/IconUser/iconUser";
import { ContainerLinkUserPage } from "../../components/ContainerLinkUserPage/ContainerLinkUserPage";
import styles from './UserProfile.module.css'

const UserProfile = () => {
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;

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
                <div className={styles.iconUser} >
                    <IconUser iconId={user.iconUser}/>
                </div>
                <div className={styles.contentUser}>
                    <ContainerLinkUserPage />
                    <div className={styles.containerLink}>
                        <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                        <span>
                          <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                          </svg>
                        </span>
                        <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                        <span>
                          <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                          </svg>
                        </span>
                        <Link to={`/dashboard`}>Mon tableau de bord</Link>
                        <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
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
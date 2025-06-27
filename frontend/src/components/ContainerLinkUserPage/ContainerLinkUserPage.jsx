import React from 'react';
import { Link } from 'react-router';
// import styles from './TonFichierCSS.module.css'; // Assure-toi que ce fichier existe

const ContainerLinkUserPage = ({ id }) => {
    const sessionUser = JSON.parse(sessionStorage.getItem('user'));
    const isOwner = sessionUser?.id === id;

    const userId = id;

    return (
        <div className={styles.containerLink}>
            <Link to={`/userProfile/${userId}`}>Mes informations</Link>
            <span>
                <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1.26" y1="0" x2="1.26" y2="35.92" stroke="#EFF1F5" strokeWidth="1.24"/>
                </svg>
            </span>
            <Link to={`/userMealCard/${userId}`}>MealCard</Link>
            <span>
                <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1.26" y1="0" x2="1.26" y2="35.92" stroke="#EFF1F5" strokeWidth="1.24"/>
                </svg>
            </span>

            {!isOwner && (
                <>
                    <Link to={`/dashboard`}>Mon tableau de bord</Link>
                    <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
                </>
            )}
        </div>
    );
};

export default ContainerLinkUserPage;

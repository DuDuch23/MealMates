import React from 'react';
import styles from './confirmation.module.css';

const ThankYouPage = () => {
  return (
    <div className={styles["thankyou-container"]}>
      <div className={styles["thankyou-card"]}>
        <h1 className={styles["thankyou-title"]}>Merci d'avoir utilisé MealMates !</h1>
        <p className={styles["thankyou-message"]}>
          Nous sommes ravis que vous ayez effectué un échange avec nous.<br />
          Votre confiance nous honore. Bon appétit et à bientôt !
        </p>
        <button className={styles["thankyou-button"]} onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
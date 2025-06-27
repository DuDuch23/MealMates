import React from "react";
import styles from "./Footer.module.css";
import logo from "../../assets/logo-mealmates.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__content}>
        <div className={styles.footer__logo}>
          <img src={logo} alt="Mealmates Logo" />
          <p>Mealmates</p>
        </div>
        <div className={styles.footer__links}>
          <a href="#">Mentions légales</a>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Contact</a>
        </div>
        <div className={styles.footer__socials}>
        </div>
        <div className={styles.footer__credits}>
          <p>© Mealmates 2025 - Mangeons mieux, ensemble.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

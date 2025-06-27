import React from 'react';
import { Link } from 'react-router'; 
import styles from './NotFound.module.scss'; 

const NotFound = () => {
  return (
    <div className={styles["not-found"]}>
      <h1>404</h1>
      <p>Oups ! Cette page n'existe pas.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default NotFound;

import { useState,useEffect } from "react";

import {Link} from "react-router";
import styles from "./offer.module.css";

function Offer(){
    return(
    <div className={styles["container"]}>
        <nav>
            <ul className={styles["container-pre-offer"]}>
                <li>
                    <img src="/img/offre/sushi.png" alt="icon de sushi" />
                    <p>Sushi</p>
                </li>
                <li>
                    <img src="/img/offre/burger.png" alt="" />
                    <p>Burger</p>
                </li>
                <li>
                    <img src="/img/offre/tarte.png" alt="" />
                    <p>Tarte</p>
                </li>
                <li>
                    <img src="/img/offre/produits-frais.png" alt="" />
                    <p>Produit Frais</p>
                </li>
                <li>
                    <img src="/img/offre/derniere-chance.png" alt="" />
                    <p>Derniére Chance</p>
                </li>
            </ul>
            <ul className={styles["container-offer"]}>
                <li>Rechercher</li>
                <li>Vegan</li>
                <li>Hight Protein</li>
                <li>Halal</li>
                <li>Low Carb</li>
            </ul>
        </nav>
        <a href="#" id={styles["new-offer"]}>Ajouter Une Offre</a>
        <div className={styles["container-section"]}>
            <section className={styles["section-item"]}></section>
            <section className={styles["section-item"]}></section>
            <section className={styles["section-item"]}></section>
        </div>
    </div>
    );
}

export default Offer;
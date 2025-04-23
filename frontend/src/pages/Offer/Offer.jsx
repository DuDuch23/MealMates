import { useState,useEffect } from "react";

import {Link} from "react-router";
import "./Offer.module.css";

function Offer(){
    return(<>
    <nav>
        <ul className="container-pre-offer">
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
        <ul className="container-offer">
            <li>Rechercher</li>
            <li>Vegan</li>
            <li>Hight Protein</li>
            <li>Halal</li>
            <li>Low Carb</li>
        </ul>
    </nav>
    <a href="#" id="new-offer">Ajouter Une Offre</a>
    <div className="container-section">
        <section className="section-item"></section>
        <section className="section-item"></section>
        <section className="section-item"></section>
    </div>

    </>
    );
}

export default Offer;
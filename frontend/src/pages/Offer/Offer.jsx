import { useState, useEffect } from "react";
import {
  searchOfferByTitle,
  getVeganOffers,
  getOffers,
  getLastChanceOffers,
  getAgainOffers,
  getLocalOffers,
} from "../../service/requestApi";
import { Link } from "react-router";
import styles from "./Offer.module.css";
import SearchBar from "../../components/SearchBar/SearchBar";
import SliderSection from "../../components/SliderOffers/SliderOffers";
import OffersMap from "../../components/GoogleMaps/GoogleMaps";
import SkeletonCard from "../../components/SkeletonCard/SkeletonCard";
import AdvancedFilters from "../../components/AdvanceFilters/AdvanceFilters";
import AllCategory from "../../components/AllCategory/AllCategory";

import "swiper/css";

function Offer() {
  const token = sessionStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const [pos, setPos] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [offers, setOffers] = useState([]);
  const [veganOffers, setVeganOffers] = useState([]);
  const [againOffers, setAgainOffers] = useState([]);
  const [lastChanceOffers, setLastChanceOffers] = useState([]);
  const [localOffers, setLocalOffers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [filterCategories, setCategories] = useState([]);

  // Loading states
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingVegan, setLoadingVegan] = useState(true);
  const [loadingAgain, setLoadingAgain] = useState(true);
  const [loadingLastChance, setLoadingLastChance] = useState(true);
  const [loadingLocal, setLoadingLocal] = useState(true);

  // Filtrage
  const [filters, setFilters] = useState({
    types: [],
    price: { min: "", max: "" },
    minRating: 0,
    maxDistance: 10,
  });

  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("user", userData.user.id);
    }
  }, [userData]);

  // Géolocalisation
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) =>
        setPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => {
        console.warn("Erreur de géolocalisation :", error);
        const fallback = { lat: 48.8566, lng: 2.3522 };
        setPos(fallback);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // Chargement des offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoadingOffers(true);
        const data = await getOffers();
        setOffers(data?.data || []);
      } catch (err) {
        console.error(err);
        setOffers([]);
      } finally {
        setLoadingOffers(false);
      }
    };

    const fetchVeganOffers = async () => {
      try {
        setLoadingVegan(true);
        const data = await getVeganOffers();
        setVeganOffers(data?.data || []);
      } catch (err) {
        console.error(err);
        setVeganOffers([]);
      } finally {
        setLoadingVegan(false);
      }
    };

    const fetchLastChanceOffers = async () => {
      try {
        setLoadingLastChance(true);
        const data = await getLastChanceOffers();
        setLastChanceOffers(data?.data || []);
      } catch (err) {
        console.error(err);
        setLastChanceOffers([]);
      } finally {
        setLoadingLastChance(false);
      }
    };

    const fetchAgainOffers = async () => {
      try {
        setLoadingAgain(true);
        if (!token) {
          setAgainOffers([]);
          setLoadingAgain(false);
          return;
        }
        const data = await getAgainOffers(token);
        setAgainOffers(data?.data || []);
      } catch (err) {
        console.error(err);
        setAgainOffers([]);
      } finally {
        setLoadingAgain(false);
      }
    };

    const fetchLocalOffers = async () => {
      try {
        setLoadingLocal(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await getLocalOffers(latitude, longitude);
            setLocalOffers(data?.data || []);
            setLoadingLocal(false);
          },
          (err) => {
            console.error(err);
            setLocalOffers([]);
            setLoadingLocal(false);
          }
        );
      } catch (err) {
        console.error(err);
        setLocalOffers([]);
        setLoadingLocal(false);
      }
    };

    fetchOffers();
    fetchVeganOffers();
    fetchLastChanceOffers();
    fetchAgainOffers();
    fetchLocalOffers();
  }, [token]);

  // Recherche
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      const results = await searchOfferByTitle(query);
      setSearchResults(results?.data || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  };

  // Filtrage local des offres en fonction des filtres
  const filteredOffers = offers.filter((offer) => {
    // if (filters.types.length > 0 && !filters.types.includes(offer.type)) return false;

    // if (
      // (filters.price.min && offer.price < Number(filters.price.min)) ||
      // (filters.price.max && offer.price > Number(filters.price.max))
    // )
    // return false;

    // if (filters.minRating && offer.rating < filters.minRating) return false;

    if (
      filters.maxDistance &&
      pos && // vérifier que pos est défini
      offer.location && // vérifier que l'offre a une position
      getDistanceFromLatLng(pos, offer.location) > filters.maxDistance
    )
    
    // console.log(1);
    // return false;

    return true;
  });

  // Fonction de calcul de distance entre deux points (en km)
  function getDistanceFromLatLng(pos1, pos2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(pos2.lat - pos1.lat);
    const dLng = toRad(pos2.lng - pos1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  
  const renderSlider = (loading, title, offers, type, emptyMessage) => {
      if (loading) {
          return (
              <SliderSection title={title}>
                  {[...Array(5)].map((_, idx) => <SkeletonCard key={idx} />)}
              </SliderSection>
          );
      }
      if (!offers || offers.length === 0) {
          return <p>{emptyMessage}</p>;
      }
      return <SliderSection title={title} offers={offers} type={type} />;
  };


  return (
    <section className={styles["container-offer"]}>
      <SearchBar onSearch={handleSearch} />

      <nav className={styles["container-offer__filter"]}>
        <ul className={styles["container-offer__filter-reference-list"]}>
          {/* <AllCategory /> */}
        </ul>
      </nav>

      <AdvancedFilters filters={filters} setFilters={setFilters} />

      <div className={styles["container-offer__new-offer-show-map"]}>
        <Link className={styles["container-offer__new-offer"]} to={"/addOffer"}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 9V19M9 14H19M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
              stroke="#F3F3F3"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Ajouter une nouvelle offre</p>
        </Link>
        <button
          className={styles["container-offer__show-map"]}
          onClick={() => setShowMap(!showMap)}
        >
          <p>Afficher la carte des offres</p>
        </button>
      </div>

      {showMap && (
        
        <div
          className={styles["container-offer__map"]}
          style={{ height: "80vh", width: "100%", top: 0, left: 0, zIndex: 98 }}
        >
          <OffersMap userPos={pos} offers={filteredOffers} setUserPos={setUserPos} />
        </div>
      )}

      <nav className={styles["container-offer__filter"]}>
          <ul className={styles["container-offer__filter-reference-list"]}>
              <AllCategory onFilter={setCategories}/>
          </ul>
      </nav>

      <div className={styles["container-offer__slider"]}>
          {searchResults.length > 0 ? (
              <>
                  <SliderSection
                  title={`Résultats pour "${searchQuery}"`}
                  offers={searchResults}
                  type={searchQuery}
                  />
              </>
          ) : (
              searchResults.code === 404 && (
                  <p>Aucune offre trouvée pour "{searchQuery}".</p>
              )
          )}
          
          {renderSlider(
              loadingAgain,
              "Recommander à nouveau",
              againOffers,
              "again",
              "Il n'y a pas d'offres à vous recommander à nouveau."
          )}
          
          {renderSlider(
              loadingLastChance,
              "Dernière chance",
              lastChanceOffers,
              "dernière chance",
              "Il n'y a pas d'offres en dernière chance pour le moment."
          )}

          {renderSlider(
              loadingVegan,
              "Ce soir je mange vegan",
              veganOffers,
              "vegans",
              "Aucune offre vegan pour le moment."
          )}
          
          {renderSlider(
              loadingLocal,
              "Tendances locales",
              localOffers,
              "locals",
              "Aucune tendance locale disponible actuellement."
          )}
      </div>

    </section>
  );
}

export default Offer;

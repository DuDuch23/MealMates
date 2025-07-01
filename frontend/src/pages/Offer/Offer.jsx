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

  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingVegan, setLoadingVegan] = useState(true);
  const [loadingAgain, setLoadingAgain] = useState(true);
  const [loadingLastChance, setLoadingLastChance] = useState(true);
  const [loadingLocal, setLoadingLocal] = useState(true);

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

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoadingOffers(true);
        const data = await getOffers();
        setOffers(data?.data || []);
        // console.log(data.data);
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
        console.log("vegan",data.data);

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
        console.log("last chance", data.data);

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
        console.log("offre again",data.data);

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
        console.log("local",data.data);

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

  function getDistanceFromLatLng(pos1, pos2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; 
    const dLat = toRad(pos2.lat - pos1.lat);
    const dLng = toRad(pos2.lng - pos1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pos1.lat)) * Math.cos(toRad(pos2.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const filterOffers = (offersList) => {
    return offersList.filter((offer) => {
      if (!offer) return false;

      const categoryIds = (offer.categories || []).map((cat) =>
        typeof cat === "object" ? cat.id : cat
      ).map(String);

      if (filters.types.length > 0) {
        const selectedTypes = filters.types.map(String);
        if (!categoryIds.some((catId) => selectedTypes.includes(catId))) {
          return false;
        }
      }

      const minPrice = filters.price?.min?.trim() === "" ? null : Number(filters.price.min);
      const maxPrice = filters.price?.max?.trim() === "" ? null : Number(filters.price.max);
      if (minPrice !== null && offer.price < minPrice) return false;
      if (maxPrice !== null && offer.price > maxPrice) return false;

      if (
        filters.maxDistance &&
        pos &&
        offer.location &&
        getDistanceFromLatLng(pos, offer.location) > filters.maxDistance
      ) {
        return false;
      }

      if (filters.minRating && offer.rating < filters.minRating) return false;

      return true;
    });
  };

  const filteredOffers = filterOffers(offers);
  const filteredVeganOffers = filterOffers(veganOffers);
  const filteredLastChanceOffers = filterOffers(lastChanceOffers);
  const filteredAgainOffers = filterOffers(againOffers);
  const filteredLocalOffers = filterOffers(localOffers);

  const renderSlider = (loading, title, offers, type, emptyMessage) => {
    if (loading) {
      return (
        <SliderSection title={title}>
          {[...Array(5)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
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

      <AdvancedFilters filters={filters} setFilters={setFilters} />

      <div className={styles["container-offer__new-offer-show-map"]}>
        <Link to="/addOffer" className={styles["container-offer__new-offer"]}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
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

      {showMap && pos && (
        <div className={styles["container-offer__map"]} style={{ height: "80vh" }}>
          <OffersMap userPos={pos} offers={filteredOffers} setUserPos={setUserPos} />
        </div>
      )}

      <div className={styles["container-offer__slider"]}>
        {searchResults.length > 0 ? (
          <SliderSection
            title={`Résultats pour "${searchQuery}"`}
            offers={searchResults}
            type="search"
          />
        ) : (
          searchQuery && <p>Aucune offre trouvée pour "{searchQuery}".</p>
        )}

        {renderSlider(
          loadingAgain,
          "Recommander à nouveau",
          filteredAgainOffers,
          "again",
          "Aucune offre recommandée."
        )}

        {renderSlider(
          loadingLastChance,
          "Dernière chance",
          filteredLastChanceOffers,
          "lastChance",
          "Aucune offre en dernière chance."
        )}

        {renderSlider(
          loadingVegan,
          "Ce soir je mange vegan",
          filteredVeganOffers,
          "vegan",
          "Aucune offre vegan."
        )}

        {renderSlider(
          loadingLocal,
          "Tendances locales",
          filteredLocalOffers,
          "local",
          "Aucune tendance locale."
        )}

        {renderSlider(
          loadingOffers,
          "Toutes les offres filtrées",
          filteredOffers,
          "filtered",
          "Aucune offre ne correspond aux filtres."
        )}
      </div>
    </section>
  );
}

export default Offer;

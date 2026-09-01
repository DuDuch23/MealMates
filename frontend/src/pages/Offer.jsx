import { useEffect, useState } from "react"
import { Link } from "react-router"
import SearchBar from "../components/SearchBar"
import OffersSlider from "../components/OffersSlider"
import OffersMap from "../components/OffersMap"
import SkeletonCard from "../components/SkeletonCard"
import AdvancedFilters from "../components/AdvancedFilters"
import {
  getOffers,
  getVeganOffers,
  getLastChanceOffers,
  getRecommendedOffers,
  getLocalOffers,
  searchOffersByTitle,
} from "../services/offerApi"

const PARIS_FALLBACK_POSITION = {
  lat: 48.8566,
  lng: 2.3522,
}

function getDistanceInKm(pos1, pos2) {
  const toRadians = (value) => (value * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(pos2.lat - pos1.lat)
  const dLng = toRadians(pos2.lng - pos1.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(pos1.lat)) * Math.cos(toRadians(pos2.lat)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

/** Page principale des offres : recherche, filtres, carte et carrousels thématiques. */
export default function Offer() {
  const [position, setPosition] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const [sections, setSections] = useState({
    all: { offers: [], loading: true },
    vegan: { offers: [], loading: true },
    lastChance: { offers: [], loading: true },
    recommended: { offers: [], loading: true },
    local: { offers: [], loading: true },
  })

  const [filters, setFilters] = useState({
    types: [],
    price: { min: "", max: "" },
    minRating: 0,
    maxDistance: 10,
  })

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (geoPosition) => {
        setPosition({
          lat: geoPosition.coords.latitude,
          lng: geoPosition.coords.longitude,
        })
      },
      (error) => {
        console.warn("Erreur de géolocalisation :", error)
        setPosition(PARIS_FALLBACK_POSITION)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  useEffect(() => {
    const setSection = (name, offers) => {
      setSections((previous) => ({
        ...previous,
        [name]: { offers, loading: false },
      }))
    }

    const loadSection = async (name, fetcher) => {
      try {
        const response = await fetcher()
        setSection(name, response?.data || [])
      } catch (error) {
        console.error(`Erreur de chargement des offres « ${name} » :`, error)
        setSection(name, [])
      }
    }

    loadSection("all", getOffers)
    loadSection("vegan", getVeganOffers)
    loadSection("lastChance", getLastChanceOffers)
    loadSection("recommended", getRecommendedOffers)

    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        loadSection("local", () =>
          getLocalOffers(geoPosition.coords.latitude, geoPosition.coords.longitude)
        )
      },
      (error) => {
        console.warn("Géolocalisation refusée pour les tendances locales :", error)
        setSection("local", [])
      }
    )
  }, [])

  const handleSearch = async (query) => {
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    try {
      const response = await searchOffersByTitle(query)
      setSearchResults(response?.data || [])
    } catch (error) {
      console.error("Erreur lors de la recherche :", error)
      setSearchResults([])
    }
  }

  const applyFilters = (offers) => {
    return offers.filter((offer) => {
      if (!offer) {
        return false
      }

      if (filters.types.length > 0) {
        const categoryIds = (offer.categories || [])
          .map((category) => (typeof category === "object" ? category.id : category))
          .map(String)
        const selectedTypes = filters.types.map(String)
        if (!categoryIds.some((categoryId) => selectedTypes.includes(categoryId))) {
          return false
        }
      }

      const minPrice = filters.price?.min === "" ? null : Number(filters.price.min)
      const maxPrice = filters.price?.max === "" ? null : Number(filters.price.max)
      if (minPrice !== null && offer.price < minPrice) {
        return false
      }
      if (maxPrice !== null && offer.price > maxPrice) {
        return false
      }

      if (
        filters.maxDistance &&
        position &&
        offer.location &&
        getDistanceInKm(position, offer.location) > filters.maxDistance
      ) {
        return false
      }

      if (filters.minRating && offer.rating < filters.minRating) {
        return false
      }

      return true
    })
  }

  const renderSection = (name, title, emptyMessage) => {
    const { offers, loading } = sections[name]

    if (loading) {
      return (
        <OffersSlider title={title}>
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </OffersSlider>
      )
    }

    const filteredOffers = applyFilters(offers)
    if (filteredOffers.length === 0) {
      return <p className="italic text-gray-400">{emptyMessage}</p>
    }

    return <OffersSlider title={title} offers={filteredOffers} />
  }

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-6 md:gap-12">
      <SearchBar onSearch={handleSearch} />

      <AdvancedFilters filters={filters} setFilters={setFilters} />

      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <Link
          to="/addOffer"
          className="flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 font-medium text-black shadow-inner transition-colors hover:bg-primary-dark hover:text-white"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path
              d="M14 9V19M9 14H19M26.5 14C26.5 20.9036 20.9036 26.5 14 26.5C7.09644 26.5 1.5 20.9036 1.5 14C1.5 7.09644 7.09644 1.5 14 1.5C20.9036 1.5 26.5 7.09644 26.5 14Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Ajouter une nouvelle offre
        </Link>

        <button
          type="button"
          onClick={() => setShowMap((visible) => !visible)}
          className="cursor-pointer rounded-lg bg-primary px-6 py-4 font-medium text-black shadow-inner transition-colors hover:bg-primary-dark hover:text-white"
        >
          {showMap ? "Masquer la carte des offres" : "Afficher la carte des offres"}
        </button>
      </div>

      {showMap && position && (
        <div className="relative h-[60vh] w-full overflow-hidden rounded-xl shadow-lg md:h-[80vh]">
          <OffersMap
            userPos={position}
            setUserPos={setPosition}
            offers={applyFilters(sections.all.offers)}
          />
        </div>
      )}

      <div className="flex flex-col gap-10 md:gap-12">
        {searchResults.length > 0 ? (
          <OffersSlider title={`Résultats pour « ${searchQuery} »`} offers={searchResults} />
        ) : (
          searchQuery && (
            <p className="italic text-gray-400">
              Aucune offre trouvée pour « {searchQuery} ».
            </p>
          )
        )}

        {renderSection("recommended", "Recommander à nouveau", "Aucune offre recommandée.")}
        {renderSection("lastChance", "Dernière chance", "Aucune offre en dernière chance.")}
        {renderSection("vegan", "Ce soir je mange vegan", "Aucune offre vegan.")}
        {renderSection("local", "Tendances locales", "Aucune tendance locale.")}
        {renderSection("all", "Toutes les offres", "Aucune offre ne correspond aux filtres.")}
      </div>
    </section>
  )
}

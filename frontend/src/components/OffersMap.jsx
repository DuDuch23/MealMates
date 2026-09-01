import { useEffect, useState } from "react"
import { Link } from "react-router"
import { GoogleMap, Marker, LoadScript, InfoWindow, Circle } from "@react-google-maps/api"
import { geocodeLocation } from "../services/geocodingApi"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const EARTH_RADIUS_KM = 6371

function getDistanceInKm(lat1, lng1, lat2, lng2) {
  const toRadians = (value) => (value * Math.PI) / 180
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

/** Carte Google Maps affichant les offres autour de la position de l'utilisateur. */
export default function OffersMap({ offers = [], zoom = 13, userPos, setUserPos }) {
  const [map, setMap] = useState(null)
  const [address, setAddress] = useState("")
  const [initialCenter, setInitialCenter] = useState(null)
  const [radius, setRadius] = useState(5)
  const [selectedOffer, setSelectedOffer] = useState(null)

  useEffect(() => {
    if (userPos) {
      setInitialCenter(userPos)
    }
  }, [userPos])

  const handleSearch = async (event) => {
    event.preventDefault()
    try {
      const location = await geocodeLocation(address)
      if (location) {
        setUserPos(location)
        if (map) {
          map.panTo(location)
        }
      }
    } catch (error) {
      console.error("Adresse non trouvée :", error)
    }
  }

  if (!userPos) {
    return <p className="p-4 text-gray-300">Chargement de la carte...</p>
  }

  const visibleOffers = offers.filter((offer) => {
    if (!offer.latitude || !offer.longitude) {
      return false
    }
    return getDistanceInKm(userPos.lat, userPos.lng, offer.latitude, offer.longitude) <= radius
  })

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP}>
      <form
        onSubmit={handleSearch}
        className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center gap-2 rounded-lg bg-white/95 p-3 shadow-lg"
      >
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Entrez une adresse"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-black focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-black transition-colors hover:bg-primary-dark hover:text-white"
        >
          Rechercher
        </button>
        <label className="flex items-center gap-2 text-sm text-black">
          Rayon (km) :
          <input
            type="number"
            min="1"
            max="50"
            value={radius}
            onChange={(event) => setRadius(Number(event.target.value))}
            className="w-16 rounded-md border border-gray-300 px-2 py-1.5 focus:border-primary focus:outline-none"
          />
        </label>
      </form>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={initialCenter}
        zoom={zoom}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker position={userPos} title="Votre position" />
        <Circle
          center={userPos}
          radius={radius * 1000}
          options={{
            strokeColor: "#3B82F6",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#3B82F6",
            fillOpacity: 0.2,
          }}
        />

        {visibleOffers.map((offer) => (
          <Marker
            key={offer.id}
            position={{
              lat: Number(offer.latitude),
              lng: Number(offer.longitude),
            }}
            title={offer.product}
            label="📦"
            onClick={() => setSelectedOffer(offer)}
          />
        ))}

        {selectedOffer && (
          <InfoWindow
            position={{
              lat: Number(selectedOffer.latitude),
              lng: Number(selectedOffer.longitude),
            }}
            onCloseClick={() => setSelectedOffer(null)}
          >
            <div className="max-w-60 text-black">
              <h2 className="mb-2 border-b border-gray-300 pb-1 text-lg font-bold">
                {selectedOffer.product}
              </h2>
              <p className="mb-2 text-sm">{selectedOffer.description}</p>
              <Link to={`/offer/${selectedOffer.id}`} className="text-sm font-medium text-primary-dark underline">
                En savoir plus
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

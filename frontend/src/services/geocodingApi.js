/** Convertit une adresse postale en coordonnées via l'API Google Geocoding. */
export async function geocodeLocation(location) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAP

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
  )
  const data = await response.json()

  if (!data.results || data.results.length === 0) {
    return null
  }

  const { lat, lng } = data.results[0].geometry.location
  return {
    lat,
    lng,
  }
}

import { useEffect, useState } from "react"
import { API_BASE_URL } from "../services/apiClient"
import { getHomePageImages } from "../services/offerApi"

/** Bandeau d'images défilant en continu sur la page d'accueil. */
export default function AutoCarousel() {
  const [images, setImages] = useState([])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getHomePageImages()
        setImages(Array.isArray(response) ? response : [])
      } catch (error) {
        console.error("Impossible de charger les images du carrousel :", error)
      }
    }

    fetchImages()
  }, [])

  if (images.length === 0) {
    return null
  }

  return (
    <div className="w-full overflow-hidden py-3">
      <div className="flex w-max animate-[carousel-scroll_10s_linear_infinite]">
        {/* Liste doublée pour un défilement en boucle sans rupture */}
        {[...images, ...images].map((image, index) => (
          <img
            key={index}
            src={`${API_BASE_URL}${image.url}`}
            alt={`Produit ${(index % images.length) + 1}`}
            className="mr-3 h-32 w-48 rounded-lg object-cover shadow-md transition-transform hover:scale-105 md:h-60 md:w-80"
          />
        ))}
      </div>

      <style>{`
        @keyframes carousel-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

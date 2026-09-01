import { apiRequest, apiSubmitFormData } from "./apiClient"

export async function getOffers() {
  return apiRequest("/api/offers/", {
    auth: true,
  })
}

export async function getOffer(offerId) {
  return apiRequest(`/api/offers/get/${offerId}`)
}

export async function getVeganOffers() {
  return apiRequest("/api/offers/vegan?limit=10&offset=0", {
    auth: true,
  })
}

export async function getLocalOffers(latitude, longitude, radius = 5) {
  return apiRequest(`/api/offers/local?lat=${latitude}&lng=${longitude}&radius=${radius}`, {
    auth: true,
  })
}

export async function getLastChanceOffers() {
  return apiRequest("/api/offers/last-chance", {
    auth: true,
  })
}

/** Offres recommandées à partir des commandes passées de l'utilisateur. */
export async function getRecommendedOffers() {
  return apiRequest("/api/offers/again", {
    auth: true,
  })
}

export async function getOffersBySeller(sellerId) {
  return apiRequest("/api/offers/get/seller", {
    method: "POST",
    auth: true,
    body: {
      id: sellerId,
    },
  })
}

export async function searchOffersByTitle(title) {
  return apiRequest("/api/offers/search", {
    method: "POST",
    body: {
      keyword: title,
    },
  })
}

export async function createOffer(formData) {
  return apiSubmitFormData("/api/offers/new", formData)
}

export async function updateOffer(offerId, formData) {
  return apiSubmitFormData(`/api/offers/edit/${offerId}`, formData)
}

export async function createOrder(offerId) {
  return apiRequest("/api/order/create", {
    method: "POST",
    auth: true,
    body: {
      offerId,
    },
  })
}

export async function getCategories() {
  return apiRequest("/api/category/")
}

export async function getHomePageImages() {
  return apiRequest("/api/images")
}

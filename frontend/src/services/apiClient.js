// Retire le slash final : VITE_API_BASE_URL peut être documentée avec ("https://host/")
// et chaque appel passe déjà un chemin commençant par "/", ce qui créerait "host//api/...".
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")

function buildHeaders({ auth, hasJsonBody }) {
  const headers = {
    accept: "application/json",
  }

  if (hasJsonBody) {
    headers["Content-Type"] = "application/json"
  }

  if (auth) {
    // Le token est lu à chaque appel : il peut changer après une connexion
    // sans rechargement de la page.
    const token = sessionStorage.getItem("token")
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  return headers
}

/**
 * Requête JSON générique vers l'API MealMates.
 * `body` peut être un objet (sérialisé en JSON) ou un FormData (envoyé tel quel).
 */
export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const isFormData = body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: buildHeaders({
      auth,
      hasJsonBody: body !== undefined && !isFormData,
    }),
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Erreur API ${response.status} sur ${path}`)
  }

  return response.json()
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

/**
 * Variante pour les envois de formulaire dont l'appelant doit connaître
 * le statut HTTP (création / édition d'offre).
 */
export async function apiSubmitFormData(path, formData) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: buildHeaders({ auth: true, hasJsonBody: false }),
    body: formData,
  })

  const contentType = response.headers.get("content-type") || ""
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text()

  return {
    status: response.status,
    ok: response.ok,
    body: payload,
  }
}

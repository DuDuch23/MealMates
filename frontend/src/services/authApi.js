import { apiRequest } from "./apiClient"
import { deleteUserIndexDb } from "./indexDb"

const SESSION_DURATION_MS = 60 * 60 * 1000

export async function logIn({ email, password }) {
  return apiRequest("/api/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  })
}

export async function registerUser({ email, password, confirmPassword, firstName, lastName }) {
  return apiRequest("/api/user/new", {
    method: "POST",
    body: {
      email,
      password,
      password_confirm: confirmPassword,
      firstName,
      lastName,
    },
  })
}

/** Échange un credential Google contre un token API MealMates. */
export async function fetchSsoToken(googleCredential) {
  return apiRequest("/api/user/ssoUser", {
    method: "POST",
    body: {
      token: googleCredential,
    },
  })
}

/** Enregistre la session (token + profil) côté navigateur. */
export function storeSession({ token, user }) {
  const expiration = Date.now() + SESSION_DURATION_MS
  sessionStorage.setItem("token", token)
  sessionStorage.setItem("token_expiration", expiration.toString())
  sessionStorage.setItem("user", JSON.stringify(user))
}

export function getSessionUser() {
  const storedUser = sessionStorage.getItem("user")
  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    sessionStorage.removeItem("user")
    return null
  }
}

export function isSessionExpired() {
  const expiration = sessionStorage.getItem("token_expiration")
  return expiration !== null && Date.now() > Number(expiration)
}

export async function logOut() {
  sessionStorage.removeItem("token")
  sessionStorage.removeItem("token_expiration")
  sessionStorage.removeItem("user")
  await deleteUserIndexDb()
}

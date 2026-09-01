import { apiRequest } from "./apiClient"

export async function getUser(userId) {
  return apiRequest("/api/user/get", {
    method: "POST",
    auth: true,
    body: {
      id: userId,
    },
  })
}

export async function getProfile({ email }) {
  return apiRequest("/api/user/profile", {
    method: "POST",
    auth: true,
    body: {
      email,
    },
  })
}

export async function editUser(userData) {
  const body = {
    id: userData.userId,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    iconUser: userData.iconUser,
  }

  if (userData.password) {
    body.password = userData.password
    body.password_confirm = userData.confirmPassword
  }

  return apiRequest("/api/user/edit", {
    method: "PUT",
    auth: true,
    body,
  })
}

export async function fetchStats(userId) {
  return apiRequest(`/api/user/${userId}/dashboard`, {
    auth: true,
  })
}

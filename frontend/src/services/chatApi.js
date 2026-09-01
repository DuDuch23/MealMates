import { apiRequest } from "./apiClient"

export async function createChat({ clientId, sellerId, offerId }) {
  return apiRequest("/api/chat/create", {
    method: "POST",
    auth: true,
    body: {
      seller: sellerId,
      client: clientId,
      offer: offerId,
    },
  })
}

export async function getChatInfo(chatId) {
  return apiRequest(`/api/chat/get/${chatId}`, {
    method: "POST",
    auth: true,
    body: {
      id: chatId,
    },
  })
}

export async function getAllChats(userId) {
  return apiRequest("/api/chat/get/all", {
    method: "POST",
    auth: true,
    body: {
      id: userId,
    },
  })
}

export async function getChatMessages({ userId, chatId }) {
  return apiRequest("/api/chat/get", {
    method: "POST",
    auth: true,
    body: {
      id: userId,
      chat: chatId,
    },
  })
}

export async function sendMessage({ userId, chatId, message }) {
  return apiRequest("/api/chat/send/message", {
    method: "POST",
    auth: true,
    body: {
      user: userId,
      chat: chatId,
      content: message,
    },
  })
}

/** Envoi du contenu d'un QR code scanné — endpoint public, sans token. */
export async function sendQrMessage({ userId, chatId, message }) {
  return apiRequest("/api/chat/send/message/qr", {
    method: "POST",
    body: {
      user: userId,
      chat: chatId,
      content: message,
    },
  })
}

export async function generateStripeLink(chatId) {
  return apiRequest(`/api/chat/${chatId}/create-stripe`, {
    method: "POST",
    auth: true,
  })
}

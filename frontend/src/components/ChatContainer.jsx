import { useCallback, useEffect, useRef, useState } from "react"
import Message from "./Message"
import { getChatMessages } from "../services/chatApi"

const POLLING_INTERVAL_MS = 5000

/** Liste des messages d'une conversation, rafraîchie par polling. */
export default function ChatContainer({ user, chatId }) {
  const [messages, setMessages] = useState([])
  const containerRef = useRef(null)

  const fetchMessages = useCallback(async () => {
    try {
      const response = await getChatMessages({
        userId: user.id,
        chatId,
      })
      // L'API renvoie un objet dont la première valeur est la liste des messages
      const values = Object.values(response)
      return values[0] || []
    } catch (error) {
      console.error("Erreur lors de la récupération du chat :", error)
      return []
    }
  }, [user.id, chatId])

  useEffect(() => {
    if (!user?.id || !chatId) {
      return
    }

    let isActive = true

    const refreshMessages = async () => {
      const nextMessages = await fetchMessages()
      if (!isActive) {
        return
      }

      setMessages((currentMessages) => {
        const lastCurrentId = currentMessages.at(-1)?.message?.idForMessage
        const lastNextId = nextMessages.at(-1)?.message?.idForMessage
        if (currentMessages.length === nextMessages.length && lastCurrentId === lastNextId) {
          return currentMessages
        }
        return nextMessages
      })
    }

    refreshMessages()
    const intervalId = setInterval(refreshMessages, POLLING_INTERVAL_MS)

    return () => {
      isActive = false
      clearInterval(intervalId)
    }
  }, [user?.id, chatId, fetchMessages])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="mx-auto flex h-[75vh] w-full max-w-3xl flex-col gap-3 overflow-y-auto p-4"
    >
      {messages.length > 1 ? (
        // Le premier élément renvoyé par l'API est un en-tête, pas un message
        messages.slice(1).map((messageWrapper, index) => (
          <Message
            key={messageWrapper.message.idForMessage || index}
            content={messageWrapper.message.content}
            senderId={messageWrapper.user.id}
            iconUser={messageWrapper.user.icon}
          />
        ))
      ) : (
        <p className="text-gray-300">Chargement des messages...</p>
      )}
    </div>
  )
}

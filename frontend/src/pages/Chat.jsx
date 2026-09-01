import { useEffect, useState } from "react"
import ChatContainer from "../components/ChatContainer"
import AddMessage from "../components/AddMessage"
import { getChatInfo } from "../services/chatApi"
import { getSessionUser } from "../services/authApi"

/** Conversation active : le chat courant est passé via sessionStorage. */
export default function Chat() {
  const [offer, setOffer] = useState(null)
  const user = getSessionUser()
  const chatId = sessionStorage.getItem("chat")

  useEffect(() => {
    if (!chatId) {
      return
    }

    const fetchChatInfo = async () => {
      try {
        const response = await getChatInfo(chatId)
        setOffer(response)
      } catch (error) {
        console.error("Erreur lors de la récupération du chat :", error)
      }
    }

    fetchChatInfo()
  }, [chatId])

  if (!user || !chatId) {
    return <p className="p-8 text-gray-300">Chargement du chat...</p>
  }

  return (
    <>
      <ChatContainer user={user} chatId={Number(chatId)} />
      <AddMessage user={user} offer={offer} chatId={Number(chatId)} />
    </>
  )
}

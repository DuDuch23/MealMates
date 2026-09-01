import { useEffect, useState } from "react"
import ChatListItem from "../components/ChatListItem"
import { getAllChats } from "../services/chatApi"
import { getSessionUser } from "../services/authApi"

/** Liste des conversations de l'utilisateur connecté. */
export default function ChooseChat() {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getSessionUser()

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchChats = async () => {
      try {
        const response = await getAllChats(Number(user.id))
        setChats(response?.data || [])
      } catch (error) {
        console.error("Erreur lors de la récupération des conversations :", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
    // user?.id vient de sessionStorage : stable pendant la vie du composant
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto min-h-full w-full max-w-[1280px] px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Mes conversations</h1>

      {loading ? (
        <p className="text-gray-300">Chargement des conversations...</p>
      ) : chats.length === 0 ? (
        <p className="italic text-gray-400">Aucune conversation pour l'instant.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.chat_id}
              chatId={chat.chat_id}
              title={chat.offer}
              user={chat.user}
              lastMessage={chat.last_message}
            />
          ))}
        </div>
      )}
    </div>
  )
}

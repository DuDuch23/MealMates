import { useNavigate } from "react-router"
import UserAvatar from "./avatars/UserAvatar"

/** Aperçu d'une conversation dans la liste des chats. */
export default function ChatListItem({ user, chatId, lastMessage, title }) {
  const navigate = useNavigate()

  const handleClick = () => {
    sessionStorage.setItem("otherUser", user.id)
    sessionStorage.setItem("chat", chatId)
    navigate("/chat")
  }

  const content = lastMessage.content.trim()
  const isQrMessage = content.toLowerCase().startsWith("qr code")
  const isPaymentLink = /https?:\/\/\S+/.test(content)
  const messagePreview = content.length > 40 ? `${content.slice(0, 40)}...` : content

  let previewText = messagePreview
  if (isQrMessage) {
    previewText = "QR code disponible"
  } else if (isPaymentLink) {
    previewText = "Voici le lien vers le paiement"
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-surface-raised"
    >
      <UserAvatar iconId={user.icon} className="size-14" />
      <div className="min-w-0">
        <h3 className="truncate font-semibold text-primary">
          {title ? `${user.name} | ${title}` : user.name}
        </h3>
        <p className="truncate text-sm text-gray-300">{previewText}</p>
      </div>
    </button>
  )
}

import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router"
import { sendQrMessage } from "../services/chatApi"

/**
 * Page appelée après le scan d'un QR code de confirmation :
 * elle transmet le contenu du QR code au chat concerné.
 */
export default function QrCode() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const randomString = searchParams.get("randomString")
  const chatId = searchParams.get("chat")
  const userId = searchParams.get("user")

  useEffect(() => {
    const sendQrCode = async () => {
      try {
        await sendQrMessage({
          userId,
          chatId,
          message: [randomString, id],
        })
      } catch (error) {
        console.error("Erreur lors de l'envoi du QR code :", error)
      }
    }

    sendQrCode()
  }, [randomString, chatId, userId, id])

  return null
}

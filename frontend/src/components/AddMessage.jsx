import { useState } from "react"
import { sendMessage, generateStripeLink } from "../services/chatApi"

/** Barre d'envoi de message, avec envoi du lien de paiement pour le vendeur. */
export default function AddMessage({ user, offer, chatId }) {
  const [message, setMessage] = useState("")
  const [showStripeButton, setShowStripeButton] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendingStripeLink, setSendingStripeLink] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (message.trim() === "") {
      return
    }

    setSending(true)
    try {
      await sendMessage({
        userId: user.id,
        chatId,
        message,
      })
      setMessage("")
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error)
    } finally {
      setSending(false)
    }
  }

  const handleSendStripeLink = async () => {
    setSendingStripeLink(true)
    try {
      const response = await generateStripeLink(chatId)
      const stripeUrl = response?.url

      if (stripeUrl) {
        await sendMessage({
          userId: user.id,
          chatId,
          message: `Voici le lien de paiement : <a href="${stripeUrl}" target="_blank" rel="noopener noreferrer">Clique ici</a>`,
        })
      }

      setShowStripeButton(false)
    } catch (error) {
      console.error("Erreur en générant le lien Stripe :", error)
    } finally {
      setSendingStripeLink(false)
    }
  }

  const isSeller = offer?.data && user.id === offer.data.seller.id

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-6"
    >
      {isSeller && showStripeButton && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSendStripeLink}
            disabled={sendingStripeLink}
            className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-primary-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sendingStripeLink ? "Envoi en cours…" : "Envoyer le lien de paiement"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {isSeller && (
          <button
            type="button"
            onClick={() => setShowStripeButton((visible) => !visible)}
            className="cursor-pointer text-white transition-colors hover:text-primary"
            aria-label="Options de paiement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        )}

        <input
          type="text"
          name="message"
          placeholder="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={sending}
          className="w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white placeholder-gray-400 outline-none disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={sending || message.trim() === ""}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2 font-medium text-black transition-colors hover:bg-primary-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Envoi…" : "Envoyer"}
        </button>
      </div>
    </form>
  )
}

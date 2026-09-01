import QrCodeGenerate from "./QrCodeGenerate"
import UserAvatar from "./avatars/UserAvatar"
import { getSessionUser } from "../services/authApi"

/** Un message du chat : texte, lien de paiement Stripe ou QR code. */
export default function Message({ content, iconUser, senderId }) {
  const sessionUser = getSessionUser()
  const isSender = sessionUser?.id === senderId

  const isQrCode = content.startsWith("qr code :")
  const urlMatch = content.match(/https?:\/\/\S+/)
  const paymentUrl = urlMatch ? urlMatch[0].replace(/"$/, "") : null

  return (
    <div className={`flex items-center gap-2 ${isSender ? "flex-row-reverse" : ""}`}>
      <UserAvatar iconId={iconUser} className="size-10" />

      {paymentUrl ? (
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-white px-3 py-1.5 text-sm text-white transition-colors hover:border-primary hover:text-primary"
        >
          Voici le lien vers le paiement
        </a>
      ) : isQrCode ? (
        <QrCodeGenerate value={content} />
      ) : (
        <p
          className={`max-w-[70%] rounded-lg px-3 py-1.5 ${
            isSender ? "bg-primary text-black" : "bg-white text-primary-dark"
          }`}
        >
          {content}
        </p>
      )}
    </div>
  )
}

import { QRCodeCanvas } from "qrcode.react"
import { API_BASE_URL } from "../services/apiClient"

/** Génère le QR code de confirmation d'une commande à partir d'un message chat. */
export default function QrCodeGenerate({ value }) {
  const [randomString, orderCode] = value.replace("qr code : ", "").split(",")
  const chatId = sessionStorage.getItem("chat")

  const url = `${API_BASE_URL}/confirm/qrcode/${orderCode}?randomString=${randomString}&chat=${chatId}`

  return <QRCodeCanvas value={url} size={150} />
}

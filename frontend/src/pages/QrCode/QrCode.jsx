import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { sendMessageQr } from "../../service/requestApi";

export default function QrCode() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const randomString = searchParams.get("randomString");
    const chatId = searchParams.get("chat_id");
    const userId = searchParams.get("user_id");
    const orderId = searchParams.get("order_id");
    const quantity = searchParams.get("quantity");

    useEffect(() => {
        if (!randomString || !chatId || !userId || !orderId || !quantity) {
            navigate("/404");
            return;
        }

        const handleRequest = async () => {
            try {
                const qrCodeContent = [randomString, orderId];
                await sendMessageQr({ userId, chat: chatId, message: qrCodeContent });
                navigate("/");
            } catch (error) {
                console.error("Erreur lors de l'envoi du QR code :", error);
                navigate("/404");
            }
        };

        handleRequest();
    }, [randomString, chatId, userId, orderId, quantity, navigate]);

    return null;
}

import { useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router";
import { sendMessageQr } from "../../service/requestApi";

export default function QrCode() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { id } = useParams();

    const randomString = searchParams.get("randomString");
    const chatId = searchParams.get("chat");
    const userId = searchParams.get("user");
    const orderId = searchParams.get("order");
    const quantity = searchParams.get("quantity");

    useEffect(() => {
        const handleRequest = async () => {
            try {
                const qrCodeContent = [randomString, id];
                await sendMessageQr({ userId: userId, chat: chatId, message: qrCodeContent });
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

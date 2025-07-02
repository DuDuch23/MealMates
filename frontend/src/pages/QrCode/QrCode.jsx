import { useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { sendMessageQr } from "../../service/requestApi";

export default function QrCode() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const randomString = searchParams.get("randomString");
    const chatId = searchParams.get("chat");
    const userId = searchParams.get("user");
    const quantity = searchParams.get("quantity");

    useEffect(() => {
        if (!randomString || !chatId || !userId || !id || !quantity) {
            navigate("/404");
        }

        const handleRequest = async () => {
            try {
                const qrCodeContent = [randomString, id];
                await sendMessageQr({ userId, chat: chatId, message: qrCodeContent });
                navigate("/");
            } catch (error) {
                console.error("Erreur lors de l'envoi du QR code :", error);
                navigate("/404");
            }
        };

        handleRequest();
    }, [randomString, chatId, userId, id, quantity, navigate]);

    return null;
}

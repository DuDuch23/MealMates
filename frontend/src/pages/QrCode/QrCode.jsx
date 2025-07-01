import { useEffect, useState  } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { sendMessageQr } from "../../service/requestApi";

export default function QrCode() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const randomString = searchParams.get("randomString");
    const chatId = searchParams.get("chat");
    const userId = searchParams.get("user");

    useEffect(() => {
        if (!randomString || !chatId || !userId || !id ) {
            navigate("/404");
            return;
        }

        const handleRequest = async() => {
            const qrCodeContent = [randomString,id];
            const res = await sendMessageQr({userId:userId, chat:chatId, message: qrCodeContent});
        }

        handleRequest();
        navigate("/");

    }, [randomString,chatId,userId,id, navigate]);

}
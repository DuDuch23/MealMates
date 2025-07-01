import React from 'react';
import API_BASE_URL from "../../service/api";
import { QRCodeCanvas } from 'qrcode.react';

const QrCodeGenerate = ({ value }) => {
    const parts = value.replace("qr code : ", "").split(",");

    const code1 = parts[0];
    const code2 = parts[1];
    const chat = sessionStorage.getItem("chat");

    const url = `${API_BASE_URL}/confirm/qrcode/${code2}?randomString=${code1}&chat=${chat}`;

    return <QRCodeCanvas value={url} size={150} />;
};

export default QrCodeGenerate;

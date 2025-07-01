import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import  QrCodeGenerate  from "../QrCodeGenerate/QrCodeGenerate";
import styles from './message.module.css';

export function Messages({ content, iconUser, id }) {
  const [userStorage, setUserStorage] = useState(null);
  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUserStorage(user);
    setIsSender(user?.id === id);
  }, [id]);

  const isQr = content.startsWith("qr code :");

  const urlMatch = content.match(/https?:\/\/\S+/);
  let url = urlMatch ? urlMatch[0].replace(/"$/, '') : null;

  return (
    <div className={styles["container-message"]}>
      <IconUser iconId={iconUser} />

      {url ? (
        <a className={styles["link"]} href={url} target="_blank" rel="noopener noreferrer">
          Voici le lien vers le paiement
        </a>
      ) : isQr ? (
        <QrCodeGenerate value={content} />
      ) : (
        <div className={`${styles["content-message"]} ${!isSender ? styles.white : ''}`}>
          {content}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import styles from './message.module.css';

export function Messages({ content, iconUser, id }) {
  const [userStorage, setUserStorage] = useState(null);
  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUserStorage(user);
    setIsSender(user?.id === id);
  }, [id]);

  // on extrait l'url
  const urlMatch = content.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0] : null;

  return (
    <div className={styles["container-message"]}>
      <IconUser iconId={iconUser} />
      {url ? (
        <a className={styles["link"]} href={url} target="_blank" rel="noopener noreferrer">
          Voici le lien vers le paiement
        </a>
      ) : (
        <div className={`${styles["content-message"]} ${!isSender ? styles.white : ''}`}>
          {content}
        </div>
      )}
    </div>
  );
}

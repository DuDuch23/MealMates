import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import styles from './message.module.css';

export function Messages({ content, iconUser, id }) {
  const [userStorage, setUserStorage] = useState(null);
  const [isSender,setIsSender] = useState(null);
  
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    setUserStorage(user);
  }, []);

  console.log(id == userStorage.id);
  setIsSender(id == userStorage.id);
  console.log(isSender);

  return (
    <div className={styles["container-message"]}>
      <IconUser id={iconUser} />
      <div className={isSender ? styles["content-message"] : styles["content-message white"]}>
        {content}
      </div>
    </div>
  );
}

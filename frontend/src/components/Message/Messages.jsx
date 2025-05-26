import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import styles from './message.module.css';

export function Messages({ content, senderId }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const storedId = localStorage.getItem("user");

      try {
        let fetchedUser;
        if (senderId === storedId) {
          fetchedUser = await getUserIndexDB(storedId);
        } else {
          fetchedUser = await getUser({ user: senderId });
        }

        setUserData(fetchedUser);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    }

    if (senderId) {
      fetchUser();
    }
  }, [senderId]);

  return (
    <div className={styles["container-message"]}>
      <IconUser id={userData.data.iconUser} />
      <div>{content}</div>
    </div>
  );
}

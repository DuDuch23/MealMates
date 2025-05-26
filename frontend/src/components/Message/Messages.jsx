import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";
import styles from './message.module.css';

export function Messages({ content, iconUser }) {

  return (
    <div className={styles["container-message"]}>
      <IconUser id={iconUser} />
      <div>{content}</div>
    </div>
  );
}

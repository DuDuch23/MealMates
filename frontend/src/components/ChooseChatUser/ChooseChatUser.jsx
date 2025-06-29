import { useNavigate } from "react-router";
import style from "./ChooseChatUser.module.css";
import { IconUser } from "../IconUser/iconUser";

function ChooseChatUser({ user, chat, lastMessage }) {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("otherUser", user.id);
    sessionStorage.setItem("chat", chat);
    navigate("/chat");
  };

  const urlMatch = lastMessage.content.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0] : null;

  return (
    <div
      onClick={handleClick}
      className={style["container-user-chat"]}
      style={{ cursor: "pointer" }}
    >
      <div className={style["user-part"]}>
        <IconUser iconId={user.icon} />
        <ul className={style["list-info"]}>
          <li>
            <h3>{user.name}</h3>
          </li>
          {url ? (
            <p>Voici le lien vers le paiement</p>
          ) : (
            <div>{lastMessage.content}</div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ChooseChatUser;

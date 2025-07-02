import { useNavigate } from "react-router";
import style from "./ChooseChatUser.module.css";
import { IconUser } from "../IconUser/iconUser";

function ChooseChatUser({ user, chat, lastMessage,title }) {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem("otherUser", user.id);
    sessionStorage.setItem("chat", chat);
    navigate("/chat");
  };

  const content = lastMessage.content.trim();

  const isQrMessage = content.toLowerCase().startsWith("qr code");
  
  const urlMatch = content.match(/https?:\/\/\S+/);
  
  const url = urlMatch ? urlMatch[0] : null;

  const messagePreview =
    content.length > 40 ? content.slice(0, 40) + "..." : content;

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
            <h3 className={style["product-title"]}>{user.name} | {title}</h3>
          </li>
          <li>
            {isQrMessage ? (
              <span>QR disponible</span>
            ) : url ? (
              <span>Voici le lien vers le paiement</span>
            ) : (
              <span>{messagePreview}</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ChooseChatUser;

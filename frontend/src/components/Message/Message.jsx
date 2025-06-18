import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";

export function Messages({ content, senderId }) {

    const [userId,setUser] = useState([senderId]);
    const [idStorage, setIdStorage] = useState([]);

    useEffect(() => {
      async function fetchUser() {

        setIdStorage(JSON.parse(sessionStorage.getItem('user')));

        if(userId == senderId){
            const userData = await getUserIndexDB(idStorage.id);
            setUser(userData);
        }else{
          const userData = await getUser(idStorage.id);
          setUser(userData);
        }

      }
      fetchUser();
    }, [idStorage]);

    const iconUser = () =>{
        if(user.iconUser){
            <IconUser id={user.iconUser} />
        }else{
            <div><IconUser id={1} /></div>
        }
    }

    return (
        <div>
            {iconUser}
            <div>
                {content}
            </div>
        </div>
    );
}
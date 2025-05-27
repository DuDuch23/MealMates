import { useEffect, useState } from "react";
import { IconUser } from "../IconUser/iconUser";
import { getUser } from "../../service/requestApi";
import { getUserIndexDB } from "../../service/indexDB";

export function Messages({ content, senderId }) {

    const [user,setUser] = useState([senderId]);
    const [idStorage, setIdStorage] = useState([]);

    useEffect(() => {
      async function fetchUser() {
        setIdStorage(localStorage.getItem('user'));

        if(user == senderId){
            const userData = await getUserIndexDB(idStorage);
            setUser(userData);
        }else{
          const userData = await getUser(idStorage);
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
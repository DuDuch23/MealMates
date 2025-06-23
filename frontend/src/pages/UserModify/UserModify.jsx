import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, editUser } from "../../service/requestApi";
import { getUserIndexDB, updateUserIndexDB } from "../../service/indexDB";
import { IconUser, ChooseYourIcon } from "../../components/IconUser/iconUser";
import styles from './UserModify.module.css';

function UserModify() {
    const [user, setUser] = useState(null);
    const params = useParams();
    const userId = params.id ? parseInt(params.id) : null;

    const [idIcon, setIdIcon] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAdress] = useState("");
    const [option, setOption] = useState("");

    useEffect(() => {
      async function fetchUserData() {
          if (userId) {
              try {
                const localData = await getUserIndexDB(userId);
                setUser(localData);
              } catch (err) {
                  console.error("Erreur lors de la récupération des données :", err);
              }
          }
      }
      fetchUserData();
    },[userId]);

          

    const handleIconChange = (id) => {
      setIdIcon(id);
    };

    const handleEdit = async (event) => {
      event.preventDefault();
      const token = sessionStorage.getItem("token");

      const userData = {
        userId,
        idIcon,
        email,
        firstName,
        lastName,
        city,
        address,
        option,
      };

      console.log(userData);

      const res = await editUser({userData});

      if(res.code === 200){
        updateUserIndexDB({userId,userData});
      }
    };
 
    return (
        <>
        <div className={styles.cardUser}>
            <nav>
                <Link to={"/"}>
                    <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                    <h2>MealMates</h2>
                </Link>
            </nav>
      
            <div className={styles[`user-face`]}>
              <IconUser id={idIcon}/>
              <ChooseYourIcon onValueChange={handleIconChange}/>
            </div>
      
            <div className={styles[`content-user`]}>
              <div className="container-link">
                <Link to={`/userProfile/${userId}`}>Mes informations</Link>
                <span>
                  <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                  </svg>
                </span>
                <Link to={`/userMealCard/${userId}`}>MealCard</Link>
                <span>
                  <svg width="2" height="36" viewBox="0 0 2 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="1.26283" y1="2.70695e-08" x2="1.26283" y2="35.9182" stroke="#EFF1F5" strokeWidth="1.23856"/>
                  </svg>
                </span>
                <Link to={`/userModify/${userId}`}>Modifier mon compte</Link>
              </div>
      
              <div className={styles[`container-info-user`]} onSubmit={handleEdit}>
                <form action="#">
                  {/* nom et prénom */}
                  <div className={styles[`name-select`]}>
                    <input type="text" name="lastName" placeholder="Nom"  value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                    <input type="text" name="firstName" placeholder="Prénom" value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
                  </div>
      
                  {/* email */}
                  <div>
                    <input type="text" id={styles.email} name="email" placeholder="Mon email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                  </div>
      
                  {/* ville */}
                  <div>
                    <input type="text" id={styles.city} name="city" placeholder="Ma ville" value={city} onChange={(event) => setCity(event.target.value)}/>
                  </div>
      
                  {/* adresse rue */}
                  <div>
                    <input type="text" id={styles.address} name="address" placeholder="Mon adresse" value={address} onChange={(event) => setAdress(event.target.value)}/>
                  </div>

                  <div>
                    <label htmlFor="preferences">Mes preferences :</label>
                    <select name="preference" id={styles[`preference-select`]} value={option} onChange={(event) => setOption(event.target.value)}>
                      <option value="">--choisir un preference--</option>
                      {/* <option value=""><p>hey</p></option> */}
                    </select>
                  </div>

                  <button>Envoyer</button>
                </form>
              </div>
            </div>
          </div>
        </>
    );
      
}

export default UserModify;

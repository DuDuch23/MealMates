import { useState, useEffect } from "react";
import { useParams,Link } from 'react-router';
import { getUser,editUser } from "../../service/requestApi";
import { IconUser, ChooseYourIcon } from "../../components/IconUser/iconUser";
import Header from "../../components/Header/Header";
import './UserModify.css';

function UserModify() {
    // état pour stocker les infos de l'utilisateur
    const [user, setUser] = useState(null);

    // récupère l'id depuis l'URL
    const params = useParams();
    const userId = params.id;
    const [idIcon, setIdIcon] = useState(1);
    const [email, setEmail] = useState([]);
    const [password,setPassword] = useState([]);
    const [confirmPassword, setConfirmPassword] = useState([]);
    const [firstName,setFirstName] = useState([]);
    const [lastName, setLastName] = useState([]);

    // récupère le token dans le localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchUserData() {
            if (userId && token) {
                try {
                    const response = await getUser({ id: userId, token: token });
                    setUser(response);
                } catch (err) {
                    console.error("Erreur lors de la récupération des données :", err);
                }
            }
        }

        fetchUserData();
    }, [userId]);

    const handleIconChange = (id) => {
      setIdIcon(id);
    };

    // useEffect(async ()=>{
    //   await editUser({userId,idIcon,email,password, confirmPassword, firstName, lastName});
    // },[userId,idIcon,email,password, confirmPassword, firstName, lastName]);


    

    return (
        <>
          <div className="card-user">
            <nav>
              <img src="/img/logo-mealmates.png" alt="logo mealmates" />
              <h2>MealMates</h2>
            </nav>
      
            <div className="user-face">
              <IconUser id={idIcon} />
              <ChooseYourIcon onValueChange={handleIconChange}/>
            </div>
      
            <div className="content-user">
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
      
              <div className="container-info-user">
                <form action="#">
                  {/* nom et prénom */}
                  <div className="name-select">
                    <input type="text" name="lastName" placeholder="Nom" />
                    <input type="text" name="firstName" placeholder="Prénom" />
                  </div>
      
                  {/* email */}
                  <div>
                    <input type="text" id="email" name="email" placeholder="Mon email" />
                  </div>
      
                  {/* ville */}
                  <div>
                    <input type="text" id="city" name="city" placeholder="Ma ville" />
                  </div>
      
                  {/* adresse rue */}
                  <div>
                    <input type="text" id="address" name="address" placeholder="Mon adresse" />
                  </div>

                  <div>
                    <label htmlFor="preferences">Mes preferences :</label>
                    <select name="preference" id="preference-select">
                      <option value="">--choisir un preference--</option>
                      {/* <option value=""><p>hey</p></option> */}
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </>
    );
      
}

export default UserModify;

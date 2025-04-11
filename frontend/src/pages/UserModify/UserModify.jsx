import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { getUser, editUser } from "../../service/requestApi";
import { IconUser, ChooseYourIcon } from "../../components/IconUser/iconUser";
import Header from "../../components/Header/Header";
import './UserModify.css';

function UserModify() {
    const [user, setUser] = useState(null);
    const params = useParams();
    const userId = params.id;

    const [idIcon, setIdIcon] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [city, setCity] = useState("");
    const [address, setAdress] = useState("");
    const [option, setOption] = useState("");

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
    },[userId,token]);
          

    const handleIconChange = (id) => {
      setIdIcon(id);
    };

    const handleEdit = async(event)=>{
      event.preventDefault();
      const userData = {userId,idIcon,email,firstName,lastName,city,address,option,};
      try{
        await editUser(userData)
      }catch (error) {
        console.error("Erreur lors de la modification de l'utilisateur :", error);
        alert("Erreur lors de la modification !");
      }
    };


    

    return (
        <>
          <div className="card-user">
            <nav>
                <Link to={"/"}>
                    <img src="/img/logo-mealmates.png" alt="logo mealmates" />
                    <h2>MealMates</h2>
                </Link>
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
      
              <div className="container-info-user" onSubmit={handleEdit}>
                <form action="#">
                  {/* nom et prénom */}
                  <div className="name-select">
                    <input type="text" name="lastName" placeholder="Nom"  value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                    <input type="text" name="firstName" placeholder="Prénom" value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
                  </div>
      
                  {/* email */}
                  <div>
                    <input type="text" id="email" name="email" placeholder="Mon email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                  </div>
      
                  {/* ville */}
                  <div>
                    <input type="text" id="city" name="city" placeholder="Ma ville" value={city} onChange={(event) => setCity(event.target.value)}/>
                  </div>
      
                  {/* adresse rue */}
                  <div>
                    <input type="text" id="address" name="address" placeholder="Mon adresse" value={address} onChange={(event) => setAdress(event.target.value)}/>
                  </div>

                  <div>
                    <label htmlFor="preferences">Mes preferences :</label>
                    <select name="preference" id="preference-select"value={option} onChange={(event) => setOption(event.target.value)}>
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

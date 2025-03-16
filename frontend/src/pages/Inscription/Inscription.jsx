import { useState } from "react";
import { logIn } from "../../service/requestApi";
import backgroundImage from "../../image/background/background-form.webp";

// css
// import "./Inscription.css";

function Inscription(){
    const [formData,setData] = useState([]);
    const [email,setEmail] = useState([]);
    const [password,setPassword] = useState([]);

    const handleEmail = (element) => {
        const email = element.target.value;
        setEmail(email);
    };

    const handlePassword = (element) => {
        const password = element.target.value;
        setPassword(password);
    }
    
    const handleSubmit = (event) => {

      event.preventDefault();
      const data = [email,password];
      setData(data);

      logIn(formData);
    };

    return(
    <>
        <div className="container">
            <img src={backgroundImage} alt="" />
            <div className="content">
                <h1>MealMates</h1>
                <div className="action">
                    <form action="#" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" placeholder="Test@email.com" onChange={handleEmail}/>
                        </div>
                        <div>
                            <label htmlFor="password">Mot de Passe:</label>
                            <input type="password" name="password" placeholder="password" onChange={handlePassword}/>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="#">Se souvenir de moi</label>
                                <input type="checkbox" name=""/>
                            </div>
                            <a href="">
                                Mot de passe oublié ?
                            </a>
                        </div>
                        <button type="submit">Connexion</button>
                    </form>
                    <div className="otherAction">
                        <p> Ou connexion avec </p>
                        <ul>
                            <li>G</li>
                            <li>A</li>
                            <li>F</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Inscription;
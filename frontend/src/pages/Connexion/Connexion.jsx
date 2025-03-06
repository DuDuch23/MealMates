import { useState } from "react";
import { logIn } from "../../service/requestApi";
import backgroundImage from "../../image/background/background-form.webp";

// css
import "./Connexion.css";

function Connexion(){
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
        <h1>MealMates</h1>
        <div className="action">
            <form action="#" onSubmit={handleSubmit}>
                <div className="content-element-form">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" placeholder="Test@email.com" onChange={handleEmail}/>
                </div>
                <div className="content-element-form">
                    <label htmlFor="password">Mot de Passe:</label>
                    <input type="password" name="password" placeholder="password" onChange={handlePassword}/>
                </div>
                <div className="content-element-form">
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
                    <li>
                        <svg width="212" height="101" viewBox="0 0 212 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ddd_47_16)">
                            <rect x="11" width="190" height="78" rx="6" fill="#484848"/>
                            <g clipPath="url(#clip0_47_16)">
                            <path d="M96.1796 35.7406C96.8619 33.6763 98.1788 31.8801 99.9423 30.6085C101.706 29.3368 103.826 28.6545 106 28.659C108.465 28.659 110.693 29.534 112.443 30.966L117.535 25.875C114.432 23.1698 110.455 21.5 106 21.5C99.1021 21.5 93.1638 25.4346 90.3083 31.1979L96.1796 35.7406Z" fill="white"/>
                            <path d="M111.892 47.769C110.302 48.7942 108.284 49.341 106 49.341C103.835 49.3455 101.722 48.6686 99.9629 47.4063C98.2033 46.1441 96.8854 44.3603 96.1957 42.3075L90.304 46.7802C91.7496 49.706 93.9867 52.1679 96.7612 53.886C99.5358 55.6042 102.737 56.5098 106 56.5C110.277 56.5 114.364 54.979 117.425 52.125L111.893 47.769H111.892Z" fill="white"/>
                            <path d="M117.425 52.125C120.626 49.1383 122.704 44.6933 122.704 39C122.704 37.9645 122.545 36.8518 122.307 35.8179H106V42.5802H115.386C114.924 44.8537 113.68 46.6139 111.893 47.7689L117.425 52.125Z" fill="white"/>
                            <path d="M96.1956 42.3075C95.8389 41.2413 95.6576 40.1242 95.659 39C95.659 37.8595 95.8413 36.7643 96.1796 35.7406L90.3084 31.1979C89.1072 33.6226 88.4881 36.294 88.5 39C88.5 41.8 89.149 44.4395 90.304 46.7802L96.1956 42.3075Z" fill="white"/>
                            </g>
                            </g>
                            <defs>
                            <filter id="filter0_ddd_47_16" x="0.982789" y="0" width="210.034" height="100.539" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="2.76726"/>
                            <feGaussianBlur stdDeviation="1.1069"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0196802 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_47_16"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="6.6501"/>
                            <feGaussianBlur stdDeviation="2.66004"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0282725 0"/>
                            <feBlend mode="normal" in2="effect1_dropShadow_47_16" result="effect2_dropShadow_47_16"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="12.5216"/>
                            <feGaussianBlur stdDeviation="5.00862"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0"/>
                            <feBlend mode="normal" in2="effect2_dropShadow_47_16" result="effect3_dropShadow_47_16"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_47_16" result="shape"/>
                            </filter>
                            <clipPath id="clip0_47_16">
                            <rect width="35" height="35" fill="white" transform="translate(88.5 21.5)"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </li>
                    <li>
                        <svg width="211" height="101" viewBox="0 0 211 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ddd_47_22)">
                            <rect x="11" width="189" height="78" rx="6" fill="#484848"/>
                            <path d="M96.6766 55.8298C95.827 55.371 95.074 54.804 94.4465 54.1506C93.7563 53.4763 93.1168 52.7688 92.5316 52.0319C91.1581 50.3984 90.0809 48.6131 89.3332 46.7308C88.435 44.5444 88 42.4486 88 40.3988C88 38.1096 88.61 36.1111 89.8032 34.4319C90.6877 33.1194 91.9881 32.0226 93.5698 31.255C95.1028 30.482 96.8641 30.059 98.6683 30.0305C99.2999 30.0305 99.98 30.1049 100.702 30.247C101.22 30.3662 101.852 30.5542 102.624 30.7881C103.605 31.0953 104.145 31.2834 104.328 31.3293C104.903 31.4998 105.387 31.5742 105.767 31.5742C106.055 31.5742 106.462 31.4998 106.923 31.3861C107.183 31.3118 107.674 31.1806 108.375 30.9368C109.07 30.7313 109.617 30.5553 110.052 30.4241C110.718 30.2645 111.363 30.1169 111.938 30.0426C112.62 29.9553 113.312 29.9322 114 29.9737C115.193 30.037 116.368 30.2421 117.487 30.5826C119.317 31.1806 120.797 32.1142 121.898 33.4414C121.433 33.6744 120.996 33.9431 120.593 34.2439C119.718 34.8742 118.972 35.6142 118.384 36.4358C117.615 37.5586 117.217 38.8235 117.227 40.108C117.255 41.6855 117.753 43.075 118.735 44.2765C119.457 45.167 120.395 45.9284 121.492 46.5144C122.053 46.8216 122.537 47.0326 123 47.1747C122.783 47.7213 122.552 48.2504 122.278 48.7752C121.658 49.9519 120.907 51.0801 120.033 52.1456C119.255 53.0629 118.645 53.7461 118.182 54.2009C117.46 54.8951 116.765 55.4253 116.063 55.7949C115.292 56.2103 114.38 56.4322 113.453 56.4322C112.826 56.4518 112.199 56.3901 111.595 56.2496C111.077 56.1075 110.563 55.9534 110.058 55.7774C109.533 55.5816 108.992 55.4161 108.438 55.2821C107.07 54.9968 105.635 54.9949 104.265 55.2767C103.704 55.4079 103.164 55.5609 102.63 55.7489C101.88 56.0048 101.382 56.1764 101.094 56.2496C100.519 56.3863 99.9221 56.4716 99.3188 56.5C98.3855 56.5 97.5156 56.2835 96.6537 55.8451L96.6766 55.8298ZM108.985 28.9198C107.765 29.415 106.6 29.626 105.443 29.5572C105.262 28.6115 105.443 27.644 105.927 26.5846C106.338 25.6872 106.947 24.8575 107.722 24.1358C108.541 23.376 109.534 22.7533 110.647 22.3024C111.832 21.8072 112.962 21.5394 114.042 21.5C114.182 22.4905 114.042 23.4645 113.593 24.5173C113.178 25.448 112.571 26.3145 111.798 27.0799C111.009 27.8407 110.041 28.4659 108.95 28.9187L108.985 28.9198Z" fill="white"/>
                            </g>
                            <defs>
                            <filter id="filter0_ddd_47_22" x="0.982789" y="0" width="209.034" height="100.539" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="2.76726"/>
                            <feGaussianBlur stdDeviation="1.1069"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0196802 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_47_22"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="6.6501"/>
                            <feGaussianBlur stdDeviation="2.66004"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0282725 0"/>
                            <feBlend mode="normal" in2="effect1_dropShadow_47_22" result="effect2_dropShadow_47_22"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="12.5216"/>
                            <feGaussianBlur stdDeviation="5.00862"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0"/>
                            <feBlend mode="normal" in2="effect2_dropShadow_47_22" result="effect3_dropShadow_47_22"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_47_22" result="shape"/>
                            </filter>
                            </defs>
                        </svg>
                    </li>
                    <li>
                        <svg viewBox="0 0 212 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_ddd_47_24)">
                            <rect x="11" width="190" height="78" rx="6" fill="#484848"/>
                            <path d="M117.731 41.2489L119.131 34.734H110.377V30.5062C110.377 28.7242 111.599 26.9861 115.52 26.9861H119.5V21.4399C119.5 21.4399 115.889 21 112.436 21C105.226 21 100.514 24.1208 100.514 29.7694V34.7351H92.5V41.25H100.514V57H110.377V41.25L117.731 41.2489Z" fill="white"/>
                            </g>
                            <defs>
                            <filter id="filter0_ddd_47_24" x="0.982759" y="0" width="210.034" height="100.539" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="2.76726"/>
                            <feGaussianBlur stdDeviation="1.1069"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0196802 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_47_24"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="6.6501"/>
                            <feGaussianBlur stdDeviation="2.66004"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0282725 0"/>
                            <feBlend mode="normal" in2="effect1_dropShadow_47_24" result="effect2_dropShadow_47_24"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dy="12.5216"/>
                            <feGaussianBlur stdDeviation="5.00862"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.035 0"/>
                            <feBlend mode="normal" in2="effect2_dropShadow_47_24" result="effect3_dropShadow_47_24"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_47_24" result="shape"/>
                            </filter>
                            </defs>
                        </svg>
                    </li>
                </ul>
            </div>
        </div>
    </>
    )
}

export default Connexion;
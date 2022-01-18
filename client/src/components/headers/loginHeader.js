import React from "react";
import Logo from '../assets/headerLogo.png';
import './header.css';

function LoginHeader(){

    return(
        <div className = "loginHeader">
            <div className="header-logo">
                <img src={Logo} className="logo"></img>
                
            </div>

            <div className="divider400px"/>

            <div className="loginHeader-text">
                <h1>Hypothetical Transportation</h1>
            </div>
        </div>
            
    )
}
export default LoginHeader;
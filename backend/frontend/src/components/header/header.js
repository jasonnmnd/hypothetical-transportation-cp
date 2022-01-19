import React from "react";
//import Logo from '../assets/headerLogo.png';
//import './header.css';

function Header( {textToDisplay} ){

    return(
        <div className = "header">
            <div className="header-logo">
                //<img src={Logo} className="logo"></img>
                
            </div>

            {/* <div className="divider400px"/> */}

            <div className="header-text">
                <h1>{textToDisplay}</h1>
            </div>
        </div>
            
    )
}
export default Header;
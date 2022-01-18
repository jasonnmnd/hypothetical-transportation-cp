import React from "react";
import Logo from '../assets/headerLogo.png';

function ParentHeader(){

    return(
        <div className="header">
            <img src={Logo} className="logo"></img>
        </div>
    )
}
export default ParentHeader;
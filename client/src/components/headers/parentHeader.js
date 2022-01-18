import React from "react";
import Logo from '../assets/headerLogo.png';

function ParentHeader(){

    return(
        <div className="parentHeader">

            <div className="header-logo">
                <img src={Logo} className="logo"></img>
                
            </div>

            <div className="divider600px"/>

            <div className="parentHeader-text">
                <h1>Parent Portal</h1>
            </div>
        </div>
    )
}
export default ParentHeader;
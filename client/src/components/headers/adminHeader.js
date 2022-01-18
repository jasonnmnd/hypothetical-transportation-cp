import React from "react";
import Logo from '../assets/headerLogo.png';

function AdminHeader(){

    return(
        <div className="adminHeader">

            <div className="header-logo">
                <img src={Logo} className="logo"></img>
                
            </div>

            <div className="divider600px"/>

            <div className="adminHeader-text">
                <h1>Admin Portal</h1>
            </div>
        </div>
    )
}
export default AdminHeader;
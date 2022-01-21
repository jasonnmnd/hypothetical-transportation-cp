import React from "react";
import Header from "../../header/Header";
import { Link } from 'react-router-dom';


function AccountPage({user}){

    return(
        <div>
            <Header textToDisplay={"Parent Portal"}></Header>
            <div className="welcome">
                <h1>Account Details</h1>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <button>
                  <Link to={"/parent/password"}>
                      Change Password
                  </Link></button>
            </div>

        </div>
    );
}
export default AccountPage;
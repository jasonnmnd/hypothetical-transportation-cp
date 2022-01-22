import React from "react";
import Header from "../../header/Header";
import { Link } from 'react-router-dom';
import "../parentPage.css";


function AccountPage({user}){

    return(
        <div>
            <Header textToDisplay={"Parent Portal"}></Header>
            <div className="welcome">
                <h1>Account Details</h1>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Address: {user.address}</p>
                    <div className="button-spacing">
                        <Link to={"/parent/password"}>
                            <button>Change Password</button>
                        </Link>
                        <Link to={"/parent"}>
                            <button>Back</button>
                        </Link>
                    </div>
            </div>

        </div>
    );
}
export default AccountPage;
import React from "react";
import ParentTable from "./components/parentTable";
import Header from "../header/Header";
import "./parentPage.css";

function parentPage( {user, Logout} ) {
    return (
        <div className="page">
          <Header textToDisplay={"Parent Portal"}></Header>
          <div className="welcome">
            <h2>
              Welcome, <span>{user.name}</span>
            </h2>
          </div>
          <br></br>

          <div className="page-description">
            <h2>
                Your Students
            </h2>
          </div>
          
          <ParentTable />
          <button onClick={Logout}>Logout</button>
          <button>Account</button>
        </div>
    )
}

export default parentPage

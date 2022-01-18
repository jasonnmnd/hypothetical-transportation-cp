import React from "react";
import ParentHeader from "../headers/parentHeader";
import ParentTable from "./components/parentTable";
import "./parentPage.css";

function parentPage( {user, Logout} ) {
    return (
        <div className="page">
          <ParentHeader></ParentHeader>
          <div className="welcome">
            <h2>
              Welcome, <span>{user.name}</span>
            </h2>
          </div>
          <br></br>
          <h2>
            Your Students
          </h2>
          <ParentTable />
          <button onClick={Logout}>Logout</button>
          <button>Account</button>
        </div>
    )
}

export default parentPage

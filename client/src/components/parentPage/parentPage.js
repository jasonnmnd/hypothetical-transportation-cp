import React from "react";
import ParentHeader from "../headers/parentHeader";
import ParentTable from "./components/parentTable";

function parentPage( {user, Logout} ) {
    return (
        <div className="page">
          <ParentHeader></ParentHeader>
          <div className="welcome">
            <h2>
              Welcome, <span>{user.name}</span>
            </h2>
            <button onClick={Logout}>Logout</button>
          </div>
          <br></br>
          <h2>
            Your Students
          </h2>
          <ParentTable />
        </div>
    )
}

export default parentPage

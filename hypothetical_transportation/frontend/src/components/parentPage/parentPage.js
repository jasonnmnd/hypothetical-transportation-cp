import React from "react";
import ParentTable from "./components/ParentTable";
import Header from "../header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import "./parentPage.css";
import { Link } from 'react-router-dom';

function ParentPage( {user, Logout} ) {
    return (
      
        <div className="parent-page">
          <Header textToDisplay={"Parent Portal"}></Header>

          {user.email==="" ? (<Navigate to="/"></Navigate>):
          (
          <div>
            <div className="welcome">
              <h2>
                Welcome,<span>{user.name}</span>
              </h2>
              <div className="button-spacing">
                <button onClick={Logout}>Logout</button>
                <Link to={"/account"}>
                    <button>Account</button>
                </Link>
              </div>
            </div>
            <br></br>

            <div className="page-description">
              <h2>
                  Your Students
              </h2>
            </div>
            
            <ParentTable />
          </div>
          )}
        </div>

    )
}

export default ParentPage

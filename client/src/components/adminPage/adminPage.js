import React from "react";
import AdminHeader from "../headers/adminHeader";
import "./adminPage.css";

//This page will be used for the admin page to declutter App.js
function adminPage( {WelcomePage, UserList, StudentList, SchoolList, RouteList, user, Logout} ) {
    return (
        <div className="page">
            <AdminHeader></AdminHeader>
            <div className="sidebar">
            <ul>
              <li><button className="currentPage" onClick={WelcomePage}>Main</button></li>
              <br></br>
              <li><button onClick={UserList}>Users</button></li>
              <br></br>
              <li><button onClick={StudentList}>Students</button></li>
              <br></br>
              <li><button onClick={SchoolList}>Schools</button></li>
              <br></br>
              <li><button onClick={RouteList}>Routes</button></li>
            </ul>
          </div>
          <div className="main-content">
            <div className="welcome">
              <h2>
                Welcome, <span>{user.name}</span>
              </h2>
              <p>
                This should act as a short navigation overview, the "flavour text"
              </p>
              <p>
                Click the "Users" button in the Menu to see a list of all users on site
              </p>
              <p>
                Click the "Students" button in the Menu to see a list of all students on site
              </p>

              <p>
                Click the "Schools" button in the Menu to see a list of all schools on site
              </p>

              <p>
                Click the "Routes" button in the Menu to see a list of all bus routes on site
              </p>

              <p>
              (currently none works, expecting each button to redirect to another page and render different components)
              </p>
              <br></br>
              <button onClick={Logout}>Logout</button>
            </div>
          </div>
        </div>
    )
}

export default adminPage

import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import sidebardata from "./components/sidebar/sidebardata.json";
import Header from "../header/Header";
//import "./adminPage.css";


//This page will be used for the admin page to declutter App.js
function adminPage( {user, Logout} ) {
    return (
        <div className="page">
          <Header textToDisplay={"Admin Portal"}></Header>
          <Sidebar buttons={sidebardata}></Sidebar>
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

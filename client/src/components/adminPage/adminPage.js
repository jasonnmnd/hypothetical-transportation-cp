import React from "react";
import Header from "../header/Header";
import "./adminPage.css";

const WelcomePage = () => {
    //Somehow redirect back to welcome page (ie, slash nothing)
  };

const UserList = () => {
//Somehow redirect to user list page (ie, slash users)
};

const SchoolList = () => {
//Somehow redirect to school list page (ie, slash schools)
};
const RouteList = () => {
//Somehow redirect to route list page (ie, slash routes)
};
const StudentList = () => {
//Somehow redirect to student list page (ie, slash students)
};

const Account = () => {
//Somehow redirect to account page
};

//This page will be used for the admin page to declutter App.js
function adminPage( {user, Logout} ) {
    return (
        <div className="page">
            <Header textToDisplay={"Admin Portal"}></Header>
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

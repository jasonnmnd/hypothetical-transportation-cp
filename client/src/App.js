import { Route, Link } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Header from "./components/header/header";

function App() {
  //Login details, move to database for security
  // useEffect(() => {
  //   postData("http://localhost:3001/post-test", {
  //     email: details.email,
  //     password: details.password,
  //   });
  // });

  const adminUser = {
    name:"I'm an admin",
    email: "admin@admin.com",
    password: "admin123",
    admin:true,
    students:[],
  };

  const parentUser = {
    name: "Virginia",
    email: "parent@parent.com",
    password: "parent123",
    admin:false,
    students:[
      {
        name:"Al",
        id: "123",
        school: "A high school",
        route: "#1",
      },
      {
        name:"Hugo",
        id:"456",
        school: "B high school",
        route: "#2",
      },
      {
        name:"James",
        id:"567",
        school: "C high school",
        route: "none",
      },
    ],
  };

  const emptyUser = {
    name:"",
    email:"",
    password:"",
    admin:false,
    students:[],
  }

  // Example POST method implementation:
  async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  //const [user, setUser] = useState({name: "", email: ""});
  const [user, setUser] = useState(emptyUser);
  const [error, setError] = useState("");

  const parentLogin = (details) => {
    //console.log(details);

    //TODO: Change to implement backend with database
    if (
      details.email === parentUser.email &&
      details.password === parentUser.password
    ) {
      console.log("Logged in");
      setError("");
      setUser(
        //name: details.name,
        parentUser
      );
    } else {
      //console.log("Details do not match");
      setError("Details do not match!");
    }
  };

  const adminLogin = (details) => {
    //console.log(details);

    //TODO: Change to implement backend with database
    if (
      details.email === adminUser.email &&
      details.password === adminUser.password
    ) {
      console.log("Logged in");
      setError("");

      fetch("http://localhost:3001/log-in", {
        body: JSON.stringify({
          username: details.email,
          password: details.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      setUser(
        adminUser
      );
    } else {
      //console.log("Details do not match");
      setError("Details do not match!");
    }
  };

  //TODO: Currently just uses a ternary to determine which page to display, consider changing
  const Logout = () => {
    console.log("Logout");
    setUser(emptyUser);
  };

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

  // make admin and user pages have their own respective components to simplify this mess here?
  // the table currently show all student information, looks like it should just show the student name
  // and when clicked on name navigate to a new page to show student information
  return (
    <div className="App">
      {user.email === "" ? (
        <LoginForm
          parentLogin={parentLogin}
          adminLogin={adminLogin}
          error={error}
        ></LoginForm>
      ):
      user.admin===true?(
        <div className="page">
          <Header></Header>
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
      ):(
        <div className="page">
          <Header></Header>
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
          <table>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>School</th>
                <th>Route</th>
              </tr>
              {user.students.map((student) =>{
                return(
                <tr>
                  <td>{student.name}</td>
                  <td>{student.id}</td>
                  <td>{student.school}</td>
                  <td>{student.route}</td>
                </tr>
                )})}
          </table>
        </div>
      )
      }
    </div>
  );
}

export default App;

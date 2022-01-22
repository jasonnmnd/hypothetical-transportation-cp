import React from "react";
import { useState } from "react";
import "./App.css";
import ParentPage from "./components/parentPage/ParentPage";
import AdminPage from "./components/adminPage/AdminPage";
import { Routes, Route , Navigate} from "react-router-dom";
import LoginForm from "./components/loginPage/LoginForm.js"
import AdminUsersPage from "./components/adminPage/pages/AdminUsersPage";
import AdminStudentsPage from "./components/adminPage/pages/AdminStudentsPage";
import AdminRoutesPage from "./components/adminPage/pages/AdminRoutesPage";
import AdminSchoolsPage from "./components/adminPage/pages/AdminSchoolsPage";
import AccountPage from "./components/accountPage/AccountPage";
import ResetPasswordPage from "./components/accountPage/ResetPasswordPage";
import AdminEditPage from "./components/adminPage/pages/AdminEditPage";
import AdminUserDetails from "./components/adminPage/pages/AdminUserDetails";
import AdminStudentDetails from "./components/adminPage/pages/AdminStudentDetails";
import AdminSchoolDetails from "./components/adminPage/pages/AdminSchoolDetails";
import AdminRouteDetails from "./components/adminPage/pages/AdminRouteDetails";
import { Provider } from 'react-redux';
import store from './store';
import ParentStudentDetails from "./components/parentPage/pages/ParentStudentDetails";

function App() {
  //Login details, move to database for security

  // useEffect(() => {
  //   postData("http://localhost:3001/post-test", {
  //     email: details.email,
  //     password: details.password,
  //   });
  // });

  // Example POST method implementation:
  // async function postData(url = "", data = {}) {
  //   // Default options are marked with *
  //   const response = await fetch(url, {
  //     method: "POST", // *GET, POST, PUT, DELETE, etc.
  //     mode: "cors", // no-cors, *cors, same-origin
  //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //     credentials: "same-origin", // include, *same-origin, omit
  //     headers: {
  //       "Content-Type": "application/json",
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     redirect: "follow", // manual, *follow, error
  //     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  //     body: JSON.stringify(data), // body data type must match "Content-Type" header
  //   });
  //   return response.json(); // parses JSON response into native JavaScript objects
  // }

  //const [user, setUser] = useState({name: "", email: ""});

  //Handle main login accross the whole app
  const emptyUser = {
    name:"",
    email:"",
    password:"",
    admin:false,
    address: "",
    students:[],
  }

  const adminUser = {
    name:"Admin",
    email: "admin@admin.com",
    password: "admin123",
    admin:true,
    address: "",
    students:[],
  };
  
  const parentUser = {
    name: "Virginia",
    email: "parent@parent.com",
    password: "parent123",
    admin:false,
    address: "4015 E27th Ave",
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
  

  const [user, setUser] = useState(emptyUser);
  const [error, setError] = useState("");
  const [resetMessage, setMessage] = useState("");

  const parentLogin = (details) => {
    //console.log(details);

    //TODO: Change to implement backend with database
    if (
      details.email === parentUser.email &&
      details.password === parentUser.password
    ) {
      console.log("Logged in");
      //setError("");
      setUser(parentUser);
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
      //setError("");
      setUser(adminUser);
    } else {
      //console.log("Details do not match");
      setError("Details do not match!");
    }
  };

  const Logout = () => {
    setUser(emptyUser);
    return <Navigate to="/"></Navigate>
  };

  const reset = (inputs)=>{
    //somehow make backend do the things
    //change message according to backend output -> if old pw doesnt match, if new pw != confirm, if everything is right & succeed
  }

  return (
  //<Provider store={store}>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LoginForm adminLogin={adminLogin} parentLogin={parentLogin} user={user} error={error}/>}></Route>
          <Route path="/parent/*" element={<ParentPage user={user} Logout={Logout}/>}></Route>
          <Route exact path="/account" element={<AccountPage user={user}/>}></Route>
          <Route exact path="/account/password" element={<ResetPasswordPage save={reset} message={resetMessage}/>}></Route>
          <Route exact path="/parent/student/:school/:id" element={<ParentStudentDetails ></ParentStudentDetails>}/>
          <Route path="/admin/*" element={<AdminPage user={user} Logout={Logout}/>}></Route>
          <Route exact path="/admin/users" element={<AdminUsersPage />}></Route>
          <Route exact path="/admin/students" element={<AdminStudentsPage />}></Route>
          <Route exact path="/admin/schools" element={<AdminSchoolsPage />}></Route>
          <Route exact path="/admin/routes" element={<AdminRoutesPage />}></Route>
          <Route path="/admin/edit" element={<AdminEditPage />}></Route>
          <Route path="/admin/userdetails/*" element={<AdminUserDetails />}></Route>
          <Route path="/admin/studentdetails/*" element={<AdminStudentDetails />}></Route>
          <Route path="/admin/schooldetails/*" element={<AdminSchoolDetails />}></Route>
          <Route path="/admin/routedetails/*" element={<AdminRouteDetails />}></Route>
        </Routes>
      </div>
  //</Provider>
  );
}

export default App;

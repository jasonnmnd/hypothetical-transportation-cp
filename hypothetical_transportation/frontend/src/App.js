import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import ParentPage from "./components/parentPage/ParentPage";
import AdminPage from "./components/adminPage/AdminPage";
import { Routes, Route, Navigate, BrowserRouter} from "react-router-dom";
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
import ParentStudentDetails from "./components/parentPage/pages/ParentStudentDetails";
import AdminRoutePlanner from "./components/adminPage/pages/AdminRoutePlanner";
import PrivateRoute from "./components/common/PrivateRoute";
import { loadUser } from "./actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import AdminNewPage from "./components/adminPage/pages/AdminNewPage";
//import GeneralTable from "./components/common/generalTable";

function App( props ) {
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

  const [user, setUser] = useState(emptyUser);

  const [resetMessage, setMessage] = useState("");

  const propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
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
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<LoginForm />}></Route>
            <Route path="/parent/*" element={<PrivateRoute><ParentPage /></PrivateRoute>}></Route>
            <Route exact path="/account" element={<PrivateRoute><AccountPage user={user}/></PrivateRoute>}></Route>
            <Route exact path="/account/password" element={<PrivateRoute><ResetPasswordPage user={user} save={reset} message={resetMessage}/></PrivateRoute>}></Route>
            <Route exact path="/parent/student/:school/:id" element={<PrivateRoute><ParentStudentDetails ></ParentStudentDetails></PrivateRoute>}/>
            <Route path="/admin/*" element={<PrivateRoute><AdminPage user={user} Logout={Logout}/></PrivateRoute>}></Route>
            <Route exact path="/admin/users" element={<PrivateRoute><AdminUsersPage /></PrivateRoute>}></Route>
            <Route exact path="/admin/students" element={<PrivateRoute><AdminStudentsPage /></PrivateRoute>}></Route>
            <Route exact path="/admin/edit/:column/:id" element={<PrivateRoute><AdminEditPage /></PrivateRoute>}></Route>
            <Route exact path="/admin/schools" element={<PrivateRoute><AdminSchoolsPage /></PrivateRoute>}></Route>
            <Route exact path="/admin/routes" element={<PrivateRoute><AdminRoutesPage /></PrivateRoute>}></Route>
            <Route exact path="/admin/user/:id" element={<PrivateRoute><AdminUserDetails /></PrivateRoute>}/>
            <Route exact path="/admin/student/:id" element={<PrivateRoute><AdminStudentDetails /></PrivateRoute>}/>
            <Route exact path="/admin/school/:id" element={<PrivateRoute><AdminSchoolDetails /></PrivateRoute>}/>
            <Route exact path="/admin/route/:id" element={<PrivateRoute><AdminRouteDetails /></PrivateRoute>}/>
            <Route exact path="/admin/route/plan/:id" element={<PrivateRoute><AdminRoutePlanner /></PrivateRoute>}/>
            <Route exact path="admin/new/:column" element={<PrivateRoute><AdminNewPage /></PrivateRoute>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(App);
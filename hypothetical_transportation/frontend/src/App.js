import React from "react";
import "./App.css";
import ParentPage from "./components/parentPage/ParentPage";
import AdminPage from "./components/adminPage/AdminPage";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import LoginForm from "./components/loginPage/LoginForm.js"
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
import Alerts from "./components/alerts/Alerts";
import GeneralTable from "./components/common/GeneralTable";
import GeneralAdminUsersPage from "./components/adminPage/newPages/GeneralAdminUsersPage";
import GeneralAdminStudentsPage from "./components/adminPage/newPages/GeneralAdminStudentsPage";
import GeneralAdminSchoolsPage from "./components/adminPage/newPages/GeneralAdminSchoolsPage";
import GeneralAdminRoutesPage from "./components/adminPage/newPages/GeneralAdminRoutesPage";

import AdminNewPage from "./components/adminPage/pages/AdminNewPage";
import ManStudentPage from "./components/adminPage/pages/ManStudentPage";
//import GeneralTable from "./components/common/generalTable";

const testingTableProps = [
  {
    username: "fred",
    email: "aCat@animal.com",
    school: "hunting school",
    routeDesc: "this is the route of fred"
  },
  {
    username: "allie",
    email: "alsoaCat@animal.com",
    school: "tracking school",
    routeDesc: "this is the route of allie"
  },
  {
    username: "max",
    email: "adog@animal.com",
    school: "fetching school",
    routeDesc: "max stole this route"
  }
]


function App( props ) {
  //Handle main login accross the whole app

  return (
    <div className="App">
      <BrowserRouter>
        <Alerts/>
        <Routes>
          <Route exact path="/testingTable" element={<GeneralTable rows={testingTableProps}/>}></Route>
          <Route exact path="/" element={<LoginForm />}></Route>
          <Route path="/parent/*" element={<PrivateRoute><ParentPage /></PrivateRoute>}></Route>
          <Route exact path="/account" element={<PrivateRoute><AccountPage/></PrivateRoute>}></Route>
          <Route exact path="/account/password" element={<PrivateRoute><ResetPasswordPage/></PrivateRoute>}></Route>
          <Route exact path="/parent/student/:school/:id" element={<PrivateRoute><ParentStudentDetails ></ParentStudentDetails></PrivateRoute>}/>
          <Route path="/admin/*" element={<PrivateRoute><AdminPage/></PrivateRoute>}></Route>
          <Route exact path="/admin/users" element={<PrivateRoute><GeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/students" element={<PrivateRoute><GeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/edit/:column/:id" element={<PrivateRoute><AdminEditPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/schools" element={<PrivateRoute><GeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/routes" element={<PrivateRoute><GeneralAdminRoutesPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/user/:id" element={<PrivateRoute><AdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/admin/student/:id" element={<PrivateRoute><AdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/admin/school/:id" element={<PrivateRoute><AdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/:id" element={<PrivateRoute><AdminRouteDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/plan/:school_id" element={<PrivateRoute><AdminRoutePlanner action={"new"}/></PrivateRoute>}/>
          <Route exact path="/admin/route/edit/:school_id/:route_id" element={<PrivateRoute><AdminRoutePlanner action={"edit"}/></PrivateRoute>}/>
          <Route exact path="/admin/new_student/" element={<PrivateRoute><ManStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/admin/edit_student/:id" element={<PrivateRoute><ManStudentPage action={"edit"}/></PrivateRoute>}/>
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
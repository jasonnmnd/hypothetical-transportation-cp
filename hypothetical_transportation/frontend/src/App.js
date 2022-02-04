import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import ParentPage from "./components/parentPage/ParentPage";
import AdminPage from "./components/adminPage/AdminPage";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import LoginForm from "./components/loginPage/LoginForm.js"
import AccountPage from "./components/accountPage/AccountPage";
import GeneralParentStudentDetails from "./components/parentPage/pages/GeneralParentStudentDetails";
import PrivateRoute from "./components/common/PrivateRoute";
import { connect } from "react-redux";
import Alerts from "./components/alerts/Alerts";
import GeneralAdminUsersPage from "./components/adminPage/newPages/GeneralAdminUsersPage";
import GeneralAdminStudentsPage from "./components/adminPage/newPages/GeneralAdminStudentsPage";
import GeneralAdminSchoolsPage from "./components/adminPage/newPages/GeneralAdminSchoolsPage";
import GeneralAdminRoutesPage from "./components/adminPage/newPages/GeneralAdminRoutesPage";
import GeneralAdminUserDetails from "./components/adminPage/newPages/GeneralAdminUserDetails";
import GeneralAdminStudentDetails from "./components/adminPage/newPages/GeneralAdminStudentDetails";
import GeneralAdminSchoolDetails from "./components/adminPage/newPages/GeneralAdminSchoolDetails";
import GeneralAdminRouteDetails from "./components/adminPage/newPages/GeneralAdminRouteDetails";
import GeneralManageStudentPage from "./components/adminPage/newPages/GeneralManageStudentPage";
import GeneralResetPasswordPage from "./components/accountPage/GeneralResetPasswordPage";
import GeneralEditSchoolForm from "./components/adminPage/newPages/GeneralEditSchoolForm";
import GeneralEditUserForm from "./components/adminPage/newPages/GeneralEditUserForm";
import GeneralAdminRoutePlanner from "./components/adminPage/newPages/GeneralAdminRoutePlanner";

import NEWGeneralEditUserForm from "./components/adminPage/pages/NEWGeneralEditUserForm";
import NEWGeneralEditSchoolForm from "./components/adminPage/pages/NEWGeneralEditSchoolForm";

import NEWGeneralAdminRoutesPage from "./components/adminPage/pages/NEWGeneralAdminRoutesPage";
import NEWGeneralAdminSchoolsPage from "./components/adminPage/pages/NEWGeneralAdminSchoolsPage";
import NEWGeneralAdminStudentsPage from "./components/adminPage/pages/NEWGeneralAdminStudentsPage";
import NEWGeneralAdminUsersPage from "./components/adminPage/pages/NEWGeneralAdminUsersPage";


function App( props ) {
  //Handle main login accross the whole app

  return (
    <div className="App">
      <BrowserRouter>
        <Alerts/>
        <Routes>
          <Route exact path="/" element={<LoginForm />}></Route>
          <Route path="/parent/*" element={<PrivateRoute><ParentPage /></PrivateRoute>}></Route>
          <Route exact path="/account" element={<PrivateRoute><AccountPage/></PrivateRoute>}></Route>
          <Route exact path="/account/password" element={<PrivateRoute><GeneralResetPasswordPage/></PrivateRoute>}></Route>
          <Route exact path="/parent/student/:school/:id" element={<PrivateRoute><GeneralParentStudentDetails ></GeneralParentStudentDetails></PrivateRoute>}/>
          <Route path="/admin/*" element={<PrivateRoute><AdminPage/></PrivateRoute>}></Route>

          
          <Route exact path="/admin/users" element={<PrivateRoute><NEWGeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/students/*" element={<PrivateRoute><NEWGeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/schools" element={<PrivateRoute><NEWGeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/routes" element={<PrivateRoute><NEWGeneralAdminRoutesPage /></PrivateRoute>}></Route>

          <Route exact path="/admin/edit/school/:id" element={<PrivateRoute><NEWGeneralEditSchoolForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/school/" element={<PrivateRoute><NEWGeneralEditSchoolForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/admin/edit/user/:id" element={<PrivateRoute><NEWGeneralEditUserForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/user/" element={<PrivateRoute><NEWGeneralEditUserForm action="new"/></PrivateRoute>}></Route>

          <Route exact path="/admin/user/:id" element={<PrivateRoute><GeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/admin/student/:id" element={<PrivateRoute><GeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/admin/school/:id" element={<PrivateRoute><GeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/:id" element={<PrivateRoute><GeneralAdminRouteDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/plan/:school_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"new"}/></PrivateRoute>}/>
          <Route exact path="/admin/route/edit/:school_id/:route_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"edit"}/></PrivateRoute>}/>
          <Route exact path="/admin/new_student/" element={<PrivateRoute><GeneralManageStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/admin/edit_student/:id" element={<PrivateRoute><GeneralManageStudentPage action={"edit"}/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(App);
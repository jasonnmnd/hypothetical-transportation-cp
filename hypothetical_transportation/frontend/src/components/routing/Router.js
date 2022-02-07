import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountPage from '../accountPage/AccountPage';
import LoginForm from '../loginPage/LoginForm';
import ParentPage from '../parentPage/ParentPage';
import NEWGeneralEditUserForm from "../adminPage/pages/NEWGeneralEditUserForm";
import NEWGeneralEditSchoolForm from "../adminPage/pages/NEWGeneralEditSchoolForm";

import NEWGeneralAdminRoutesPage from "../adminPage/pages/NEWGeneralAdminRoutesPage";
import NEWGeneralAdminSchoolsPage from "../adminPage/pages/NEWGeneralAdminSchoolsPage";
import NEWGeneralAdminStudentsPage from "../adminPage/pages/NEWGeneralAdminStudentsPage";
import NEWGeneralAdminUsersPage from "../adminPage/pages/NEWGeneralAdminUsersPage";

import NEWGeneralAdminUserDetails from "../adminPage/pages/NEWGeneralAdminUserDetails";
import NEWGeneralAdminStudentDetails from "../adminPage/pages/NEWGeneralAdminStudentDetails";
import NEWGeneralAdminSchoolDetails from "../adminPage/pages/NEWGeneralAdminSchoolDetails";
import NEWGeneralAdminRouteDetails from "../adminPage/pages/NEWGeneralAdminRouteDetails";
import GeneralAdminRoutePlanner from "../adminPage/newPages/GeneralAdminRoutePlanner";
import GeneralManageStudentPage from "../adminPage/newPages/GeneralManageStudentPage";
import GeneralResetPasswordPage from "../accountPage/GeneralResetPasswordPage";
import AdminPage from "../adminPage/AdminPage";
import GeneralParentStudentDetails from "../parentPage/pages/GeneralParentStudentDetails";
import PrivateRoute from './PrivateRoute';
import Alerts from "../alerts/Alerts";


const Router = () => {
    return (
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
          <Route exact path="/admin/new_student/" element={<PrivateRoute><GeneralManageStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/admin/edit_student/:id" element={<PrivateRoute><GeneralManageStudentPage action={"edit"}/></PrivateRoute>}/>

          <Route exact path="/admin/user/:id" element={<PrivateRoute><NEWGeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/admin/student/:id" element={<PrivateRoute><NEWGeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/admin/school/:id" element={<PrivateRoute><NEWGeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/:id" element={<PrivateRoute><NEWGeneralAdminRouteDetails /></PrivateRoute>}/>
          
          <Route exact path="/admin/route/plan/:school_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"new"}/></PrivateRoute>}/>
          <Route exact path="/admin/route/edit/:school_id/:route_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"edit"}/></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    )
}

export default Router
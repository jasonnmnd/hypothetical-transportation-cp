import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountPage from '../accountPage/AccountPage';
import LoginForm from '../loginPage/LoginForm';
import ParentPage from '../parentPage/ParentPage';

import GeneralEditUserForm from "../adminPage/pages/GeneralEditUserForm";
import GeneralEditSchoolForm from "../adminPage/pages/GeneralEditSchoolForm";
import GeneralEditRouteForm from '../adminPage/pages/GeneralEditRouteForm';

import GeneralAdminRoutesPage from "../adminPage/pages/GeneralAdminRoutesPage";
import GeneralAdminSchoolsPage from "../adminPage/pages/GeneralAdminSchoolsPage";
import GeneralAdminStudentsPage from "../adminPage/pages/GeneralAdminStudentsPage";
import GeneralAdminUsersPage from "../adminPage/pages/GeneralAdminUsersPage";

import GeneralAdminUserDetails from "../adminPage/pages/GeneralAdminUserDetails";
import GeneralAdminStudentDetails from "../adminPage/pages/GeneralAdminStudentDetails";
import GeneralAdminSchoolDetails from "../adminPage/pages/GeneralAdminSchoolDetails";
import GeneralAdminRouteDetails from "../adminPage/pages/GeneralAdminRouteDetails";

import GeneralAdminRoutePlanner from "../adminPage/pages/GeneralAdminRoutePlanner";
import GeneralManageStudentPage from "../adminPage/pages/GeneralManageStudentPage";

import GeneralAdminEmailPage from '../adminPage/pages/GeneralAdminEmailPage';

import GeneralResetPasswordPage from "../accountPage/GeneralResetPasswordPage";
import AdminPage from "../adminPage/AdminPage";
import GeneralParentStudentDetails from "../parentPage/pages/GeneralParentStudentDetails";
import PrivateRoute from './PrivateRoute';
import Alerts from "../alerts/Alerts";
import ForgotPasswordForm from '../loginPage/ForgotPasswordForm';
import MapComponent from '../maps/MapComponent';
import ExampleMapUsage from '../maps/ExampleMapUsage';
import LinkBasePasswordResetForm from '../loginPage/LinkBasePasswordResetForm';


const Router = (props) => {
    return (
        <BrowserRouter>
        <Alerts/>
        <Routes>
          <Route exact path="/" element={<LoginForm />}></Route>
          <Route exact path="/forgot_password" element={<ForgotPasswordForm />}></Route>
          <Route exact path="/testingMap" element={<ExampleMapUsage />}></Route>
          <Route path="/parent/*" element={<PrivateRoute><ParentPage /></PrivateRoute>}></Route>
          <Route exact path="/account" element={<PrivateRoute><AccountPage/></PrivateRoute>}></Route>
          <Route exact path="/account/password" element={<PrivateRoute><GeneralResetPasswordPage/></PrivateRoute>}></Route>
          <Route exact path="/parent/student/:school/:id" element={<PrivateRoute><GeneralParentStudentDetails ></GeneralParentStudentDetails></PrivateRoute>}/>
          <Route path="/admin/*" element={<PrivateRoute><AdminPage/></PrivateRoute>}></Route>

          
          <Route exact path="/admin/users" element={<PrivateRoute><GeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/students/*" element={<PrivateRoute><GeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/schools" element={<PrivateRoute><GeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/routes" element={<PrivateRoute><GeneralAdminRoutesPage /></PrivateRoute>}></Route>

          <Route exact path="/admin/edit/school/:id" element={<PrivateRoute><GeneralEditSchoolForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/school/" element={<PrivateRoute><GeneralEditSchoolForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/admin/edit/user/:id" element={<PrivateRoute><GeneralEditUserForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/user/" element={<PrivateRoute><GeneralEditUserForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/admin/new_student/" element={<PrivateRoute><GeneralManageStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/admin/edit_student/:id" element={<PrivateRoute><GeneralManageStudentPage action={"edit"}/></PrivateRoute>}/>
          
          {/* Fix Edit, New Route*/}
          <Route exact path="/admin/new/route/" element={<PrivateRoute><GeneralEditRouteForm></GeneralEditRouteForm></PrivateRoute>}/>


          <Route exact path="/admin/user/:id" element={<PrivateRoute><GeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/admin/student/:id" element={<PrivateRoute><GeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/admin/school/:id" element={<PrivateRoute><GeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/:id" element={<PrivateRoute><GeneralAdminRouteDetails /></PrivateRoute>}/>
          
          <Route exact path="/admin/route/plan/:school_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"new"}/></PrivateRoute>}/>
          <Route exact path="/admin/route/edit/:school_id/:route_id" element={<PrivateRoute><GeneralAdminRoutePlanner action={"edit"}/></PrivateRoute>}/>

          <Route exact path="/admin/email" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/test/reset" element={<PrivateRoute><LinkBasePasswordResetForm/></PrivateRoute>}/>

          <Route exact path="/*" element={<LoginForm />}></Route>
        </Routes>
      </BrowserRouter>
    )
}

export default Router
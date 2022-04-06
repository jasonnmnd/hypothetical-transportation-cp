import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountPage from '../accountPage/AccountPage';
import LoginForm from '../loginPage/LoginForm';
import ParentPage from '../parentPage/ParentPage';

import GeneralEditUserForm from "../adminPage/pages/GeneralEditUserForm";
import GeneralEditSchoolForm from "../adminPage/pages/GeneralEditSchoolForm";

import GeneralAdminRoutesPage from "../adminPage/pages/GeneralRoutesPage";
import GeneralAdminSchoolsPage from "../adminPage/pages/GeneralSchoolsPage";
import GeneralAdminStudentsPage from "../adminPage/pages/GeneralStudentsPage";
import GeneralAdminUsersPage from "../adminPage/pages/GeneralUsersPage";

import GeneralAdminUserDetails from "../adminPage/pages/GeneralUserDetails";
import GeneralAdminStudentDetails from "../adminPage/pages/GeneralStudentDetails";
import GeneralAdminSchoolDetails from "../adminPage/pages/GeneralSchoolDetails";
import GeneralAdminRouteDetails from "../adminPage/pages/GeneralRouteDetails";
import GeneralAdminStopDetails from '../adminPage/pages/GeneralStopDetails';

import GeneralManageStudentPage from "../adminPage/pages/GeneralManageStudentPage";
import GeneralNewRoutePage from '../adminPage/pages/GeneralNewRoutePage';
import GeneralAdminEmailPage from '../adminPage/pages/GeneralEmailPage';

import GeneralResetPasswordPage from "../accountPage/GeneralResetPasswordPage";
import AdminPage from "../adminPage/AdminPage";
import GeneralParentStudentDetails from "../parentPage/pages/GeneralParentStudentDetails";
import PrivateRoute from './PrivateRoute';
import Alerts from "../alerts/Alerts";
import ForgotPasswordForm from '../loginPage/ForgotPasswordForm';
import ExampleMapUsage from '../maps/ExampleMapUsage';
import LinkBasePasswordResetForm from '../loginPage/LinkBasePasswordResetForm';
import GeneralUserConfirmationPage from '../adminPage/pages/GeneralUserConfirmationPage';
import SchoolRoutesPlannerPage from '../adminPage/pages/GeneralSchoolRoutesPlannerPage';

import GeneralPrintableRoster from '../adminPage/pages/GeneralPrintableRosterPage';
import GeneralUploadDataPage from '../adminPage/pages/GeneralUploadDataPage';
import GeneralUploadFilePage from '../adminPage/pages/GeneralUploadFilePage';
import GeneralBulkImportSuccessPage from '../adminPage/pages/GeneralBulkImportSuccessPage';

import StudentPage from '../studentPage/StudentPage';
import GeneralDriveStartPage from '../adminPage/pages/GeneralDriveStartPage';
import GeneralBusMapPage from '../adminPage/pages/GeneralBusMapPage';
import GeneralBusLogPage from '../adminPage/pages/GeneralBusLogPage';

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
          <Route path="/driver/*" element={<PrivateRoute><AdminPage/></PrivateRoute>}></Route>
          <Route path="/staff/*" element={<PrivateRoute><AdminPage/></PrivateRoute>}></Route>

          
          <Route exact path="/admin/users" element={<PrivateRoute><GeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/students/*" element={<PrivateRoute><GeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/schools" element={<PrivateRoute><GeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/admin/routes" element={<PrivateRoute><GeneralAdminRoutesPage /></PrivateRoute>}></Route>
          <Route exact path="/driver/users" element={<PrivateRoute><GeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/driver/students/*" element={<PrivateRoute><GeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/driver/schools" element={<PrivateRoute><GeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/driver/routes" element={<PrivateRoute><GeneralAdminRoutesPage /></PrivateRoute>}></Route>
          <Route exact path="/staff/users" element={<PrivateRoute><GeneralAdminUsersPage /></PrivateRoute>}></Route>
          <Route exact path="/staff/students/*" element={<PrivateRoute><GeneralAdminStudentsPage /></PrivateRoute>}></Route>
          <Route exact path="/staff/schools" element={<PrivateRoute><GeneralAdminSchoolsPage /></PrivateRoute>}></Route>
          <Route exact path="/staff/routes" element={<PrivateRoute><GeneralAdminRoutesPage /></PrivateRoute>}></Route>

          <Route exact path="/admin/edit/school/:id" element={<PrivateRoute><GeneralEditSchoolForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/school/" element={<PrivateRoute><GeneralEditSchoolForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/admin/edit/user/:id" element={<PrivateRoute><GeneralEditUserForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/admin/new/user/" element={<PrivateRoute><GeneralEditUserForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/admin/new_student/" element={<PrivateRoute><GeneralManageStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/admin/edit_student/:id" element={<PrivateRoute><GeneralManageStudentPage action={"edit"}/></PrivateRoute>}/>
          <Route exact path="/admin/new/route/" element={<PrivateRoute><GeneralNewRoutePage></GeneralNewRoutePage></PrivateRoute>}></Route>

          <Route exact path="/staff/edit/school/:id" element={<PrivateRoute><GeneralEditSchoolForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/staff/new/school/" element={<PrivateRoute><GeneralEditSchoolForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/staff/edit/user/:id" element={<PrivateRoute><GeneralEditUserForm action="edit" /></PrivateRoute>}></Route>
          <Route exact path="/staff/new/user/" element={<PrivateRoute><GeneralEditUserForm action="new"/></PrivateRoute>}></Route>
          <Route exact path="/staff/new_student/" element={<PrivateRoute><GeneralManageStudentPage action={"new"} /></PrivateRoute>}/>
          <Route exact path="/staff/edit_student/:id" element={<PrivateRoute><GeneralManageStudentPage action={"edit"}/></PrivateRoute>}/>
          <Route exact path="/staff/new/route/" element={<PrivateRoute><GeneralNewRoutePage></GeneralNewRoutePage></PrivateRoute>}></Route>

          <Route exact path="/admin/student/:id" element={<PrivateRoute><GeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/admin/school/:id" element={<PrivateRoute><GeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/admin/route/:id" element={<PrivateRoute><GeneralAdminRouteDetails /></PrivateRoute>}/>
          <Route exact path="/admin/user/:id" element={<PrivateRoute><GeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/admin/stop/:route_id/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>
          <Route exact path="/staff/user/:id" element={<PrivateRoute><GeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/staff/student/:id" element={<PrivateRoute><GeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/staff/school/:id" element={<PrivateRoute><GeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/staff/route/:id" element={<PrivateRoute><GeneralAdminRouteDetails /></PrivateRoute>}/>
          <Route exact path="/staff/stop/:route_id/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>
          <Route exact path="/driver/user/:id" element={<PrivateRoute><GeneralAdminUserDetails /></PrivateRoute>}/>
          <Route exact path="/driver/student/:id" element={<PrivateRoute><GeneralAdminStudentDetails /></PrivateRoute>}/>
          <Route exact path="/driver/school/:id" element={<PrivateRoute><GeneralAdminSchoolDetails /></PrivateRoute>}/>
          <Route exact path="/driver/route/:id" element={<PrivateRoute><GeneralAdminRouteDetails /></PrivateRoute>}/>
          <Route exact path="/driver/stop/:route_id/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>

          <Route exact path="/admin/route/plan/:school_id" element={<PrivateRoute><SchoolRoutesPlannerPage/></PrivateRoute>}/>
          <Route exact path="/staff/route/plan/:school_id" element={<PrivateRoute><SchoolRoutesPlannerPage/></PrivateRoute>}/>

          <Route exact path="/admin/email" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/admin/school_email/:school_id" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/admin/route_email/:school_id/:route_id" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/staff/email" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/staff/school_email/:school_id" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          <Route exact path="/staff/route_email/:school_id/:route_id" element={<PrivateRoute><GeneralAdminEmailPage/></PrivateRoute>}/>
          
          {/* Confirm a user's password */}
          <Route exact path="/user/make/new/:code" element={<GeneralUserConfirmationPage action='new'/>}/>

          {/* Reset a user's password */}
          <Route exact path="/user/reset/:code" element={<GeneralUserConfirmationPage action='reset'/>}/>

          <Route exact path="/admin/stop/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>
          <Route exact path="/staff/stop/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>
          <Route exact path="/driver/stop/:stop_id" element={<PrivateRoute><GeneralAdminStopDetails/></PrivateRoute>}/>

          <Route exact path="/*" element={<LoginForm />}></Route>

          <Route exact path="/upload_file" element={<PrivateRoute><GeneralUploadFilePage/></PrivateRoute>}></Route>

          <Route exact path="/upload_data" element={<PrivateRoute><GeneralUploadDataPage/></PrivateRoute>}></Route>
          <Route exact path="/upload_data/success" element={<PrivateRoute><GeneralBulkImportSuccessPage/></PrivateRoute>}></Route>
          <Route exact path="/print/:route_id" element={<GeneralPrintableRoster/>}></Route>
          <Route exact path="/drive/" element={<GeneralDriveStartPage/>}></Route>
          <Route exact path="/bus/map" element={<GeneralBusMapPage/>}></Route>
          <Route exact path="/bus/log/:filter/:id" element={<GeneralBusLogPage/>}></Route>
          <Route exact path="/bus/log" element={<GeneralBusLogPage/>}></Route>
          



          {/* Student Routes */}
          <Route exact path="/student/:student_id" element={<StudentPage />}></Route>
        </Routes>
      </BrowserRouter>
    )
}

export default Router
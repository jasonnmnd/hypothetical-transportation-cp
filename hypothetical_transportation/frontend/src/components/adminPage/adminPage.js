import React,{useState} from "react";
import Sidebar from "./components/sidebar/Sidebar";
import sidebardata from "./components/sidebar/sidebardata.json";
import Header from "../header/Header";
import AdminTable from "./components/table/AdminTable";
import "./adminPage.css";
import { Navigate } from "react-router-dom";
import EditForm from "./components/forms/EditForm";
import SidebarSliding from "./components/sidebar/SidebarSliding";


//This page will be used for the admin page to declutter App.js
function AdminPage( {user, Logout} ) {
  const [obj, setobj] = useState({
    id:"123",
    name:"what",
    email:"sss@a.com",
    school:"yolo"
  });

  const fields=["id","name","email","school"];

    return (
        (<div className="admin-page">
          {/* <Sidebar buttons={sidebardata}></Sidebar> */}
          <SidebarSliding/>
          <Header textToDisplay={"Admin Portal"}></Header>
          
          {/* <EditForm title="Title Here" fields={fields} obj={obj} setobj={setobj}></EditForm> */}
          {user.email==="" ? 
          (<Navigate to="/"></Navigate>)
          :(
          <div className="main-content">
            <div className="welcome">
              <h2>Welcome,<span>{user.name}</span></h2>
              <h3><p>Select an option from the sidebar for administrative abilities</p></h3>
              <h3><p>You can edit parental users, students, schools, and routes</p></h3>
              <div className="home-buttons">
                <button onClick={Logout}>Logout</button>

                {/* Change to Account Edit */}
                <button onClick={Logout}>Account</button> 
              </div>
            </div>              
          </div>)}
        </div>)
    )
}

export default AdminPage

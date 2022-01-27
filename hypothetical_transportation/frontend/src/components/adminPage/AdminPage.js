import React, {useState} from "react";
import Header from "../header/Header";
import "./adminPage.css";
import { Navigate, Link } from "react-router-dom";
import SidebarSliding from "./components/sidebar/SidebarSliding";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//This page will be used for the admin page to declutter App.js
function AdminPage( props ) {
    return (
        <div className="admin-page">
          {/* <Sidebar buttons={sidebardata}></Sidebar> */}
          <SidebarSliding/>
          <Header textToDisplay={"Admin Portal"}></Header>
          
          {/* <EditForm title="Title Here" fields={fields} obj={obj} setobj={setobj}></EditForm> */}
        
          <div className="main-content">
            <div className="welcome">
              <h2>Welcome,<span>{props.user.username}</span></h2>
              <h3><p>Select an option from the sidebar for administrative abilities</p></h3>
              <h3><p>You can edit parental users, students, schools, and routes</p></h3>
              <div className="home-buttons">
                <button onClick={props.Logout}>Logout</button>
                <Link to={"/account"}>
                  <button>Account</button> 
                </Link>
              </div>
            </div>              
          </div>
        </div>
    )
}

AdminPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    email: PropTypes.email
  })
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user

});

export default connect(mapStateToProps)(AdminPage)
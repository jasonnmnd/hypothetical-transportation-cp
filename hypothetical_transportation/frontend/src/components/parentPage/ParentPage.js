import React from "react";
import ParentTable from "./components/ParentTable";
import Header from "../header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import "./parentPage.css";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function ParentPage( props ) {
    return (
      
        <div className="parent-page">
          <Header textToDisplay={"Parent Portal"}></Header>
          <div>
            <div className="welcome">
              <h2>
                Welcome,<span>{props.user.name}</span>
              </h2>
              <div className="button-spacing">
                <button onClick={props.Logout}>Logout</button>
                <Link to={"/account"}>
                    <button>Account</button>
                </Link>
              </div>
            </div>
            <br></br>

            <div className="page-description">
              <h2>
                  Your Students
              </h2>
            </div>
            
            <ParentTable />
          </div>
          
        </div>

    )
}

ParentPage.propTypes = {
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

export default connect(mapStateToProps)(ParentPage)
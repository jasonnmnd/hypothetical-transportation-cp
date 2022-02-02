import React, {useEffect, useState} from "react";
import Header from "../header/Header";
import "./parentPage.css";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import isAdmin from "../../utils/user";
import SidebarSliding from "../adminPage/components/sidebar/SidebarSliding";
import { getStudentsByUserID, searchStudents } from '../../actions/students';
import GeneralParentTableView from "./views/GeneralParentTableView";

function ParentPage(props) {

  const title = "Students"
  const tableType = "student"

  useEffect(() => {
      props.getStudentsByUserID(props.user.id);
  }, []);

  const search = (value) => {
    props.searchStudents(value.by, value.value)
  }

    return (
      
        <div className="parent-page">
          {isAdmin(props.user)? <SidebarSliding/>:null}
          <Header textToDisplay={"Parent Portal"} shouldShowOptions={true}></Header>
          <div>
            <div className="welcome">
              <h2>
                Welcome,<span>{props.user.full_name}</span>
              </h2>
              <div className="button-spacing">
                <Link to={"/account"}>
                    <button>Account</button>
                </Link>
              </div>
            </div>
            <br></br>

            <div className="page-description">
              <GeneralParentTableView values={props.students} title={title} tableType={tableType} search={search} />
            </div>

          </div>
          
        </div>

    )
}

ParentPage.propTypes = {
    isAuthenticated: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      email: PropTypes.string
    }),
    logout: PropTypes.func.isRequired,
    getStudentsByUserID: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    students: state.students.students.results
});

export default connect(mapStateToProps, {logout, getStudentsByUserID, searchStudents} )(ParentPage)

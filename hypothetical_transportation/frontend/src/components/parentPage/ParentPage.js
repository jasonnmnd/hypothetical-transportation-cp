import React, {useEffect, useState} from "react";
import ParentTable from "./components/ParentTable";
import Header from "../header/Header";
import "./parentPage.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import isAdmin from "../../utils/user";
import AdminTable from "../adminPage/components/table/AdminTable";
import SidebarSliding from "../adminPage/components/sidebar/SidebarSliding";

function ParentPage(props) {

  const emptyStudent = {
    student_id: "",
    full_name:"",
    school: 0,
    routes: 0
  }

  const studentObject = [{
    id: 0,
    student_id: "",
    full_name:"",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const [students, setStudents] = useState(studentObject);
    
  const getStudents = () => {
    axios.get(`/api/student/?guardian=${props.user.id}`)
        .then(res => {
          console.log(res.data.results)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
      getStudents();
    }, []);

    return (
      
        <div className="parent-page">
          <Header textToDisplay={"Parent Portal"}></Header>
          {isAdmin(props.user)?        <SidebarSliding/>:null}
          <div>
            <div className="welcome">
              <h2>
                Welcome,<span>{props.user.full_name}</span>
              </h2>
              <div className="button-spacing">
                <button onClick={props.logout}>Logout</button>
                <Link to={"/account"}>
                    <button>Account</button>
                </Link>
              </div>
            </div>
            <br></br>

            <div className="page-description">
              <ParentTable title={"Your Students"} header={Object.keys(emptyStudent)} data={students}></ParentTable>
            </div>
            {/* <ParentTable /> */}



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
    logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user

});

export default connect(mapStateToProps, {logout} )(ParentPage)

import React, {useEffect, useState} from "react";
import ParentHeader from "../header/ParentHeader";
import Header from "../header/Header";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import isAdmin from "../../utils/user";
import { getStudents } from '../../actions/students';
import GeneralParentTableView from "./views/GeneralParentTableView";
import { Container, Row, Col } from 'react-bootstrap';
import GeneralAdminTableView from "../adminPage/components/views/GeneralAdminTableView";

function ParentPage(props) {

  const title = "Students"
  const tableType = "student"

  let [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.guardian = props.user.id;
      props.getStudents(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
    
  }, [searchParams]);

  const nav=useNavigate()
  const handleViewClick = (student) => {
    //route to /props.title?somethingid=id => props.title determins routing to student, route, school, user
    //console.log(d)
      nav(`/parent/student/${student.school.id}/${student.id}`);
  }


    return (
      
        // <div className="parent-page">
        //   {isAdmin(props.user)? <SidebarSliding/>:null}
        //   <Header textToDisplay={"Parent Portal"} shouldShowOptions={true}></Header>
        //   <div>
        //     <div className="welcome">
        //       <h2>
        //         Welcome,<span>{props.user.full_name}</span>
        //       </h2>
        //     </div>
        //     <br></br>

        //     <div className="page-description">
        //       <GeneralParentTableView values={props.students} title={title} tableType={tableType} />
        //     </div>

        //   </div>
          
        // </div>
        <div>
          {
            isAdmin(props.user) ? <Header></Header> : <ParentHeader></ParentHeader>
          }
          <Container>
              <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Welcome, {props.user.full_name}</h1>
              </div>

              <div className="shadow-lg p-3 mb-5 bg-white rounded">
                <GeneralAdminTableView values={props.students} title={title} tableType={tableType} action={handleViewClick} totalCount={props.studentCount} />
              </div>

          </Container>
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
    getStudents: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    students: state.students.students.results,
    studentCount: state.students.students.count
});

export default connect(mapStateToProps, {logout, getStudents} )(ParentPage)

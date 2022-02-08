import React, {useEffect, useState} from "react";
import ParentHeader from "../header/ParentHeader";
import Header from "../header/Header";
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import isAdmin from "../../utils/user";
import { getStudents } from '../../actions/students';
import GeneralParentTableView from "./views/GeneralParentTableView";
import { Container, Row, Col } from 'react-bootstrap';

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
          <Container className="d-flex flex-column justify-content-center align-items-center" style={{gap: "20px"}}>
              <Row>
                <Col><h1>Welcome, <span>{props.user.full_name}</span></h1></Col>
              </Row>

              <div className="shadow-lg p-3 mb-5 bg-white rounded">
                <GeneralParentTableView values={props.students} title={title} tableType={tableType} />
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
    students: state.students.students.results
});

export default connect(mapStateToProps, {logout, getStudents} )(ParentPage)

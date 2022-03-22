import React, {useState} from "react";
import "./NEWadminPage.css";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import Header from "../header/AdminHeader.js";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AdminPic from '../assets/user.jpg';
import StudentsPic from '../assets/student.jpg';
import SchoolPic from '../assets/school.jpg';
import RoutesPic from '../assets/route.jpg';
import StopsPic from '../assets/stopsPic.jpg';
import EmailPic from '../assets/email.jpg';
import DataPic from '../assets/bulk_import.jpg';
import isAdmin from "../../utils/user";
import getType from "../../utils/user2";

//This page will be used for the admin page to declutter App.js
function AdminPage( props ) {
  const navigate = useNavigate();
    return (
        <div>
          <Header/>
          <div>
            <Container>
              <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                  <h1>Welcome, {props.user.full_name}</h1>
              </div>
            </Container>
            <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{gap: "20px 50px"}}>

              <Row>
                <Col>
                  <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/${getType(props.user)}/users?pageNum=1`)} >
                    <Card.Img variant="top" src={AdminPic} style={{height: '300px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Users</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing users.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/${getType(props.user)}/students?pageNum=1`)}>
                    <Card.Img variant="top" src={StudentsPic} style={{height: '300px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Students</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing students.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/${getType(props.user)}/schools?pageNum=1`)}>
                    <Card.Img variant="top" src={SchoolPic} style={{height: '300px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Schools</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing schools.
                      </Card.Text> 
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/${getType(props.user)}/routes?pageNum=1`)}>
                    <Card.Img variant="top" src={RoutesPic} style={{height: '300px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Routes</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing routes.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                {isAdmin(props.user)?
                  <Col>
                    <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/${getType(props.user)}/email`)}>
                      <Card.Img variant="top" src={EmailPic} style={{height: '300px'}}/>
                      <Card.Body>
                        <Card.Title><strong>Email</strong></Card.Title>
                        <Card.Text>
                          Send an email to users.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  :
                  <></>
                }

                {isAdmin(props.user)?
                  <Col>
                    <Card className="text-center" style={{height:'450px', cursor: "pointer"}} onClick={() => navigate(`/upload_file`)}>
                      <Card.Img variant="top" src={DataPic} style={{height: '300px'}}/>
                      <Card.Body>
                        <Card.Title><strong>Data</strong></Card.Title>
                        <Card.Text>
                          Bulk upload data.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  :
                  <></>
                }
              </Row>
            </Container>

            <br></br>
            <br></br>
          </div>
        </div>
    )
}

AdminPage.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.number,
    email: PropTypes.string,
    full_name: PropTypes.string,
    address: PropTypes.string,
    groups: PropTypes.arrayOf(PropTypes.number)
  }),
  logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user

});

export default connect(mapStateToProps, { logout })(AdminPage)
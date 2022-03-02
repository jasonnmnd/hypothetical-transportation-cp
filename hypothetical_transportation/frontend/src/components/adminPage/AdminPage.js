import React, {useState} from "react";
import "./NEWadminPage.css";
import { Navigate, Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import Header from "../header/AdminHeader.js";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AdminPic from '../assets/adminPic.jpg';
import StudentsPic from '../assets/studentsPic.jpg';
import SchoolPic from '../assets/schoolPic.jpg';
import RoutesPic from '../assets/routesPic.jpg';
import StopsPic from '../assets/stopsPic.jpg';
import EmailPic from '../assets/emailPic.jpg';
import DataPic from '../assets/data.jpg';
import isAdmin from "../../utils/user";

//This page will be used for the admin page to declutter App.js
function AdminPage( props ) {
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
                  <Card className="text-center" style={{height:'500px'}}>
                    <Card.Img variant="top" src={AdminPic} style={{height: '350px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Users</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing users.
                      </Card.Text>
                        <Link to={`/admin/users?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Users</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{height:'500px'}}>
                    <Card.Img variant="top" src={StudentsPic} style={{height: '350px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Students</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing students.
                      </Card.Text>
                        <Link to={`/admin/students?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Students</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{height:'500px'}}>
                    <Card.Img variant="top" src={SchoolPic} style={{height: '350px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Schools</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing schools.
                      </Card.Text>
                      <Link to={`/admin/schools?pageNum=1`}>
                        <Button variant="yellow" size="lg">View Schools</Button>
                      </Link>  
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Card className="text-center" style={{height:'500px'}}>
                    <Card.Img variant="top" src={RoutesPic} style={{height: '350px'}}/>
                    <Card.Body>
                      <Card.Title><strong>Routes</strong></Card.Title>
                      <Card.Text>
                        View {isAdmin(props.user)? "and modify" :""} existing routes.
                      </Card.Text>
                        <Link to={`/admin/routes?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Routes</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
                {isAdmin(props.user)?
                  <Col>
                    <Card className="text-center" style={{height:'500px'}}>
                      <Card.Img variant="top" src={EmailPic} style={{height: '350px'}}/>
                      <Card.Body>
                        <Card.Title><strong>Email</strong></Card.Title>
                        <Card.Text>
                          Send an email to users.
                        </Card.Text>
                          <Link to={`/admin/email`}>
                            <Button variant="yellow" size="lg">Send Email</Button>
                          </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                  :
                  <></>
                }

                {isAdmin(props.user)?
                  <Col>
                    <Card className="text-center" style={{height:'500px'}}>
                      <Card.Img variant="top" src={DataPic} style={{height: '350px'}}/>
                      <Card.Body>
                        <Card.Title><strong>Data</strong></Card.Title>
                        <Card.Text>
                          Bulk Upload Data.
                        </Card.Text>
                          <Link to={`/`}>
                            <Button variant="yellow" size="lg">Upload Data</Button>
                          </Link>
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
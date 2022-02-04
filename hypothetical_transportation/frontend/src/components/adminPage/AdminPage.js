import React, {useState} from "react";
import "./NEWadminPage.css";
import { Navigate, Link } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from "../../actions/auth";
import Header from "../header/Header.js";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AdminPic from '../assets/adminPic.jpg';
import StudentsPic from '../assets/studentsPic.jpg';
import SchoolPic from '../assets/schoolPic.jpg';
import RoutesPic from '../assets/routesPic.jpg';

//This page will be used for the admin page to declutter App.js
function AdminPage( props ) {
    return (
        <div>
          <Header/>
          <div>
            <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{gap: "20px 50px"}}>
              <Row>
                <Col><h1>Welcome, <span>{props.user.full_name}</span></h1></Col>
              </Row>

              <Row>
                <Col>
                  <Card className="text-center" style={{ width: '35rem' }}>
                    <Card.Img variant="top" src={AdminPic} />
                    <Card.Body>
                      <Card.Title>Users Portal</Card.Title>
                      <Card.Text>
                        View and modify existing users.
                      </Card.Text>
                        <Link to={`/admin/users?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Users</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{ width: '35rem' }}>
                    <Card.Img variant="top" src={StudentsPic} />
                    <Card.Body>
                      <Card.Title>Students Portal</Card.Title>
                      <Card.Text>
                        View and modify existing students.
                      </Card.Text>
                        <Link to={`/admin/students?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Students</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card className="text-center" style={{ width: '35rem' }}>
                    <Card.Img variant="top" src={SchoolPic} />
                    <Card.Body>
                      <Card.Title>Schools Portal</Card.Title>
                      <Card.Text>
                        View and modify existing schools.
                      </Card.Text>
                      <Link to={`/admin/schools?pageNum=1`}>
                        <Button variant="yellow" size="lg">View Schools</Button>
                      </Link>  
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="text-center" style={{ width: '35rem' }}>
                    <Card.Img variant="top" src={RoutesPic} />
                    <Card.Body>
                      <Card.Title>Routes Portal</Card.Title>
                      <Card.Text>
                        View and modify existing routes.
                      </Card.Text>
                        <Link to={`/admin/routes?pageNum=1`}>
                          <Button variant="yellow" size="lg">View Routes</Button>
                        </Link>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
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
import React, {useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { getStudentInfo } from '../../actions/students';
import ParentHeader from '../header/ParentHeader';
import { Row, Card, Container, Col, Alert } from 'react-bootstrap';



function StudentPage(props) {


  const navigate = useNavigate();
  const param = useParams();
  const student = props.student

  useEffect(() => {
    props.getStudentInfo(param.student_id);
  }, []);

  return (
    <div>
        <ParentHeader></ParentHeader>

        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <Row  style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Name</Card.Header>
                    <Card.Body>
                        <Card.Text>{student.full_name}</Card.Text>
                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">StudentID </Card.Header>
                    <Card.Body>
                        <Card.Text>{student.student_id}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">School </Card.Header>
                    <Card.Body>
                        {student.school.name}
                    </Card.Body>
                </Card>

                <br></br>

                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Route</Card.Header>
                    <Card.Body>
                        <Container className='d-flex flex-column' style={{gap: "20px"}}>
                        {(student.routes!==undefined && student.routes!==null) ?
                                <p>{student.routes.name}</p>
                            :
                            <Alert variant="danger">
                                <Alert.Heading>You have no route</Alert.Heading>
                                <p>
                                Please wait for school staff to assign you a bus route.
                                </p>
                            </Alert>
                        }

                        {
                            (student.routes!==undefined && student.routes!==null && !student.has_inrange_stop ? 
                            <Alert variant="primary">
                                <Alert.Heading>No In-range Stop</Alert.Heading>
                                <p>
                                Please wait for school staff to plan bus stops.
                                </p>
                            </Alert>:<></>
                            )
                        }
                        </Container>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    </div>
  )
}

StudentPage.propTypes = {

}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    student: state.students.viewedStudent
});


export default connect(mapStateToProps, {logout, getStudentInfo} )(StudentPage)
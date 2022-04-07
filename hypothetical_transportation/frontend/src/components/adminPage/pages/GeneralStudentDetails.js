import React, { useEffect, useState } from 'react';
import Header from '../../header/AdminHeader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../NEWadminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudentInfo, deleteStudent } from '../../../actions/students';
import { Container, Card, Button, Row, Col, Alert, ButtonGroup } from 'react-bootstrap';
import isAdmin from '../../../utils/user';
import getType from '../../../utils/user2';
import isSchoolStaff from '../../../utils/userSchoolStaff';
import { updateStudent } from '../../../actions/students';

function GeneralAdminStudentDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const student = props.student
  const [openModal, setOpenModal] = useState(false);
  const [openStudentRecordDeleteModal, setOpenStudentRecordDeleteModal] = useState(false);

  const emptyStudent = {
    student_id: null,
    full_name: "",
    guardian: "",
    routes: "",
    school: "",
    email: null,
    phone_number: "",
  }

  const [obj, setObj] = useState(emptyStudent)

  const handleConfirmDeleteRecord = () => {
    props.deleteStudent(param.id);
    navigate(`/${getType(props.user)}/students/`)
  }

  const handleConfirmDeleteAccount = () => {
    props.updateStudent({...obj, ["email"]:null, ["phone_number"]:""}, param.id);
    navigate(`/${getType(props.user)}/students/`)
  }

  useEffect(() => {
    props.getStudentInfo(param.id);
  }, []);

  useEffect(() => {
      console.log(props.student)
    setObj({...student, ["guardian"]:student.guardian.id,["school"]:student.school.id,["routes"]:student.routes?student.routes.id:null})
  }, [props.student]);

  return (
    <div>  
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDeleteRecord}/>}</div>
        <div>{openStudentRecordDeleteModal && <DeleteModal closeModal={setOpenStudentRecordDeleteModal} handleConfirmDelete={handleConfirmDeleteAccount}/>}</div>
        <Header></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            {isAdmin(props.user) || isSchoolStaff(props.user)?
            <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                <Row>
                    <Col>
                        <Link to={`/${getType(props.user)}/edit_student/${student.id}`}>
                            <Button variant="yellowLong" size="lg">Edit Student</Button>
                        </Link>
                    </Col>

                    <Col>
                        <Button variant="yellowLong" size="lg" onClick={() => {
                        setOpenModal(true);
                        }}>Delete Student Record</Button>
                    </Col>
                </Row>
            </Container>
            :<></>}

            {(isAdmin(props.user) || isSchoolStaff(props.user)) && student.email != null ?
            <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                <Row>
                    <Col>
                        <Button variant="yellowLong" size="lg" onClick={() => {
                        setOpenStudentRecordDeleteModal(true);
                        }}>Delete Student Account</Button>
                    </Col>
                </Row>
            </Container>
            :
            <></>
            }

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

            <Row  style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Parent </Card.Header>
                    <Card.Body>
                        <Link to={`/${getType(props.user)}/user/${student.guardian.id}`}>
                            <h5>{student.guardian.full_name}</h5>
                        </Link>
                        
                        <Card.Text><strong>Email: </strong> {student.guardian.email}</Card.Text>
                        <Card.Text><strong>Phone: </strong> {student.guardian.phone_number}</Card.Text>


                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Address </Card.Header>
                    <Card.Body>
                        <Card.Text>{student.guardian.address}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            {student.email != null ?
            <Row  style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Student Email</Card.Header>
                    <Card.Body>
                        <Card.Text>{student.email}</Card.Text>
                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Student Phone Number </Card.Header>
                    <Card.Body>
                        <Card.Text>{student.phone_number=="" || student.phone_number==null? "No Phone Record Found":student.phone_number}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>
            :
            <></>
            }

            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">School </Card.Header>
                    <Card.Body>
                        <Link to={`/${getType(props.user)}/school/${student.school.id}`}>
                            <h5>{student.school.name}</h5>
                        </Link>
                    </Card.Body>
                </Card>

                <br></br>

                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Route</Card.Header>
                    <Card.Body>
                        <Container className='d-flex flex-column' style={{gap: "20px"}}>
                        {(student.routes!==undefined && student.routes!==null) ?
                            <Link to={`/${getType(props.user)}/route/${student.routes.id}`}>
                                <h5>{student.routes.name}</h5>
                            </Link>:
                            <Alert variant="danger">
                                <Alert.Heading>No Route for this Student</Alert.Heading>
                                <p>
                                This student has not been assigned a route. Please use the route planner to assign an appropriate route.
                                </p>
                                <hr />
                                {isAdmin(props.user)?
                                <Link to={`/${getType(props.user)}/school/${student.school.id}`}>
                                    View School Details Page for Route Planner
                                </Link>:<></>}
                            </Alert>
                        }

                        {
                            (student.routes!==undefined && student.routes!==null && !student.has_inrange_stop ? 
                            <Alert variant="primary">
                                <Alert.Heading>No In-range Stop for this Student</Alert.Heading>
                                <p>
                                This student has no stop that is in range. Please use the stop planner to assign an appropriate stop.
                                </p>
                                <hr />
                                {isAdmin(props.user)?
                                <Link to={`/${getType(props.user)}/route/plan/${student.school.id}?route=${student.routes.id}&view=1`}>
                                    Plan a Stop
                                </Link>:<></>
                                }
                            </Alert>:<></>
                            )
                        }
                        </Container>
                    </Card.Body>
                </Card>
            </Row>
        </Container>

        <br></br>
    </div>
  );
}

GeneralAdminStudentDetails.propTypes = {
    getStudentInfo: PropTypes.func.isRequired,
    deleteStudent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  student: state.students.viewedStudent
});

export default connect(mapStateToProps, {getStudentInfo, deleteStudent, updateStudent})(GeneralAdminStudentDetails)

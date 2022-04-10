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
import {getRunByRoute} from '../../../actions/drive';
import IconLegend from '../../common/IconLegend';
import MapComponent from '../../maps/MapComponent';
import StudentViewMap from '../../maps/StudentViewMap';
import { getInRangeStop } from '../../../actions/students';
import { runCallEveryPeriod } from '../../../utils/live_updating';

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
    setObj({...student, ["guardian"]:student.guardian.id,["school"]:student.school.id,["routes"]:student.routes?student.routes.id:null})
    if(student.routes){
        return runCallEveryPeriod(() => {
            console.log(student.id)
            props.getInRangeStop(student.id);
            props.getRunByRoute(student.routes.id);
        })
    }
  }, [props.student]);

  useEffect(() => {
    props.getInRangeStop(param.id);
  }, []);


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
                        {(student.routes!==undefined  && student.routes!==null && props.currentRun!==undefined && props.currentRun.id!==undefined && props.currentRun.route.id===student.routes.id) ?
                            <Alert variant="success">
                                <Alert.Heading>There is an active run for this route!</Alert.Heading>
                                <p>
                                    Bus Driver: {props.currentRun.driver.full_name}
                                </p>
                                <p>
                                    Bus Number: {props.currentRun.bus_number}
                                </p>
                            </Alert>:<></>
                        }
                        </Container>
                    </Card.Body>
                </Card>
            </Row>

            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Map View</Card.Header>
                    {(student.routes !==undefined && student.routes!==null) ?
                    <Container className='d-flex flex-column justify-content-center' style={{marginTop: "20px"}}>
                        <IconLegend legendType='student'></IconLegend>
                        <Card.Body style={{padding: "0px",marginTop: "20px",marginBottom: "20px"}}>
                            <StudentViewMap student={props.student} activeRun={props.currentRun} stops={props.stops} />
                        </Card.Body>    
                    </Container>
                    :
                    <Card.Body>
                        No stops to show right now. Please wait for an administrator to add stops.
                    </Card.Body>
                    }
                </Card>
            </Row>
        </Container>

        <br></br>
    </div>
  );
}

GeneralAdminStudentDetails.propTypes = {
    getStudentInfo: PropTypes.func.isRequired,
    deleteStudent: PropTypes.func.isRequired,
    getRunByRoute: PropTypes.func.isRequired,
    getInRangeStop: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  student: state.students.viewedStudent,
  currentRun: state.drive.currentRun,
  stops: state.students.inRangeStops.results,
});

export default connect(mapStateToProps, {getStudentInfo, deleteStudent, updateStudent, getRunByRoute, getInRangeStop})(GeneralAdminStudentDetails)

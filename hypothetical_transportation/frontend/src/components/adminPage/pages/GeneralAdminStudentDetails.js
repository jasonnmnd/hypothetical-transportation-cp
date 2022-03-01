import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../NEWadminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudentInfo, deleteStudent } from '../../../actions/students';
import { Container, Card, Button, Row, Col, Alert, ButtonGroup } from 'react-bootstrap'

function GeneralAdminStudentDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const student = props.student
  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    props.deleteStudent(param.id);
    navigate(`/admin/students/`)
  }

  useEffect(() => {
    props.getStudentInfo(param.id);
  }, []);

  return (
    <div>  
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <Header></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                <Row>
                    <Col>
                        <Link to={`/admin/edit_student/${student.id}`}>
                            <Button variant="yellowLong" size="lg">Edit Student</Button>
                        </Link>
                    </Col>

                    <Col>
                        <Button variant="yellowLong" size="lg" onClick={() => {
                        setOpenModal(true);
                        }}>Delete Student</Button>
                    </Col>
                </Row>
            </Container>

            
            
            <Card>
                <Card.Header as="h5">Name</Card.Header>
                <Card.Body>
                    <Card.Text>{student.full_name}</Card.Text>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h5">StudentID </Card.Header>
                <Card.Body>
                    <Card.Text>{student.student_id}</Card.Text>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h5">Address </Card.Header>
                <Card.Body>
                    <Card.Text>{student.guardian.address}</Card.Text>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h5">School </Card.Header>
                <Card.Body>
                    <Link to={`/admin/school/${student.school.id}`}>
                        <Button variant='yellow'><h5>{student.school.name}</h5></Button>
                    </Link>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h5">Parent </Card.Header>
                <Card.Body>
                    <Link to={`/admin/user/${student.guardian.id}`}>
                        <Button variant='yellow'><h5>{student.guardian.full_name}</h5></Button>
                    </Link>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header as="h5">Route</Card.Header>
                <Card.Body>
                    <Container className='d-flex flex-column' style={{gap: "20px"}}>
                    {(student.routes!==undefined && student.routes!==null) ?
                        <Link to={`/admin/route/${student.routes.id}`}>
                            <Button variant='yellow'><h5>{student.routes.name}</h5></Button>
                        </Link>:
                        <Alert variant="danger">
                            <Alert.Heading>No Route for this Student</Alert.Heading>
                            <p>
                            This student has not been assigned a route. Please use the route planner to assign an appropriate route.
                            </p>
                            <hr />
                            <Link to={`/admin/routes?pageNum=1`}>
                                <Button variant='yellow'>View Routes</Button>
                            </Link>
                        </Alert>
                    }

                    {
                        (student.routes!==undefined && student.routes!==null && !student.has_inrange_stop ? 
                        <Alert variant="danger">
                            <Alert.Heading>No In-range Stop for this Student</Alert.Heading>
                            <p>
                            This student has no stop that is in range. Please use the stop planner to assign an appropriate stop.
                            </p>
                            <hr />
                            <Link to={`/admin/route/plan/${student.school.id}?route=${student.routes.id}&view=1`}>
                                <Button variant='yellow'>Plan a Stop</Button>
                            </Link>
                        </Alert>:<></>
                        )
                    }
                    </Container>
                </Card.Body>
            </Card>
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
  student: state.students.viewedStudent
});

export default connect(mapStateToProps, {getStudentInfo, deleteStudent})(GeneralAdminStudentDetails)

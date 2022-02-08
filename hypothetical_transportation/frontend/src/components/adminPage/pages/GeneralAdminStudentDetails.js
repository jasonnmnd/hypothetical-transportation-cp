import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../NEWadminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudentInfo, deleteStudent } from '../../../actions/students';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

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
        <Header></Header>
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
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
                    <Button variant='yellow'><h3>{student.school.name}</h3></Button>
                </Link>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Parent </Card.Header>
            <Card.Body>
                <Link to={`/admin/user/${student.guardian.id}`}>
                    <Button variant='yellow'><h3>{student.guardian.full_name}</h3></Button>
                </Link>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Route</Card.Header>
            <Card.Body>
                {(student.routes!==undefined && student.routes!==null) ?
                    <Link to={`/admin/route/${student.routes.id}`}>
                        <Button variant='yellow'><h3>{student.routes.name}</h3></Button>
                    </Link>:
                    <h3>No Route for this student</h3>
                }
            </Card.Body>
        </Card>
        </Container>
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

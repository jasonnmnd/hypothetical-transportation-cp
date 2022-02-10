import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormDeleteModal from '../components/modals/FormDeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchool, deleteSchool } from '../../../actions/schools';
import { getStudents } from '../../../actions/students';
import { getRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import { filterObjectForKeySubstring } from '../../../utils/utils';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

function GeneralAdminSchoolDetails(props) {
  const navigate = useNavigate();
  const param = useParams();
  const STUDENT_PREFIX = "stu";
  const ROUTE_PREFIX = "rou";
  
  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = (schoolName) => {
    if (props.school.name === schoolName) {
      props.deleteSchool(param.id)
      navigate(`/admin/schools/`)
    } else {
      alert("School name does not match")
    }
  }

  let [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {


    if(searchParams.get(`${STUDENT_PREFIX}pageNum`) != null && searchParams.get(`${ROUTE_PREFIX}pageNum`) != null){
      const allSearchParams = Object.fromEntries([...searchParams]);

      let studentSearchParams = filterObjectForKeySubstring(allSearchParams, STUDENT_PREFIX);
      studentSearchParams.school = param.id;
      let routeSearchParams = filterObjectForKeySubstring(allSearchParams, ROUTE_PREFIX);
      routeSearchParams.school = param.id
      
      
      props.getStudents(studentSearchParams);
      props.getRoutes(routeSearchParams);
    }
    else{
      setSearchParams({
        [`${STUDENT_PREFIX}pageNum`]: 1,
        [`${ROUTE_PREFIX}pageNum`]: 1
      })
    }


    

  }, [searchParams]);

  useEffect(() => {
    props.getSchool(param.id);
  }, []);




  return (
    <>  
        <Header></Header>
        {openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/edit/school/${props.school.id}`}>
                        <Button variant="yellowLong" size="lg">Edit School</Button>
                    </Link>
                </Col>

                <Col>
                    <Button variant="yellowLong" size="lg" onClick={() => {
                      setOpenModal(true);
                    }}>Delete School</Button>
                </Col>

                <Col>
                    <Link to={`/admin/route/plan/${props.school.id}`}>
                        <Button variant="yellowLong">New Route for this School</Button>
                    </Link>

                </Col>
            </Row>
        </Container>
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.school.name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Address </Card.Header>
            <Card.Body>
                <Card.Text>{props.school.address}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Bus Arrival Time </Card.Header>
            <Card.Body>
                <Card.Text>{}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Bus Departure Time </Card.Header>
            <Card.Body>
                <Card.Text>{}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Students </Card.Header>
                <Card.Body>
                    <GeneralAdminTableView values={props.students} tableType='student' title='Associated Students' search={STUDENT_PREFIX} pagination={STUDENT_PREFIX}/>
                </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Routes </Card.Header>
            <Card.Body>
                <GeneralAdminTableView values={props.routes} tableType='route' title='Associated Routes' search={ROUTE_PREFIX} pagination={ROUTE_PREFIX}/>
            </Card.Body>
        </Card>
        </Container>
    </>
  );
}

GeneralAdminSchoolDetails.propTypes = {
    getSchool: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
     deleteSchool: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  school: state.schools.viewedSchool,
  students: state.students.students.results,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getSchool, getStudents, getRoutes, deleteSchool})(GeneralAdminSchoolDetails)

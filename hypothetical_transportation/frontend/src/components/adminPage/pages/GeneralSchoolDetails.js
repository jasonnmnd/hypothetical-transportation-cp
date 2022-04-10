import React, { useEffect, useState } from 'react';
import Header from '../../header/AdminHeader';
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
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import isAdmin from '../../../utils/user';
import getType from '../../../utils/user2'
import isSchoolStaff from '../../../utils/userSchoolStaff';

function GeneralAdminSchoolDetails(props) {
  const navigate = useNavigate();
  const param = useParams();
  const STUDENT_PREFIX = "stu";
  const ROUTE_PREFIX = "rou";
  
  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = (schoolName) => {
    if (props.school.name === schoolName) {
      props.deleteSchool(param.id)
      navigate(`/${getType(props.user)}/schools/`)
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
      {openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
      <Header></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
      {isAdmin(props.user) ? <>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
          <Row>
            <Col>
              <Link to={`/${getType(props.user)}/edit/school/${props.school.id}`}>
                <Button variant="yellowLong" size="lg">Edit School</Button>
              </Link>
            </Col>
            {isSchoolStaff(props.user) ? 
            <></>
            :
            <Col>
              <Button variant="yellowLong" size="lg" onClick={() => {
                setOpenModal(true);
              }}>Delete School</Button>
            </Col>
            }

          </Row>
        </Container>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
          <Row>
            <Col>
              <Link to={`/${getType(props.user)}/route/plan/${props.school.id}?view=0&create=true&route=${props.routes!==undefined && props.routes!==null && props.routes.length>0  && props.routes[0]!==null ? props.routes[0].id : "null"}`}>
                <Button variant="yellowLong" size="lg">New/Edit Route for this School</Button>
              </Link>

            </Col>

            <Col>
              <Link to={`/${getType(props.user)}/school_email/${props.school.id}`}>
                <Button variant="yellowLong" size="lg">Send School-wide Email</Button>
              </Link>
            </Col>
              
          </Row>
        </Container>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
          <Row>
            <Col>
              <Link to={`/bus/map/?school=${props.school.id}`}>
                <Button variant="yellowLong" size="lg">Active Bus Map</Button>
              </Link>

            </Col>

            <Col>
              <Link to={`/bus/log/school/${props.school.id}`}>
                <Button variant="yellowLong" size="lg">Bus Log For This School</Button>
              </Link>
            </Col>
              
          </Row>
        </Container>
        </> : <></>}
        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Name</Card.Header>
              <Card.Body>
                  <Card.Text>{props.school.name}</Card.Text>
              </Card.Body>
          </Card>

          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Address </Card.Header>
              <Card.Body>
                  <Card.Text>{props.school.address}</Card.Text>
              </Card.Body>
          </Card>
        </Row>
        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Bus Arrival Time </Card.Header>
              <Card.Body>
                  <Card.Text>{props.school.bus_arrival_time}</Card.Text>
              </Card.Body>
          </Card>

          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Bus Departure Time </Card.Header>
              <Card.Body>
                  <Card.Text>{props.school.bus_departure_time}</Card.Text>
              </Card.Body>
          </Card>
        </Row>

        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Associated Students </Card.Header>
                  <Card.Body>
                      <GeneralAdminTableView values={props.students} tableType='student' title='Associated Students' search={STUDENT_PREFIX} pagination={STUDENT_PREFIX} totalCount={props.studentCount}/>
                  </Card.Body>
          </Card>
        </Row>

        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Associated Routes </Card.Header>
              <Card.Body>
                  <GeneralAdminTableView values={props.routes} tableType='route' title='Associated Routes' search={ROUTE_PREFIX} pagination={ROUTE_PREFIX} totalCount={props.routeCount}/>
              </Card.Body>
          </Card>
        </Row>
      </Container>

      <br></br>
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
  routes: state.routes.routes.results,
  studentCount: state.students.students.count,
  routeCount: state.routes.routes.count
});

export default connect(mapStateToProps, {getSchool, getStudents, getRoutes, deleteSchool})(GeneralAdminSchoolDetails)

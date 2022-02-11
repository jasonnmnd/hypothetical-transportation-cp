import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRouteInfo, deleteRoute } from '../../../actions/routes';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import MapContainer from '../../maps/MapContainer';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'


function GeneralAdminRouteDetails(props) {


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    props.deleteRoute(parseInt(param.id));
    navigate(`/admin/routes/`);
  }
  
  const navigate = useNavigate();
  const param = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    props.getRouteInfo(param.id);
  }, []);

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.routes = param.id;
      props.getStudents(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
  }, [searchParams]);




  return (
    <div>  
        <Header></Header>
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/route/edit/${props.route.school.id}/${props.route.id}`}>
                        <Button variant="yellowLong" size="lg">Edit Route</Button>
                    </Link>
                </Col>

                <Col>
                    <Button variant="yellowLong" size="lg" onClick={() => {
                    setOpenModal(true);
                    }}>Delete Route</Button>
                </Col>
            </Row>
        </Container>
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.route.name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Description </Card.Header>
            <Card.Body>
                <Card.Text>{props.route.description}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">School </Card.Header>
            <Card.Body>
                <Link to={`/admin/school/${props.route.school.id}`}>
                    <Button variant='yellow'><h3>{props.route.school.name}</h3></Button>
                </Link>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Map View </Card.Header>
            <Card.Body>
                <MapContainer schoolData={props.route.school} routeStudentData={props.students}/>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Students</Card.Header>
            <Card.Body>
                <GeneralAdminTableView title='Associated Students' tableType='student' values={props.students} search="" />
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Stops</Card.Header>
            <Card.Body>
            </Card.Body>
        </Card>
        </Container>
    </div>
    );
}

GeneralAdminRouteDetails.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    deleteRoute: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  route: state.routes.viewedRoute, 
  students: state.students.students.results
});

export default connect(mapStateToProps, {getRouteInfo, getStudents, deleteRoute})(GeneralAdminRouteDetails)


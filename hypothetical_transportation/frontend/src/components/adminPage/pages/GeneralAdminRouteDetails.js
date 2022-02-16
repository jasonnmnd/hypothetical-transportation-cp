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
import { getStopByRoute } from '../../../actions/stops';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { filterObjectForKeySubstring } from '../../../utils/utils';


function GeneralAdminRouteDetails(props) {


  const [openModal, setOpenModal] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const STOP_PREFIX = "sto";  
  const [extra, setExtra] = useState({});

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    props.deleteRoute(parseInt(param.id));
    navigate(`/admin/routes/`);
  }
  
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    props.getRouteInfo(param.id);

    // const allSearchParams = Object.fromEntries([...searchParams]);
    // let stopSearchParams = filterObjectForKeySubstring(allSearchParams, STOP_PREFIX);  
    // stopSearchParams.route = param.id
    // console.log(stopSearchParams)
    props.getStopByRoute(param.id);
  }, []);

  useEffect(() => {
      console.log("?")
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

  useEffect(()=>{
    setExtra({id: props.route.school.id,name: props.route.school.name, dropoff_time: props.route.school.bus_arrival_time, pickup_time: props.route.school.bus_departure_time, stop_number: 0})
  },[props.route]);




  return (
    <div>  
        <Header></Header>
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/stop/plan/${props.route.school.id}/${props.route.id}`}>
                        <Button variant="yellowLong" size="lg">Stop Planner</Button>
                    </Link>
                </Col>

                <Col>
                    <Button variant="yellowLong" size="lg" onClick={() => {
                    setOpenModal(true);
                    }}>Delete Route</Button>
                </Col>
            </Row>
        </Container>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/route/plan/${props.route.school.id}?route=${props.route.id}`}>
                        <Button variant="yellowLong" size="lg">Edit Students in Route</Button>
                    </Link>
                </Col>
                <Col>
                    <Link to={`/admin/route_email/${props.route.school.id}/${props.route.id}`}>
                        <Button variant="yellowLong" size="lg">Send Route-wide Email</Button>
                    </Link>
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
                    <Button variant='yellow'><h5>{props.route.school.name}</h5></Button>
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
                <GeneralAdminTableView title='Associated Stops' tableType='stop' values={props.stops} search="" extraRow={extra}/>
            </Card.Body>
        </Card>
        </Container>
    </div>
    );
}

GeneralAdminRouteDetails.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getStopByRoute: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    deleteRoute: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  route: state.routes.viewedRoute, 
  students: state.students.students.results,
  stops:state.stop.stops.results
});

export default connect(mapStateToProps, {getRouteInfo, getStudents, deleteRoute,getStopByRoute})(GeneralAdminRouteDetails)


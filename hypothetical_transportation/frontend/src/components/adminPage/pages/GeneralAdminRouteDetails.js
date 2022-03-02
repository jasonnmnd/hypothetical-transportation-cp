import React, { useState, useEffect } from 'react';
import Header from '../../header/AdminHeader';
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
import { Container, Card, Button, Row, Col, Alert, Form } from 'react-bootstrap'
import { filterObjectForKeySubstring } from '../../../utils/utils';
import MapComponent from '../../maps/MapComponent';
import { getStudentPin, addSchoolPin, getStopPin } from '../../../utils/planner_maps';
import {InfoWindow} from '@react-google-maps/api';
import IconLegend from '../../common/IconLegend';
import isAdmin from '../../../utils/user'

function GeneralAdminRouteDetails(props) {


  const [openModal, setOpenModal] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const STOP_PREFIX = "sto";  
  const [extra, setExtra] = useState({});
  const [pinData, setPinData] = useState([]);
  const [extraComponents, setExtraComponents] = useState(null);


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
    setExtra({id: props.route.school.id,name: props.route.school.name, dropoff_time: props.route.school.bus_departure_time, pickup_time: props.route.school.bus_arrival_time, stop_number: 0})
    setPinData(getPinData());
  },[props.students,props.route,props.stops]);

    const getPinData = () => {
        let pinData = getStudentsPinData();
        addSchoolPin(pinData, props.route.school, onSchoolClick)
        pinData = pinData.concat(getStopPinData());
        // console.log(pinData);
        return pinData;
    }

    const getStopPinData = () => {
        return [
            {
                iconColor: "blue",
                iconType: "stop",
                markerProps: {
                    onClick: onStopClick,
                    draggable: false,
                    onRightClick: ""
                },
                pins: props.stops.map(stop => getStopPin(stop))
            },
        ]
    }

    const onStopClick = (pinStuff, position) => {
        createInfoWindow(position, <h4>{pinStuff.name}</h4>)
    }

    const onSchoolClick = (pinStuff, position) => {
        createInfoWindow(position, <h1>{pinStuff.name}</h1>)
    }

    const getStudentsPinData = () => {
    return [
        {
            iconColor: "green",
            iconType: "studentCheck",
            markerProps: {
                onClick: onStudentClick,
                onRightClick: ""
            },
            pins: props.students.map(student => {return getStudentPin(student)})
        }
    ]
  }
    const onStudentClick = (pinStuff, position) => {
        
        createInfoWindow(position, 
            <><h4>{pinStuff.full_name}</h4></>
        )
    }

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
    }

  return (
    <div>          
        <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <Header></Header>
        
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        {isAdmin(props.user) ? 
        <>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/route/plan/${props.route.school.id}?route=${props.route.id}&view=0`}>
                        <Button variant="yellowLong" size="lg">Route Planner</Button>
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
                    <Link to={`/print/${props.route.id}`} target="_blank">
                        <Button variant="yellowLong" size="lg">Print Route Roster</Button>
                    </Link>
                </Col>
                
                <Col>
                    <Link to={`/admin/route_email/${props.route.school.id}/${props.route.id}`}>
                        <Button variant="yellowLong" size="lg">Send Route-wide Email</Button>
                    </Link>
                </Col>
            </Row>
        </Container></>: <></>
        }
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.route.name}</Card.Text>
                { props.route.is_complete ?
                <></>
                :
                <Alert variant="danger">
                {/* <Alert.Heading>Warning: This route is incomplete!</Alert.Heading> */}
                <p>
                    Warning: This route is incomplete! There are students on this route who currently do not have an in-range stop.
                    Use the Stop Planner to plan stops for these student(s).
                </p>
                </Alert>
                }
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Description </Card.Header>
            <Card.Body>
                <Form.Group className="mb-3" controlId="formGridDescription">
                    <Form.Control 
                    type="text"
                    as="textarea"
                    value={props.route.description}
                    style={{height: '200px',pointerEvents: "none"}}
                    readOnly
                  />
              </Form.Group>
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
            <Card.Header as="h5">Map View of School, Students, and Stops</Card.Header>
            <Container className='d-flex flex-column justify-content-center' style={{marginTop: "20px"}}>
                <IconLegend legendType='routeDetails'></IconLegend>
                <Card.Body>
                    {props.route.school.id===-1?
                        <></>:
                        <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.route.school.longitude),lat: Number(props.route.school.latitude)}}></MapComponent>}
                </Card.Body>    
            </Container>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Students</Card.Header>
            <Card.Body>
                <GeneralAdminTableView title='Associated Students' tableType='student' values={props.students} search="" totalCount={props.studentCount} />
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Associated Stops</Card.Header>
            <Card.Body>
                <GeneralAdminTableView title='Associated Stops' tableType='stop' values={props.stops} search="stop" extraRow={extra} totalCount={props.stopCount + 1}/>
            </Card.Body>
        </Card>
        </Container>

        <br></br>
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
  school: state.schools.viewedSchool,
  students: state.students.students.results,
  stops:state.stop.stops.results,
  studentCount: state.students.students.count,
  stopCount: state.stop.stops.count
});

export default connect(mapStateToProps, {getRouteInfo, getStudents, deleteRoute,getStopByRoute})(GeneralAdminRouteDetails)


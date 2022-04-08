import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { getStudentInfo, getInRangeStop } from '../../actions/students';
import ParentHeader from '../header/ParentHeader';
import { Row, Card, Container, Col, Alert } from 'react-bootstrap';
import IconLegend from '../common/IconLegend';
import MapComponent from '../maps/MapComponent';
import GeneralAdminTableView from '../adminPage/components/views/GeneralAdminTableView';
import { getRunByRoute } from '../../actions/drive';
import getType from '../../utils/user2';
import { InfoWindow } from '@react-google-maps/api';

function StudentPage(props) {


  const navigate = useNavigate();
  const param = useParams();
  const student = props.student;
  let [searchParams, setSearchParams] = useSearchParams();
  const [pinData, setPinData] = useState([]);
  const [extraComponents, setExtraComponents] = useState(null);

  useEffect(() => {
    props.getStudentInfo(props.user.linked_student);
  }, []);

  useEffect(()=>{
    if(props.student.routes) props.getRunByRoute(props.student.routes.id)
    
  },[props.student])



    const doNothing = ()=>{

    }

    useEffect(() => {
        if(searchParams.get(`pageNum`) != null){
            let paramsToSend = Object.fromEntries([...searchParams]);
            paramsToSend.student = props.user.linked_student;
            props.getInRangeStop(props.user.linked_student, paramsToSend);
        }
        else{
            setSearchParams({
            [`pageNum`]: 1,
            })
        }
        }, [searchParams]);

    useEffect(()=>{
        setPinData(getPinData());
    },[props.stops, student, props.activeRun])

    const getPinData = () => {
        let pinData = getStopPinData();
        addStudentPin(pinData, onStudentClick);
        addBusPin(pinData)
        // console.log(pinData);
        return pinData;
    }

    const getStudentPin = (s) => {
        return {
            ...s, 
            address: s.guardian.address, 
            latitude: s.guardian.latitude, 
            longitude: s.guardian.longitude
        }
    }
    const getStopPin = (stop) => {
        return {
            ...stop, 
        }
    }

    const getRunPin = () => {
        console.log(props)
        return {
            ...props.activeRun, 
            latitude: props.activeRun.location.latitude, 
            longitude: props.activeRun.location.longitude, 
        }
    }

    const addBusPin = (pinData) => {
        if(props.activeRun.driver == null){
            return
        }
        pinData.push({
            iconColor: "black",
            iconType: "bus",
            markerProps: {
                onClick: onBusClick,
            },
            pins: [
                getRunPin()
            ]
        })
    }

    const getBusInfoForWindow = (pinStuff) => {
        return (
            <>
                <h4>Bus {pinStuff.bus_number}</h4>
                <h5>Driver: {pinStuff.driver.full_name}</h5>
                <h5>Route: {pinStuff.route.name}</h5>
            </>
            
        )
    }

    const onBusClick = (pinStuff, position) => {
        createInfoWindow(position, getBusInfoForWindow(pinStuff))
    }

    const addStudentPin = (pinData, onclick) => {
        pinData.push({
            iconColor: "green",
            iconType: "studentCheck",
            markerProps: {
                onClick: onclick
            },
            pins: [
                getStudentPin(student)
            ]
        })
    }

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
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
        createInfoWindow(position, 
            <div>
                <h5>Name:{pinStuff.name}</h5>
                <h5>Pick Up: {pinStuff.pickup_time}</h5>
                <h5>Drop Off: {pinStuff.dropoff_time}</h5>
            </div>
        )
    }

    const onStudentClick = (pinStuff, position) => {
        createInfoWindow(position, 
            <><h4>{pinStuff.full_name}</h4></>
        )
    }

  return (
    <div>
        <ParentHeader></ParentHeader>

        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <div className=" p-3 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Your Information</h1>
            </div>
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
                            <>
                                <div><strong>Name: </strong>{student.routes.name}</div>
                                <div><strong>Description: </strong>{student.routes.description}</div>
                            </>
                            :
                            <Alert variant="danger">
                                <Alert.Heading>You have no route</Alert.Heading>
                                <p>
                                Please wait for school staff to assign you a bus route.
                                </p>
                            </Alert>
                        }
                        </Container>
                    </Card.Body>
                </Card>
            </Row>

        {props.activeRun!==undefined && props.activeRun!==null && props.activeRun.end_time !==undefined &&  props.activeRun.end_time ==null ?
        <Row style={{gap: "10px"}}>
        <Card border={"success"} as={Col} style={{padding: "0px", backgroundColor: "#d9ffe0"}}>
            <Card.Header as="h5">Active Run Info </Card.Header>
            <Card.Body>
                <p><strong>Bus Driver:</strong> {props.activeRun.driver!==null && props.activeRun.driver !== undefined ? props.activeRun.driver.full_name : ""}</p>
                <p><strong>Bus Number:</strong> {props.activeRun.bus_number!==null && props.activeRun.bus_number!==undefined ?props.activeRun.bus_number : ""}</p>
            </Card.Body>
        </Card></Row> : <></>}

            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Map View of Stops</Card.Header>
                    {(student.routes !==undefined && student.routes!==null) ?
                    <Container className='d-flex flex-column justify-content-center' style={{marginTop: "20px"}}>
                        <IconLegend legendType='student'></IconLegend>
                        <Card.Body style={{padding: "0px",marginTop: "20px",marginBottom: "20px"}}>
                            <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.student.guardian.longitude),lat: Number(props.student.guardian.latitude)}}></MapComponent>
                        </Card.Body>    
                    </Container>
                    :
                    <Card.Body>
                        No stops to show right now. Please wait for an administrator to add stops.
                    </Card.Body>
                    }
                </Card>
            </Row>

            
            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">In Range Stops</Card.Header>
                    <Card.Body>
                        <GeneralAdminTableView title='In Range Stops' tableType='stop' search="stop" values={props.stops} action={doNothing} totalCount={props.stopCount}/>
                    </Card.Body>
                </Card>
            </Row>
            <br></br>
            <br></br>
        </Container>
    </div>
  )
}

StudentPage.propTypes = {
    getRunByRoute: PropTypes.func.isRequired,

}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    student: state.students.viewedStudent,
    stops: state.students.inRangeStops.results,
    stopCount: state.students.inRangeStops.count,
    activeRun: state.drive.currentRun,
});


export default connect(mapStateToProps, {logout, getStudentInfo, getInRangeStop,getRunByRoute} )(StudentPage)
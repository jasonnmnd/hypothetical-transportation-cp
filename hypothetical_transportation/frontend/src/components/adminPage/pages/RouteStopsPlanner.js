import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { Container, Card, Button, Collapse, Alert } from 'react-bootstrap';
import '../NEWadminPage.css';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import { NO_ROUTE } from '../../../utils/utils';
import { getStopByRoute, deleteStop, createStop, updateStop } from '../../../actions/stops';
import StopPlannerMap from './StopPlannerMap';
import ModifyStopTable from '../components/forms/ModifyStopTable';
import Geocode from "react-geocode";
import IconLegend from '../../common/IconLegend';
import { isStudentWithinRange } from '../../../utils/geocode';
import { createMessageDispatch } from '../../../actions/messages';


function RouteStopsPlanner(props) {

  const [students, setStudents] = useState(props.students);

  const [newStopID, setNewStopID] = useState(-1);

  const [complete,setComplete] = useState(true);




  useEffect(() => {
    props.getStopByRoute(props.route_id);
    props.getStudents({routes: props.route_id})
  }, [props.route_id]);

  useEffect(() => {
    setStudents(JSON.parse(JSON.stringify(props.students)))
  }, [props.students]);

  useEffect(() => {
    props.initStops.sort((a, b) => a.stop_number - b.stop_number);
    setStops(JSON.parse(JSON.stringify(props.initStops)))
  }, [props.initStops]);

  useEffect(() => {
    setComplete(props.currentRoute.is_complete)
  }, [props.currentRoute]);

  useEffect(() => {
    props.getStopByRoute(props.route_id);
    props.getStudents({routes: props.route_id})
  }, []);  
  

  const setStops = (newStops) => {
    let tempStopsData = Array.from(newStops);
    tempStopsData.forEach((stop, index) => stop.stop_number = index+1)
    props.setStopsWithProperInds(tempStopsData);
    let tempStudentData = Array.from(students);
    tempStudentData.forEach(student => student.has_inrange_stop = isStudentWithinRange(student, tempStopsData));
    setStudents(tempStudentData);
  }


  

  const addNewStop = () => {
      setStops([...props.stops, {
        location: props.school.address,
        latitude: props.school.latitude,
        longitude: props.school.longitude,
        name: `Stop ${props.stops.length + 1}`,
        id: newStopID,
        route: props.route_id
      }]);
      setNewStopID(newStopID - 1);
  }

  const onStopDragEnd = (pinInfo, e) => {
    const curLat = e.latLng.lat();
    const curLng = e.latLng.lng();
    let tempData = Array.from(props.stops);
    let changingElementIndex = tempData.findIndex(stop => stop.id == pinInfo.id);
    tempData[changingElementIndex].latitude = curLat
    tempData[changingElementIndex].longitude = curLng
    Geocode.fromLatLng(curLat, curLng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        tempData[changingElementIndex].location = address
        setStops(tempData)
      },
      (error) => {
        tempData[changingElementIndex].location = `${curLat}, ${curLng}`
        setStops(tempData)
      }
    );
    
  }

  const deleteStopFromTable = (pinInfo, position) => {
    setStops(props.stops.filter(stop => stop.id != pinInfo.id));
    props.setDeletedStops([...props.deletedStops, pinInfo])
  }

  const readdStop = (pinInfo) => {
    props.setDeletedStops(props.deletedStops.filter(stop => stop.id != pinInfo.id));
    setStops([...props.stops, pinInfo])
  }

  const resetStopChanges = () => {
    setStops(JSON.parse(JSON.stringify(props.stops)));
    props.setDeletedStops([])
  }



  return (
    
    <>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>

        { complete ?
        <Alert variant="success">
        <Alert.Heading>Success: This route is complete!</Alert.Heading>
        <p>
            All students have in-range stops.
        </p>
        </Alert>
        :
        <Alert variant="danger">
        <Alert.Heading>Warning: This route is incomplete!</Alert.Heading>
        <p>
            There are students on this route who currently do not have an in-range stop.
            Use the interface to plan stops for these student(s).
        </p>
        </Alert>
        }
        
        <br></br>

        <Container className="d-flex flex-column justify-content-center" style={{gap: "30px"}}>
          <Card>
            <Card.Header as="h5">Stop Planner Map</Card.Header>
            <Card.Body>
              {/* <Card>
                <Card.Body>
                  <h5 style={{fontWeight:"700px"}}>Instructions: </h5>
                  <h6>Drag and Drop Stops to Reposition. Right Click to Remove Stop. Left Click to View Info.</h6>
                </Card.Body>
              </Card> */}
              <Container className='d-flex flex-row justify-content-center'>
                <Button variant='yellowsubmit' onClick={addNewStop}>Add New Stop</Button>
              </Container>

              <br></br>

                <Container className="d-flex flex-row justify-content-center">
                  <Container style={{width: "800px"}}>
                  <StopPlannerMap 
                      students={students} 
                      school={props.school} 
                      onStopDragEnd={onStopDragEnd}
                      stops={props.stops}
                      deleteStop={deleteStopFromTable}
                      setComplete={setComplete}
                  />
                  </Container>
                  <IconLegend legendType='stopPlanner'></IconLegend>
                </Container>
              </Card.Body>
          </Card>

          <Card>
            <Card.Header as="h5">Reorganize Stops - Drag Row to Reorder</Card.Header>
            <Card.Body>
              <ModifyStopTable 
                stops={props.stops} 
                setStops={setStops} 
                setStopsWithProperInds={props.setStopsWithProperInds} 
                deletedStops={props.deletedStops} 
                readdStop={readdStop} 
                deleteStop={deleteStopFromTable}
            />
            </Card.Body>
          </Card>
        </Container>        

        <br></br>

        <Container className="d-flex flex-row justify-content-center" style={{gap: "20px"}}>
          <Button variant='yellowsubmit' onClick={props.submit}>Save Changes</Button>
          <Button variant='yellowsubmit' onClick={resetStopChanges}>Reset Changes</Button>
        </Container>

        <br></br>

      </Container>
    </>

    );
}

RouteStopsPlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    getStopByRoute: PropTypes.func.isRequired,
    deleteStop: PropTypes.func.isRequired,
    createStop: PropTypes.func.isRequired,
    updateStop: PropTypes.func.isRequired,
    stops: PropTypes.array,
    initStops: PropTypes.array,
    createMessageDispatch: PropTypes.func.isRequired,
    route_id: PropTypes.string,
    school: PropTypes.object
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  studentsInSchool: state.students.students.results,
  currentRoute: state.routes.viewedRoute
});

RouteStopsPlanner.defaultProps = {
    stops: [
        
    ],
}

export default connect(mapStateToProps, {createMessageDispatch, updateStop, getStopByRoute, getRouteInfo, getSchool, getStudents, deleteStop, createStop})(RouteStopsPlanner)

import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { Container, Card, Button, Form, Collapse, Alert } from 'react-bootstrap';
import '../NEWadminPage.css';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import { NO_ROUTE } from '../../../utils/utils';
import { getStopByRoute } from '../../../actions/stops';
import StopPlannerMap from './StopPlannerMap';
import ModifyStopTable from '../components/forms/ModifyStopTable';
import Geocode from "react-geocode";
import { isStudentWithinRange } from '../../../utils/geocode';


function AdminRouteStopsPlanner(props) {
  const param = useParams();
  const navigate = useNavigate();

  const [stops, setStopsWithProperInds] = useState(props.stops);

  const [students, setStudents] = useState(props.students);

  const [deletedStops, setDeletedStops] = useState([]);

  const [newStopID, setNewStopID] = useState(-1);



  useEffect(() => {
    props.getStopByRoute(param.route_id);
  }, [param]);

  useEffect(() => {
    setStudents(props.students)
  }, [props.students]);

  useEffect(() => {
    setStops(props.stops)
    props.getSchool(param.school_id);
    props.getStudents({routes: param.route_id})
  }, []);

  const setStops = (newStops) => {
    let tempStopsData = Array.from(newStops);
    tempStopsData.forEach((stop, index) => stop.stop_number = index+1)
    setStopsWithProperInds(tempStopsData);
    let tempStudentData = Array.from(students);
    tempStudentData.forEach(student => student.has_inrange_stop = isStudentWithinRange(student, tempStopsData));
    setStudents(tempStudentData);
  }


  const submit = () => {
    const routeVal = studentChanges[student] == NO_ROUTE ? null : studentChanges[student]
    Object.keys(studentChanges).forEach(student => {
      props.patchStudent({
        routes: routeVal
      }, student);
    });
    navigate(`/admin/routes/`);
  }

  const addNewStop = () => {
      setStops([...stops, {
        location: props.school.address,
        latitude: props.school.latitude,
        longitude: props.school.longitude,
        name: `Stop ${stops.length + 1}`,
        id: newStopID
      }]);
      setNewStopID(newStopID - 1);
  }

  const onStopDragEnd = (pinInfo, e) => {
    const curLat = e.latLng.lat();
    const curLng = e.latLng.lng();
    let tempData = Array.from(stops);
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

  const deleteStop = (pinInfo, position) => {
    setStops(stops.filter(stop => stop.id != pinInfo.id));
    setDeletedStops([...deletedStops, pinInfo])
  }

  const readdStop = (pinInfo) => {
    setDeletedStops(deletedStops.filter(stop => stop.id != pinInfo.id));
    setStops([...stops, pinInfo])
  }

  const resetStopChanges = () => {
    setStops(props.stops);
  }

  const [openInstruc, setOpenInstruc] = useState(false);

  return (
    
    <>
      <Header shouldShowOptions={true}></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        
        <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
          <h1>{`${props.currentRoute.name} Stop Planner`}</h1>
        </div>

        { props.currentRoute.is_complete ?
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

        <div className='d-flex flex-row justify-content-center'>
          <Button
          onClick={() => setOpenInstruc(!openInstruc)}
          aria-controls="example-collapse-text"
          aria-expanded={openInstruc}
          variant="instrucToggle"
          >
            Stop Planner Instructions {openInstruc ? "▲" : "▼"}
          </Button>
        </div>
        
        <Collapse in={openInstruc}>
          <Card>
            <Card.Body>
              <div id="example-collapse-text">
                <div className='d-flex flex-row justify-content-center'>
                  <strong>Welcome to the stop planner interface.</strong>
                </div>
                  <p>Within this interface, you can interactively create, modify, and reorganize stops. Students are shown with the student pin and routes are shown with the route pin.</p>
                  <p>Use the table to drag and drop "=" to reorganize stops. Finalize changes by clicking on "Save". Revert changes made by clicking on "Reset".</p>
              </div>
            </Card.Body>
          </Card>
        </Collapse>

        <br></br>

        <Container className="d-flex flex-column justify-content-center" style={{gap: "30px"}}>
            <StopPlannerMap 
                students={students} 
                school={props.school} 
                onStopDragEnd={onStopDragEnd}
                stops={stops}
                deleteStop={deleteStop}
            />

          <Card>
            <Card.Header as="h5">Reorganize Stops</Card.Header>
            <Card.Body>
              <ModifyStopTable stops={stops} setStops={setStops} setStopsWithProperInds={setStopsWithProperInds} deletedStops={deletedStops} readdStop={readdStop} />
            </Card.Body>
          </Card>
        </Container>        

        <br></br>

        <Container className="d-flex flex-row justify-content-center" style={{gap: "20px"}}>
          <Button variant='yellowsubmit' onClick={submit}>Save Changes</Button>
          <Button variant='yellowsubmit' onClick={resetStopChanges}>Reset Changes</Button>
          <Button variant='yellowsubmit' onClick={addNewStop}>Add New Stop</Button>
        </Container>

      </Container>
    </>

    );
}

AdminRouteStopsPlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    updateRoute: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired,
    createRoute: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    resetViewedRoute: PropTypes.func.isRequired,
    getStopByRoute: PropTypes.func.isRequired,
    stops: PropTypes.array
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  routes: state.routes.routes.results, 
  currentRoute: state.routes.viewedRoute,
  school: state.schools.viewedSchool,
  studentsInSchool: state.students.students.results,
  //stops: state.stops.stops.results
});

AdminRouteStopsPlanner.defaultProps = {
    stops: [
        {
            location: "68 Walters Brook Drive, Bridgewater, NJ",
            latitude: 40.58885594887111,
            longitude: -74.60416028632812,
            name: "Stop 1",
            route: 402,
            id: 19,
            stop_number: 1
        },
        {
            location: "90 Walters Brook Drive, Bridgewater, NJ",
            latitude: 40.58770627689465,
            longitude: -74.66309603862304,
            name: "Stop 2",
            route: 402,
            id: 20,
            stop_number: 2
        }
    ],
}

export default connect(mapStateToProps, {getStopByRoute, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(AdminRouteStopsPlanner)

import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { Container, Card, Button, Form } from 'react-bootstrap';
import '../NEWadminPage.css';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import { NO_ROUTE } from '../../../utils/utils';
import { getStopByRoute } from '../../../actions/stops';
import StopPlannerMap from './StopPlannerMap';
import ModifyStopTable from '../components/forms/ModifyStopTable';


function AdminRouteStopsPlanner(props) {
  const param = useParams();
  const navigate = useNavigate();

  const [stops, setStops] = useState(props.stops)



  useEffect(() => {
    props.getStopByRoute(param.route_id);
  }, [param]);

  useEffect(() => {
    console.log(props.stops)
    console.log("HELLOO")
    setStops(props.stops)
    props.getSchool(param.school_id);
    props.getStudents({routes: param.route_id})
  }, []);


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
      console.log("ADDING STOP")
  }

  const onStopDragEnd = (pinInfo, e) => {
    let tempData = Array.from(props.stops);
    let changingElementIndex = tempData.findIndex(stop => stop.id == pinInfo.id);
    tempData[changingElementIndex].latitude = e.latLng.lat()
    tempData[changingElementIndex].longitude = e.latLng.lng()
    setStops(tempData)
  }

  const resetStopChanges = () => {
    setStops(props.stops);
  }





  return (
    
    <>
      <Header textToDisplay={"Route Planner"} shouldShowOptions={true}></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        <h1>{`${props.currentRoute.name} Stop Planner`}</h1>
        <Container className="container-main d-flex flex-row" style={{gap: "10px"}}>
            <StopPlannerMap 
                students={props.students} 
                school={props.school} 
                onStopDragEnd={onStopDragEnd}
                stops={stops}
            />
            <ModifyStopTable stops={stops} setStops={setStops}/>
        </Container>
        <Button variant='yellow' onClick={submit}><h3>Save</h3></Button>
        <Button variant='yellow' onClick={resetStopChanges}><h3>Reset</h3></Button>
        <Button variant='yellow' onClick={addNewStop}><h3>Add New Stop</h3></Button>
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
            address: "68 Walters Brook Drive, Bridgewater, NJ",
            latitude: 40.58885594887111,
            longitude: -74.60416028632812,
            name: "Stop 1",
            id: 1
        },
        {
            address: "90 Walters Brook Drive, Bridgewater, NJ",
            latitude: 40.58770627689465,
            longitude: -74.66309603862304,
            name: "Stop 2",
            id: 2
        }
    ],
}

export default connect(mapStateToProps, {getStopByRoute, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(AdminRouteStopsPlanner)

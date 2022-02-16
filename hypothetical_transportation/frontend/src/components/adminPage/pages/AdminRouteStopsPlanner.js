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

  const resetStudentChanges = () => {
    setStudentChanges({})
  }

  const addNewStop = () => {
      console.log("ADDING STOP")
  }

  const onStopDragEnd = (pinInfo, position) => {
    console.log(pinInfo)
    console.log(position)
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
                // currentRoute={getRouteFromSearchParams()} 
                // changeStudentRoute={changeStudentRoute}
                // studentChanges={studentChanges}
                // allRoutes={props.routes}
            />
            <ModifyStopTable stops={stops} setStops={setStops}/>
        </Container>
        <Button variant='yellow' onClick={submit}><h3>Save</h3></Button>
        <Button variant='yellow' onClick={resetStudentChanges}><h3>Reset</h3></Button>
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
    getStopByRoute: PropTypes.func.isRequired
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
            name: "Stop 1",
            id: 1
        },
        {
            address: "90 Walters Brook Drive, Bridgewater, NJ",
            name: "Stop 2",
            id: 2
        }
    ],
}

export default connect(mapStateToProps, {getStopByRoute, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(AdminRouteStopsPlanner)

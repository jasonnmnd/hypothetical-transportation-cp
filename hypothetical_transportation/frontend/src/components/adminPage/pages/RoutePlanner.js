import React, { useEffect, useState, Fragment } from 'react';
import Header from '../../header/Header';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import '../NEWadminPage.css';
import MapComponent from '../../maps/MapComponent';
import ModifyRouteInfo from '../components/forms/ModifyRouteInfo';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute,resetPosted } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import RoutePlannerMap from './RoutePlannerMap';
import { NO_ROUTE } from '../../../utils/utils';
import { Container, ButtonGroup, ToggleButton, Card, Button, Form, Collapse, Modal } from 'react-bootstrap';
import IconLegend from '../../common/IconLegend';
import { getCurRouteFromStudent } from '../../../utils/planner_maps';
import { createMessageDispatch } from '../../../actions/messages';


const IS_CREATE_PARAM = 'create';
const VIEW_PARAM = 'view';
const ROUTE_PARAM = 'route';

function RoutePlanner(props) {

  const [studentChanges, setStudentChanges] = useState({});

  useEffect(() => {
    props.getStudents({school: props.school.id})
  }, []);

  

  const changeStudentRoute = (pinStuff, position) => {
    let newID = "";
    if(getCurRouteFromStudent(pinStuff, studentChanges) == props.currentRouteID){
      newID = NO_ROUTE
    }
    else {
      newID = props.currentRouteID
    }
    setStudentChanges({
      ...studentChanges,
      [pinStuff.id]: newID
    })
  }

  const saveRoutePlannerMapChanges = () => {
    Object.keys(studentChanges).forEach(student => {
      const routeVal = studentChanges[student] == NO_ROUTE ? null : studentChanges[student]
      props.patchStudent({
        routes: routeVal
      }, student);
    });
    resetStudentChanges();
  }

  const resetStudentChanges = () => {
    setStudentChanges({})
  }


  return (

    <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        
        <Container className="container-main d-flex flex-row" style={{gap: "10px"}}>

            <Container className='d-flex flex-column' style={{width: "2000px"}}>

                <IconLegend legendType='routePlanner'></IconLegend>
                <RoutePlannerMap 
                    students={props.students} 
                    school={props.school} 
                    currentRoute={props.currentRouteID} 
                    changeStudentRoute={changeStudentRoute}
                    studentChanges={studentChanges}
                    allRoutes={props.routes}
                />

                <br></br>

                <Container className="d-flex flex-row justify-content-center" style={{gap: "20px"}}>
                    <Button variant='yellowsubmit' onClick={saveRoutePlannerMapChanges}>Save Map Changes</Button>
                    <Button variant='yellowsubmit' onClick={resetStudentChanges}>Reset Map Changes</Button>
                </Container>

            </Container>
            
            <ModifyRouteInfo title={"Edit Route"} routeName={props.currentRoute.name} routeDescription={props.currentRoute.description} onSubmitFunc={(e) => props.onInfoSubmit(e, false)}/>
        </Container>
    </Container>

    );
}

RoutePlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    updateRoute: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired,
    createRoute: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    resetViewedRoute: PropTypes.func.isRequired,
    patchStudent: PropTypes.func.isRequired,
    resetPosted: PropTypes.func.isRequired,
    createMessageDispatch: PropTypes.func.isRequired,
    currentRoute: PropTypes.object,
    currentRouteID: PropTypes.number,
    school: PropTypes.object,
    routes: PropTypes.array,
    onInfoSubmit: PropTypes.func,
    clickedAway: PropTypes.bool,
    
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  studentsInSchool: state.students.students.results,
  postedRoute: state.routeplanner.postedRoute,
});

export default connect(mapStateToProps, {createMessageDispatch, resetPosted, patchStudent, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(RoutePlanner)

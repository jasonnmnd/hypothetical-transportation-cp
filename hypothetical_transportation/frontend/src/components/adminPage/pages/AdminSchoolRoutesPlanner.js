import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { Container, Card, Button, Form } from 'react-bootstrap';
import '../NEWadminPage.css';
import MapComponent from '../../maps/MapComponent';
import ModifyRouteInfo from '../components/forms/ModifyRouteInfo';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import RoutePlannerMap from './RoutePlannerMap';
import { NO_ROUTE } from '../../../utils/utils';


function AdminSchoolRoutesPlanner(props) {
  const param = useParams();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const [studentChanges, setStudentChanges] = useState({})


  //const [currentRoute, setCurrentRoute] = useState(null)
  
  const isCreate = () => {
    return searchParams.get(`route`) == 'new';
  }

  useEffect(() => {
    props.getRoutes({school: param.school_id});
    if(searchParams.get(`route`) != null && !isCreate()){
      props.getRouteInfo(searchParams.get('route'))
    } else {
      props.resetViewedRoute()
    }
  }, [param, searchParams]);

  useEffect(() => {
    props.getSchool(param.school_id);
    props.getStudents({school: param.school_id})
    if(searchParams.get(`route`) == null){
      setSearchParams({
        [`route`]: 'new',
      })
    }
  }, []);

  
  
  const onInfoSubmit = (e) => {
    const routeInfo = {
        name: e.routeName,
        description: e.routeDescription,
        school: param.school_id
    }
    if(isCreate()){
      props.createRoute(routeInfo)
    } else {
      props.updateRoute(routeInfo, searchParams.get('route'))
    }

  }

  const getInfoTitle = () => {
    if(isCreate()){
      return 'New Route'
    } else {
      return 'Modify Route'
    }
  }

  const getRouteOptions = () => {
    return props.routes.map(route => {
      return <option key={route.id} value={route.id}>{route.name}</option>
    })
  }

  const onDropdownChange = (e) => {
    setSearchParams({
      [`route`]: e.target.value,
    })
  }

  const getRouteFromSearchParams = () => {
    if(searchParams.get('route') == null){
      return "new"
    }
    return searchParams.get('route');
  }

  const changeStudentRoute = (pinStuff, position) => {
    console.log(pinStuff);
    setStudentChanges({
      ...studentChanges,
      [pinStuff.id]: searchParams.get('route')
    })
  }

  const submit = () => {
    
    Object.keys(studentChanges).forEach(student => {
      const routeVal = studentChanges[student] == NO_ROUTE ? null : studentChanges[student]
      props.patchStudent({
        routes: routeVal
      }, student);
    });
    navigate(`/admin/routes/`);
  }

  const resetStudentChanges = () => {
    setStudentChanges({})
  }





  return (
    
    <>
      <Header textToDisplay={"Route Planner"} shouldShowOptions={true}></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        <h1>{`${props.school.name} Route Planner`}</h1>
        <Form.Select size="sm" value={getRouteFromSearchParams()} onChange={onDropdownChange}>
                <option value={"new"} key={"new"}>{"Create New Route"}</option>
                {getRouteOptions()}
                <option value={NO_ROUTE} key={NO_ROUTE}>{"Remove Students from all Routes"}</option>
        </Form.Select>
        <Container className="container-main d-flex flex-row" style={{gap: "10px"}}>
            {isCreate() || searchParams.get('route') == null ? null : <RoutePlannerMap 
                                                                          students={props.students} 
                                                                          school={props.school} 
                                                                          currentRoute={getRouteFromSearchParams()} 
                                                                          changeStudentRoute={changeStudentRoute}
                                                                          studentChanges={studentChanges}
                                                                          allRoutes={props.routes}
                                                                      />}
          {searchParams.get(`route`) == NO_ROUTE || searchParams.get('route') == null ? null : <ModifyRouteInfo title={getInfoTitle()} routeName={props.currentRoute.name} routeDescription={props.currentRoute.description} onSubmitFunc={onInfoSubmit}/>}
        </Container>
        <Button variant='yellow' onClick={submit}><h3>Save</h3></Button>
        <Button variant='yellow' onClick={resetStudentChanges}><h3>Reset</h3></Button>
      </Container>
    </>

    );
}

AdminSchoolRoutesPlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    updateRoute: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired,
    createRoute: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    resetViewedRoute: PropTypes.func.isRequired,
    patchStudent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  routes: state.routes.routes.results, 
  currentRoute: state.routes.viewedRoute,
  school: state.schools.viewedSchool,
  studentsInSchool: state.students.students.results,
});

export default connect(mapStateToProps, {patchStudent, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(AdminSchoolRoutesPlanner)

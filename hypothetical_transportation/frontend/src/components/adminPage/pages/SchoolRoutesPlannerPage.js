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
import PageNavigateModal from '../components/modals/PageNavigateModal';
import IconLegend from '../../common/IconLegend';
import { getCurRouteFromStudent } from '../../../utils/planner_maps';
import { createMessageDispatch } from '../../../actions/messages';
import SaveChangesModal from '../components/modals/SaveChangesModal';
import RouteStopsPlanner from './RouteStopsPlanner';
import RoutePlannerInstructions from '../components/route_stop_planner/RoutePlannerInstructions';
import CreateRouteModal from '../components/route_stop_planner/CreateRouteModal';
import RoutePlanner from './RoutePlanner';
import { getStopByRoute, deleteStop, createStop, updateStop } from '../../../actions/stops';

const IS_CREATE_PARAM = 'create';
const VIEW_PARAM = 'view';
const ROUTE_PARAM = 'route';

const ROUTE_PLANNER_VIEWS = [
  {name: "Add/Remove Students", value: 0},
  {name: "Stop Planner", value: 1},
]

function SchoolRoutesPlannerPage(props) {
  const param = useParams();
  const navigate = useNavigate();
  const [showSaveChangesModal, setShowSaveChangesModal] = useState(false);
  const [saveChangesModalProps, setSaveChangesModalProps] = useState(null);
  let [searchParams, setSearchParams] = useSearchParams();
  const [stops, setStopsWithProperInds] = useState(props.stops);
  const [deletedStops, setDeletedStops] = useState([]);





  useEffect(() => {
    props.getRoutes({school: param.school_id});
  }, [param, searchParams]);

  useEffect(() => {
    props.getSchool(param.school_id);
    if(searchParams.get(VIEW_PARAM) == null){
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        [VIEW_PARAM]: 0,
      })
    }
  }, []);

  useEffect(() => {
    let paramsToAdd = {
      [ROUTE_PARAM]: searchParams.get(ROUTE_PARAM),
      [VIEW_PARAM]: searchParams.get(VIEW_PARAM)
    };
    if(paramsToAdd[ROUTE_PARAM] == null || paramsToAdd[VIEW_PARAM] == null){
      if(paramsToAdd[ROUTE_PARAM] == null){
        if(props.routes.length > 0){
          paramsToAdd[ROUTE_PARAM] = props.routes[0]?.id;
        }
      }
      if(paramsToAdd[VIEW_PARAM] == null){
        paramsToAdd[VIEW_PARAM] = 0;
      }
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        [ROUTE_PARAM]: paramsToAdd[ROUTE_PARAM],
        [VIEW_PARAM]: paramsToAdd[VIEW_PARAM],
      })
    }
    
  }, [props.routes]);



  useEffect(()=>{
    if(props.postedRoute.id!==0){
      setSearchParams({
        ...Object.fromEntries([...searchParams]),
        [`route`]: props.postedRoute.id,
      })
      props.resetPosted();
    }
  },[props.postedRoute])

  const submitStopPlanner = () => {
    const stopsToUpdate = stops.filter(stop => stop.id > -1);
    let stopsToCreate = stops.filter(stop => stop.id < 0);
    const stopsToDelete = deletedStops.filter(stop => stop.id > -1);
    stopsToDelete.forEach(stop => {
      props.deleteStop(stop.id)
    })

    stopsToCreate.forEach(stop => {
      let {id, ...tempStop} = stop;
      props.createStop(tempStop)
    })

    stopsToUpdate.forEach(stop => {
      props.updateStop(stop, stop.id)
    })
    props.createMessageDispatch({ student: "Route Stops Updated"})
    setDeletedStops([])
  }

  
  
  const onInfoSubmit = (e, isCreateRoute) => {
    const routeInfo = {
        name: e.routeName,
        description: e.routeDescription,
        school: param.school_id
    }
    if(isCreateRoute){
      props.createRoute(routeInfo)
    } else {
      props.updateRoute(routeInfo, searchParams.get('route'))
    }

  }


  const getRouteOptions = () => {
    return props.routes.map(route => {
      return <option key={route.id} value={route.id}>{route.name}</option>
    })
  }
  
  
  const changePlanningRoute = (newRouteId) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      [ROUTE_PARAM]: newRouteId,
    })
  }
  
  const onDropdownChange = (e) => {
    changePlanningRoute(e.target.value);
  }


  

  const handleRouteSelection = (e) => {
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      [VIEW_PARAM]: e.target.value
    });
  }

  const navToRoutes = ()=>{
    navigate(`/admin/routes/`);
  }

  const navToStopper = ()=>{
    navigate(`/admin/stop/plan/${param.school_id}/${props.currentRoute.id}`);
  }

  const setCreateSearchParam = (val) => {
    setSearchParams({...Object.fromEntries([...searchParams]), [IS_CREATE_PARAM]: val});
  }

  if(props.routes.length == 0 || props.routes.find(route => route.id == parseInt(searchParams.get(ROUTE_PARAM))) == null){
    return (
      <>
        <Header shouldShowOptions={true}></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>{`${props.school.name} List of Routes`}</h1>
          </div>

          <h2>This school has no routes. Please create a route to continue.</h2>

          <br></br>
          <Container className='d-flex flex-row justify-content-center'>
            <CreateRouteModal setCreateSearchParam={setCreateSearchParam} show={searchParams.get(IS_CREATE_PARAM) == "true"} onInfoSubmit={onInfoSubmit} />
          </Container>
        
        </Container>
      </>
    )
  }


  return (
    
    <>      
      {/* <SaveChangesModal 
        show={showSaveChangesModal} 
        onCancel={() => {setShowSaveChangesModal(false);setSaveChangesModalProps(null)}}
        {...saveChangesModalProps}
      /> */}
      <Header shouldShowOptions={true}></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
          <h1>{`${props.school.name} List of Routes`}</h1>
        </div>

        <RoutePlannerInstructions/>

        <br></br>
        <Container className='d-flex flex-row justify-content-center'>
          <CreateRouteModal setCreateSearchParam={setCreateSearchParam} show={searchParams.get(IS_CREATE_PARAM) == "true"} onInfoSubmit={onInfoSubmit} />
        </Container>

        <ButtonGroup>
        {ROUTE_PLANNER_VIEWS.map((radio, idx) => (
            <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={'outline-warning'}
                name="radio"
                value={radio.value}
                checked={searchParams.get(VIEW_PARAM) == radio.value}
                onChange={(e)=>{
                    handleRouteSelection(e);
                }}
            >
                {radio.name}
            </ToggleButton>
        ))}
        </ButtonGroup>

        <Card>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label as="h5">Select an Existing Route to Edit</Form.Label>
              <Form.Select size="sm" value={searchParams.get(ROUTE_PARAM)} onChange={onDropdownChange} style={{width: "800px"}}>
                      {getRouteOptions()}
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>

        {searchParams.get(VIEW_PARAM) == 0 ? <RoutePlanner 
                                                currentRoute={props.currentRoute} 
                                                currentRouteID={searchParams.get(ROUTE_PARAM)} 
                                                school={props.school} 
                                                routes={props.routes}
                                                onInfoSubmit={onInfoSubmit}
                                              /> 
                                              : null
                                              }


        {searchParams.get(VIEW_PARAM) == 1 ? <RouteStopsPlanner
                                                route_id={searchParams.get(ROUTE_PARAM)}
                                                currentRoute={props.currentRoute} 
                                                school={props.school} 
                                                routes={props.routes}
                                                initStops={props.stops}
                                                stops={stops}
                                                setStopsWithProperInds={setStopsWithProperInds}
                                                deletedStops={deletedStops}
                                                setDeletedStops={setDeletedStops}
                                                submit={submitStopPlanner}
                                              /> 
                                              : null
                                              }

        
      </Container>

      <br></br>
    </>

    );
}

SchoolRoutesPlannerPage.propTypes = {
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
    createStop: PropTypes.func.isRequired,
    updateStop: PropTypes.func.isRequired,
    deleteStop: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  routes: state.routes.routes.results, 
  currentRoute: state.routes.viewedRoute,
  school: state.schools.viewedSchool,
  studentsInSchool: state.students.students.results,
  postedRoute: state.routeplanner.postedRoute,
  stops: state.stop.stops.results,
});

export default connect(mapStateToProps, {deleteStop, createStop, updateStop, createMessageDispatch, resetPosted, patchStudent, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(SchoolRoutesPlannerPage)

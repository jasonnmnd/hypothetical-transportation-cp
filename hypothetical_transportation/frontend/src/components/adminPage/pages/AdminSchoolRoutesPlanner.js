import React, { useEffect, useState } from 'react';
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
import { Container, ButtonGroup, ToggleButton, Card, Button, Form, Collapse } from 'react-bootstrap';
import PageNavigateModal from '../components/modals/PageNavigateModal';


function AdminSchoolRoutesPlanner(props) {
  const param = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();

  const [studentChanges, setStudentChanges] = useState({})


  //const [currentRoute, setCurrentRoute] = useState(null)
  
  const isCreate = () => {
    return searchParams.get(`route`) == 'new';
  }

  const isDelete = () => {
    return searchParams.get(`route`) == 'none';
  }

  useEffect(() => {
    props.getRoutes({school: param.school_id});
    if(searchParams.get(`route`) != null && !isCreate()){
      props.getRouteInfo(searchParams.get('route'))
      if (isCreate()) {
        setRouteSelection(2); //This is to make sure the button sets to edit/delete
      } else if (isDelete()) {
        setRouteSelection(3);
      }
      
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

  useEffect(()=>{
    if(props.postedRoute.id!==0){
      setSearchParams({
        [`route`]: props.postedRoute.id,
      })
      props.resetPosted();
    }
  },[props.postedRoute])

  
  
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
    setOpenModal(true);
  }

  const resetStudentChanges = () => {
    setStudentChanges({})
  }

  const routePlannerTypes = [
    {name: "Create New Route", value: 1},
    {name: "Edit Existing Route", value: 2},
    {name: "Remove Students from Routes", value: 3},
  ]

  const [routeSelect, setRouteSelection] = useState(1);

  const handleRouteSelection = (e) => {
    setRouteSelection(e.target.value);
    if (e.target.value == 1) {
      setSearchParams({
        [`route`]: "new"
      })
    } 
    else if (e.target.value == 2) {
      setSearchParams({
        [`route`]: "edit"
      })
    }
    else if (e.target.value == 3) {
      setSearchParams({
        [`route`]: "none"
      })
    }
      
  }

  const navToRoutes = ()=>{
    navigate(`/admin/routes/`);
  }

  const navToStopper = ()=>{
    navigate(`/admin/stop/plan/${param.school_id}/${props.currentRoute.id}`);
  }

  const [openInstruc, setOpenInstruc] = useState(false);

  return (
    
    <>      
      <div>{openModal && <PageNavigateModal closeModal={setOpenModal} yesFunc={navToStopper} noFunc={navToRoutes} message={`You have saved your changes for the routes!`} question={`Would you like to navigate to the stop planner for the route you were viewing?`}/>}</div>
      <Header shouldShowOptions={true}></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
          <h1>{`${props.school.name} List of Routes`}</h1>
        </div>

        <div className='d-flex flex-row justify-content-center'>
          <Button
          onClick={() => setOpenInstruc(!openInstruc)}
          aria-controls="example-collapse-text"
          aria-expanded={openInstruc}
          variant="instrucToggle"
          >
            Route Planner Instructions {openInstruc ? "▲" : "▼"}
          </Button>
        </div>
        
        <Collapse in={openInstruc}>
          <Card>
            <Card.Body>
              <div id="example-collapse-text">
                Instructions on how to use route planner will be here
              </div>
            </Card.Body>
          </Card>
        </Collapse>

        <ButtonGroup>
        {routePlannerTypes.map((radio, idx) => (
            <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={'outline-success'}
                name="radio"
                value={radio.value}
                checked={routeSelect == radio.value}
                onChange={(e)=>{
                    handleRouteSelection(e);
                }}
            >
                {radio.name}
            </ToggleButton>
        ))}
        </ButtonGroup>

        {routeSelect == 2 ?
        <Card>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label as="h5">Select an Existing Route to Edit</Form.Label>
              <Form.Select size="sm" value={getRouteFromSearchParams()} onChange={onDropdownChange} style={{width: "800px"}}>
                      {getRouteOptions()}
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>
        :
        <></>
        }

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

        <Container className="d-flex flex-row justify-content-center" style={{gap: "20px"}}>
          <Button variant='yellowsubmit' onClick={submit}>Save Changes</Button>
          <Button variant='yellowsubmit' onClick={resetStudentChanges}>Reset Changes</Button>
        </Container>
        
      
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
    patchStudent: PropTypes.func.isRequired,
    resetPosted: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  routes: state.routes.routes.results, 
  currentRoute: state.routes.viewedRoute,
  school: state.schools.viewedSchool,
  studentsInSchool: state.students.students.results,
  postedRoute: state.routeplanner.postedRoute,
});

export default connect(mapStateToProps, {resetPosted, patchStudent, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(AdminSchoolRoutesPlanner)

import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MapContainer from '../../maps/MapContainer';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { getRouteInfo } from '../../../actions/routes';
import {getStudentsInRoute, getStudentsWithoutRoute,addStudentToRoute, removeStudentFromRoute, addRoute, updateRoute} from '../../../actions/routeplanner';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import { getSchool } from '../../../actions/schools';
import { filterObjectForKeySubstring } from '../../../utils/utils';
import { Container, Card, Button, Form } from 'react-bootstrap';
import '../NEWadminPage.css';

function GeneralAdminRoutePlanner(props) {
  const STUDENTS_IN_ROUTE_PREFIX = "STINROUPREF";
  const STUDENTS_WO_ROUTE_PREFIX = "STWORTPREF";

  const param = useParams();
  const navigate = useNavigate();
  const emptySchool = {
    id: 0,
    name: "",
    address: "",
  }
  const emptyStudent = {
    student_id: "",
    full_name:"",
    address: "",
  }

  const emptyRoute = {
    id: 0,
    name: "",
    description: "",
    school: param.school_id,
  }

  const studentObject = [{
    id: 0,
    student_id: "",
    full_name:"",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const [obj, setObj] = useState(emptyRoute)
  const [tobeadded, setAdd] = useState([])
  const [toberemoved, setRemove] = useState([])

  let [searchParams, setSearchParams] = useSearchParams();



  
  useEffect(() => {
    if(searchParams.get(`${STUDENTS_IN_ROUTE_PREFIX}pageNum`) != null && searchParams.get(`${STUDENTS_WO_ROUTE_PREFIX}pageNum`) != null){
      const allSearchParams = Object.fromEntries([...searchParams]);

      let inRouteSearchParams = filterObjectForKeySubstring(allSearchParams, STUDENTS_IN_ROUTE_PREFIX);
      inRouteSearchParams.routes = param.route_id;
      let woRouteSearchParams = filterObjectForKeySubstring(allSearchParams, STUDENTS_WO_ROUTE_PREFIX);
      woRouteSearchParams.school = param.school_id;
      //woRouteSearchParams.routes__isnull = true;
      
      if(props.action==="edit"){
        props.getStudentsInRoute(inRouteSearchParams)
      }
      props.getStudentsWithoutRoute(woRouteSearchParams)
    }
    else{
      setSearchParams({
        [`${STUDENTS_WO_ROUTE_PREFIX}pageNum`]: 1,
        [`${STUDENTS_IN_ROUTE_PREFIX}pageNum`]: 1
      })
    }
    

  }, [searchParams]);

  useEffect(() => {
    if(props.action==="edit"){
      props.getRouteInfo(param.route_id);
      setObj({...props.route, ["school"]:props.route.school.id,})
    }
    props.getSchool(param.school_id)
  }, []);

    
  const addToRoute =  (i)=>{
    const list = tobeadded.concat(i)
    setAdd(list)
  }

  const removeFromADD =  (i)=>{
    setAdd(tobeadded.filter(item=>item.id!==i.id))
  }


  const removeFromREMOVE =  (i)=>{
    setRemove(toberemoved.filter(item=>item.id!==i.id))
  }

  const removeFromRoute =  (i)=>{
    const list = toberemoved.concat(i)
    setRemove(list)
  }

  const submit = (e)=>{
    e.preventDefault();
    if(props.action==="new"){
        props.addRoute(obj,tobeadded);
    }
    else{
        props.updateRoute(obj, obj.id);
        if(tobeadded.length>0){
            tobeadded.map((stu)=>{
                props.addStudentToRoute(stu,obj.id)
            })
        }
        if(toberemoved.length>0){
            toberemoved.map((stu)=>{
                props.removeStudentFromRoute(stu)
            })
        }
    }
    navigate(`/admin/routes`);
    
}

const getRouteMatches = (i) => {
  if(i.routes != null && i.routes != undefined){
    return i.routes.id != props.route.id
  }
  return true;
  
}


  return (
    
    <>
        <Header textToDisplay={"Route Planner"} shouldShowOptions={true}></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Card>
            <Card.Header as="h5">School</Card.Header>
            <Card.Body>
              <Link to={`/admin/school/${param.school_id}`}>
                  <Button variant='yellow'><h3>{props.school.name}</h3></Button>
              </Link>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Map View of School and Students</Card.Header>
            <Card.Body>
              {props.action==="new"?
                <MapContainer studentData={props.studentsWithoutRoute} schoolData={props.school}/>:
                <MapContainer studentData={props.studentsWithoutRoute.filter(i => getRouteMatches(i))} schoolData={props.route.school} routeStudentData={props.studentsInRoute}/>
              }
            </Card.Body>
        </Card>
       

        {
        props.action==="edit" ?
          <>
            <Card>
              <Card.Header as="h5">Students Currently in {props.route.name} (Green Pin)</Card.Header>
              <Card.Body>
                <GeneralAdminTableView values={props.studentsInRoute.filter(i=>!toberemoved.includes(i))} tableType={"student"} title={`Students currently in ${props.route.name} (Green pin)`} actionName={"Remove from Route"} action={removeFromRoute} search={STUDENTS_IN_ROUTE_PREFIX} pagination={STUDENTS_IN_ROUTE_PREFIX} />
              </Card.Body>
            </Card>
          </>
          : 
          <div></div>  
        } 

        <Card>
            <Card.Header as="h5">Students at {props.route.school.name} not in {props.route.name} (Red Pin)</Card.Header>
            <Card.Body>
              <GeneralAdminTableView values={props.studentsWithoutRoute.filter(i=>!tobeadded.includes(i) && getRouteMatches(i))} tableType={"student"} title={`Students at ${props.route.school.name} with no route`} actionName={"Add to Route"} action={addToRoute} search={STUDENTS_WO_ROUTE_PREFIX} pagination={STUDENTS_WO_ROUTE_PREFIX}/>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Students to be Added to {props.route.name}</Card.Header>
            <Card.Body>
              <GeneralAdminTableView values={tobeadded} tableType={"student"} title={`Students To Be Added into Route`} actionName={"Remove from Selected"} action={removeFromADD} search={null} pagination={null}/>
            </Card.Body>
        </Card>
        
        {
        props.action==="edit" ?
          <>
            <Card>
              <Card.Header as="h5">Students to be Removed from {props.route.name}</Card.Header>
              <Card.Body>
                <GeneralAdminTableView values={toberemoved} tableType={"student"} title={`Students To Be Remove from Route`} actionName={"Remove from Selected"} action={removeFromREMOVE} search={null} pagination={null}/>
              </Card.Body>
          </Card>
          </>
          :
          <div></div>
        }

        <Card>
          <Card.Header as="h5">{props.action==="new" ? "New Route" : "Edit Route"}</Card.Header>
          <Card.Body>
            <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                  <Form.Group className="mb-3" controlId="validationCustom01">
                      <Form.Label as="h5">Name of Route</Form.Label>
                      <Form.Control 
                      required type="text"
                      placeholder="Enter Route Name..." 
                      value={obj.name}
                      onChange={(e)=>{
                          setObj({...obj, ["name"]: e.target.value})
                      }}
                      />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGridDescription">
                      <Form.Label as="h5">Route Description</Form.Label>
                      <Form.Control 
                      as="textarea"
                      required type="text"
                      style={{ height: '100px' }}
                      placeholder="Enter Route Description..." 
                      value={obj.description}
                      onChange={(e)=>{setObj({...obj, ["description"]: e.target.value})}}                    />
                  </Form.Group>

                  <Button variant="yellowsubmit" type="submit" onClick={submit}>
                      Save
                  </Button>
              </Form>
            </Card.Body>
            
        </Card>
      </Container>
    </>

    );
}

GeneralAdminRoutePlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getStudentsInRoute: PropTypes.func.isRequired,
    getStudentsWithoutRoute: PropTypes.func.isRequired,
    action: PropTypes.string
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  route: state.routes.viewedRoute, 
  school: state.schools.viewedSchool,
  studentsInRoute:state.routeplanner.studentsInRoute.results,
  studentsWithoutRoute:state.routeplanner.studentsWithoutRoute.results,
  postedRoute:state.routeplanner.postedRoute,
});

export default connect(mapStateToProps, {getRouteInfo,getStudentsInRoute,getStudentsWithoutRoute, getSchool, addStudentToRoute, removeStudentFromRoute, addRoute, updateRoute})(GeneralAdminRoutePlanner)

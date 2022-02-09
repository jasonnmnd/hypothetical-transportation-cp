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
import MapComponent from '../../maps/MapComponent';

function AdminSchoolRoutesPlanner(props) {
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
        <MapComponent/>
      </Container>
    </>

    );
}

AdminSchoolRoutesPlanner.propTypes = {
    getStudentsInRoute: PropTypes.func.isRequired,
    getStudentsWithoutRoute: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  routes: state.routes.routes.results, 
  school: state.schools.viewedSchool,
  studentsInSchool: state.students.students.results,
});

export default connect(mapStateToProps, {getRouteInfo,getStudentsInRoute,getStudentsWithoutRoute, getSchool, addStudentToRoute, removeStudentFromRoute, addRoute, updateRoute})(AdminSchoolRoutesPlanner)

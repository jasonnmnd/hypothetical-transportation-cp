import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MapContainer from '../../maps/MapContainer';
import AdminTable from '../components/table/AdminTable';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import config from '../../../utils/config';
import { getRouteInfo } from '../../../actions/routes';
import {getStudentsInRoute, getStudentsWithoutRoute,addStudentToRoute, removeStudentFromRoute, addRoute, updateRoute} from '../../../actions/routeplanner';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import { getSchool } from '../../../actions/schools';
import { filterObjectForKeySubstring } from '../../../utils/utils';

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
      woRouteSearchParams.routes__isnull = true;
      
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
    console.log("add to route")
  }

  const removeFromADD =  (i)=>{
    setAdd(tobeadded.filter(item=>item.id!==i.id))
    console.log("remove from selected to be added")
  }


  const removeFromREMOVE =  (i)=>{
    setRemove(toberemoved.filter(item=>item.id!==i.id))
    console.log("remove from selected to be removed")
  }

  const removeFromRoute =  (i)=>{
    const list = toberemoved.concat(i)
    setRemove(list)
    console.log("remove from this route")
  }

  const submit = (e)=>{
    e.preventDefault();
    if(props.action==="new"){
        console.log("mew")
        props.addRoute(obj,tobeadded);
    }
    else{
        console.log("edit")
        props.updateRoute(obj, obj.id);
        if(tobeadded.length>0){
            console.log("adding")
            tobeadded.map((stu)=>{
                props.addStudentToRoute(stu,obj.id)
            })
        }
        if(toberemoved.length>0){
            console.log("removing")
            toberemoved.map((stu)=>{
                props.removeStudentFromRoute(stu)
            })
        }
    }
    navigate(`/admin/routes`);
    
}




  return (
    
    <>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <div className='middle-justify'>
          <div className='admin-details'>
           <h1>Route Planner</h1>

            <div className='info-fields'>
              <h2>School (Blue Pin): </h2>
                <Link to={`/admin/school/${param.school_id}`}><button className='button'><h3>{props.school.name}</h3></button></Link>
            </div>

            <h2>Map of School and Students</h2>
            {props.action==="new"?
              <MapContainer studentData={props.studentsWithoutRoute} schoolData={props.school}/>:
              <MapContainer studentData={props.studentsWithoutRoute} schoolData={props.route.school} routeStudentData={props.studentsInRoute}/>
            }

            {props.action==="edit"?
              <div>
                <h2>Students currently in {props.route.name} (Green pin)</h2>
                <GeneralAdminTableView values={props.studentsInRoute.filter(i=>!toberemoved.includes(i))} tableType={"student"} title={`Students currently in ${props.route.name} (Green pin)`} actionName={"Remove from Route"} action={removeFromRoute} search={STUDENTS_IN_ROUTE_PREFIX} pagination={STUDENTS_IN_ROUTE_PREFIX} />
                <h2>Students To Be Remove from Route</h2>
                <GeneralAdminTableView values={toberemoved} tableType={"student"} title={`Students To Be Remove from Route`} actionName={"Remove from Selected"} action={removeFromREMOVE} search={null} pagination={null}/>
              </div>:
              <div></div>
            }

            <div>
                <h2>Students To Be Added into Route</h2>
                <GeneralAdminTableView values={tobeadded} tableType={"student"} title={`Students To Be Added into Route`} actionName={"Remove from Selected"} action={removeFromADD} search={null} pagination={null}/>
                
                <h2>Students at {props.route.school.name} with no route</h2>
                <GeneralAdminTableView values={props.studentsWithoutRoute.filter(i=>!tobeadded.includes(i))} tableType={"student"} title={`Students at ${props.route.school.name} with no route`} actionName={"Add to Route"} action={addToRoute} search={STUDENTS_WO_ROUTE_PREFIX} pagination={STUDENTS_WO_ROUTE_PREFIX}/>
            </div>

            <form>
              <div className="form-inner">
                <h2>{props.action==="new" ? "New Route" : "Edit Route"}</h2>

                <div className="form-group">
                  <label htmlFor={"Full Name"}>Name</label>
                  <input
                      className="input"
                      type={"Full Name"}
                      name={"Full Name"}
                      id={"Full Name"}
                      value={obj.name}
                      onChange={(e)=>{
                          setObj({...obj, ["name"]: e.target.value})
                      }}
                  />
              </div>

                <div className="form-group">
                  <label htmlFor={"Description"}>Description</label>
                  <textarea
                      className="input"
                      type={"Description"}
                      name={"Description"}
                      id={"Description"}
                      value={obj.description}
                      onChange={(e)=>{setObj({...obj, ["description"]: e.target.value})}}
                  />
                </div>

                
                <div className="divider15px" />
                    
                <button className="button" onClick={submit}>Save</button>
                <div className="divider15px" />
              </div>
            </form>
          </div>
        </div>
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

import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapContainer from '../../maps/MapContainer';
import AdminTable from '../components/table/AdminTable';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import axios from 'axios';
import config from '../../../utils/config';

function AdminRoutePlanner(props) {
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
  const [school, setSchool] = useState(emptySchool);  
  const [students, setStudents] = useState(studentObject);
  const [route_student, setRouteStudents] = useState(studentObject);
  const [route, setRoute] = useState(emptyRoute);


  const getSchool = () => {
    axios.get(`/api/school/${param.school_id}/`, config(props.token))
        .then(res => {
            setSchool(res.data);
        }).catch(err => console.log(err));
    }

  const getStudent = () => {
    axios.get(`/api/student/?school=${param.school_id}`, config(props.token))
        .then(res => {
          console.log(res.data.results)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
  }

  const getRoute = ()=>{
    axios.get(`/api/route/${param.route_id}/`, config(props.token))
    .then(res => {
      setRoute(res.data);
      setObj(res.data);
    }).catch(err => console.log(err));
  }

  const getStudentRelatedToRoute = ()=>{
    axios.get(`/api/student/?routes=${param.route_id}`, config(props.token))
        .then(res => {
          console.log(res.data.results)
          setRouteStudents(res.data.results);
        }).catch(err => console.log(err));
  }
  
  useEffect(() => {
    getSchool();
    getStudent();
    if(props.action==="edit"){
      getRoute();
      getStudentRelatedToRoute();
    }
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
      axios
        .post(`/api/route/`,obj, config(props.token))
        .then(res =>{
          const routeID = res.data.id
          if(tobeadded.length>0){
            tobeadded.map((stu)=>{
              axios
                .get(`/api/student/${stu.id}/`, config(props.token))
                .then(res => {
                  res.data.routes=routeID
                  axios
                    .put(`/api/student/${stu.id}/`,res.data, config(props.token))
                    .then(res =>{
                        console.log(res.data.id)
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
          })}
          navigate(`/admin/routes`);
        }).catch(err => console.log(err));
    }
    else{
      axios
      .put(`/api/route/${route.id}/`,obj, config(props.token))
      .then(res =>{
        const routeID = res.data.id
        if(tobeadded.length>0){
          tobeadded.map((stu)=>{
            axios
              .get(`/api/student/${stu.id}/`, config(props.token))
              .then(res => {
                res.data.routes=routeID
                axios
                  .put(`/api/student/${stu.id}/`,res.data, config(props.token))
                  .then(res =>{
                      console.log(res.data.id)
                  }).catch(err => console.log(err));
              }).catch(err => console.log(err));
        })}
        if(toberemoved.length>0){
          toberemoved.map((stu)=>{
            axios
              .get(`/api/student/${stu.id}/`, config(props.token))
              .then(res => {
                res.data.routes=null
                axios
                  .put(`/api/student/${stu.id}/`,res.data, config(props.token))
                  .then(res =>{
                      console.log(res.data.id)
                  }).catch(err => console.log(err));
              }).catch(err => console.log(err));
        })}
        navigate(`/admin/routes`);
      }).catch(err => console.log(err));

    }
    
}




  return (
    
    <>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <SidebarSliding/>
        <div className='middle-justify'>
          <div className='admin-details'>
           <h1>Route Planner</h1>

            {/* <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{exampleRoute.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Description: </h2>
              <h3>{exampleRoute.description}</h3>
            </div> */}

            <div className='info-fields'>
              <h2>School (Blue Pin): </h2>
              {/* <Link to={`/admin/school/${exampleRoute.school.id}`}> */}
                <Link to={`/admin/school/${school.id}`}><button className='button'><h3>{school.name}</h3></button></Link>
              {/* </Link> */}
            </div>
            <h2>Map of School and Students</h2>
            {props.acion==="edit"?
              <MapContainer studentData={students.filter(stu=>stu.routes===null)} schoolData={school}/>:
              <MapContainer studentData={students.filter(stu=>stu.routes===null)} schoolData={school} routeStudentData={route_student}/>
              }
            {/* <h2> Students inside this Routes </h2>
            <AdminTable title={"Students"} header={Object.keys(emptyStudent)} data={students.filter(i=>i.route!=="")} actionName={"Remove From This Route"} action={removeFromRoute}/> */}

            {props.action==="edit"?
              <div>
                <AdminTable title={`Students currently in ${route.name} (Green pin)`} header={Object.keys(emptyStudent)} data={route_student.filter(i=>i.routes.id===route.id&&!toberemoved.includes(i))} actionName={"Remove from Route"} action={removeFromRoute}/>
                <AdminTable title={`Students To Be Remove from Route`} header={Object.keys(emptyStudent)} data={toberemoved} actionName={"Remove from Selected"} action={removeFromREMOVE}/>
              </div>:
              <div></div>
            }

            <AdminTable title={"Students To Be Added into Route"} header={Object.keys(emptyStudent)} data={tobeadded} actionName={"Remove from Selected"} action={removeFromADD}/>
            <AdminTable title={`Students at ${school.name} With No Routes (Red pin)`} header={Object.keys(emptyStudent)} data={students.filter(i=>i.routes===null&&!tobeadded.includes(i))} actionName={"Add to Route"} action={addToRoute}/>

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

AdminRoutePlanner.propTypes = {
    action: PropTypes.string
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminRoutePlanner)

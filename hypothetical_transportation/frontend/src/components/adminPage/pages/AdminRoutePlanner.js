import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MapContainer from '../../maps/MapContainer';
import AdminTable from '../components/table/AdminTable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

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
    name: "",
    description: "",
    school: param.id,
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
  const [school, setSchool] = useState(emptySchool);  
  const [students, setStudents] = useState(studentObject);

  const getSchool = () => {
    axios.get(`/api/school/${param.id}`)
        .then(res => {
            setSchool(res.data);
        }).catch(err => console.log(err));
    }

  const getStudent = () => {
    axios.get(`/api/student?school=${param.id}`)
        .then(res => {
          console.log(res.data.results)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
  }
  
    useEffect(() => {
      getSchool();
      getStudent();
    }, []);

    
  const addToRoute =  (i)=>{
    const list = tobeadded.concat(i)
    setAdd(list)
    console.log("add to route")
  }

  const removeFromRoute =  (i)=>{
    setAdd(tobeadded.filter(item=>item.id!==i.id))
    console.log("remove from this route")
  }

  const exampleRoute = {
    // id: param.id,
    name: "Route #1",
    school: {
      id:"1",
      name: "school",
    },
    description: "This is a route for a school. A Route can only be associated with 1 school",
    students:[
      {
        id: "123",
        name:"Al",
        studentid:"444",
        school: "A high school",
        route: "#1",
      },
      {
        id:"456",
        name:"Hugo",
        studentid:"234",
        school: "B high school",
        route: "",
      },
      {
        id:"567",
        name:"James",
        studentid:"555",
        school: "C high school",
        route: "",
      }
    ]
  }

  const submit = (e)=>{
    e.preventDefault();
    axios
      .post(`/api/route/`,obj)
      .then(res =>{
        const routeID = res.data.id
        if(tobeadded.length>0){
          tobeadded.map((stu)=>{
            axios
              .get(`/api/student/${stu.id}/`)
              .then(res => {
                res.data.routes=routeID
                axios
                  .put(`/api/student/${stu.id}/`,res.data)
                  .then(res =>{
                      console.log(res.data.id)
                  }).catch(err => console.log(err));
              }).catch(err => console.log(err));
        })}
        navigate(`/admin/school/${school.id}`);
      }).catch(err => console.log(err));
    
}




  return (
    
    <>
        <Header textToDisplay={"Admin Portal"}></Header>
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
              <h2>School: </h2>
              {/* <Link to={`/admin/school/${exampleRoute.school.id}`}> */}
                <Link to={`/admin/school/${school.id}`}><button className='button'><h3>{school.name}</h3></button></Link>
              {/* </Link> */}
            </div>
            <h2>Map of School and Students</h2>
            <MapContainer studentData={school} schoolData={students}/>

            {/* <h2> Students inside this Routes </h2>
            <AdminTable title={"Students"} header={Object.keys(emptyStudent)} data={students.filter(i=>i.route!=="")} actionName={"Remove From This Route"} action={removeFromRoute}/> */}

            <AdminTable title={"Students Selected"} header={Object.keys(emptyStudent)} data={tobeadded} actionName={"Remove from Route"} action={removeFromRoute}/>

            <AdminTable title={`Students at ${school.name} With No Routes`} header={Object.keys(emptyStudent)} data={students.filter(i=>i.routes===null&&!tobeadded.includes(i))} actionName={"Add to Route"} action={addToRoute}/>

            <form>
              <div className="form-inner">
                <h2>{"New Route"}</h2>

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
                  <input
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
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AdminRoutePlanner)

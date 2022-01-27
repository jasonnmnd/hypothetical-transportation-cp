import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';


function NewStudentPage() {
    const navigate = useNavigate();
    const emptyStudent={
      id: 0,
      student_id: "",
      first_name: "",
      last_name: "",
      address: "",
      guardian: "",
      routes: "",
      school: "",
    }
    const emptySchoolList = [{
      id: 0,
      name: "",
      address: "",
    }]

    const emptyRoutes = [{
      id: 0,
      name: "",
      description: "",
    }]


    const emptyUsers = [{
      id: 0,
      full_name: "",
      email: "",
      address: "",
    }]
  
  


    const [obj, setObj] = useState(emptyStudent)
    const [schoollist, setSchoolList] = useState(emptySchoolList)
    const [routes, setRoutes] = useState(emptyRoutes)
    const [users, setUsers] = useState(emptyUsers);
    const [error, setError] = useState("");

    const getSchools = () => {
      axios.get('/api/school/')
        .then(res => {
          setSchoolList(res.data.results);
        }).catch(err => console.log(err));
    }
    const getUsers = () => {
      axios.get('/api/user/')
        .then(res => {
          console.log(res.data.results)
          setUsers(res.data.results);
        }).catch(err => console.log(err));
    }

  const getRoutes = (i) => {
    axios.get(`/api/route?school=${i}`)
        .then(res => {
          setRoutes(res.data.results);
        }).catch(err => console.log(err));
    }

    const submit = (e) => {
      console.log(obj)
      e.preventDefault()
      if(obj.guardian===""){
        setError("Guardian cannot be null")
      }
      else if(obj.school===""){
        setError("School cannot be null")
      }
      else{
        setError("")
        axios
            .post(`/api/student/`,obj)
            .then(res =>{
                navigate(`/admin/students/`)

            }).catch(err => console.log(err));
      }
  }

  const changeSchool = (e)=>{
    setObj({...obj, ["school"]:e.target.value, ["routes"]:""})
    getRoutes(e.target.value)
    console.log(obj)
    console.log(routes)
  }


    useEffect(() => {
      getSchools();
      getUsers();
    }, []);

    return ( 
      <>
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='admin-edit-page'>
        <form>
                <div className="form-inner">
                    <h2>{"New Student"}</h2>

                    <div className="form-group">
                      <label htmlFor={"First Name"}>First Name</label>
                      <input
                          className="input"
                          type={"First Name"}
                          name={"First Name"}
                          id={"First Name"}
                          value={obj.first_name}
                          onChange={(e)=>{
                              setObj({...obj, ["first_name"]: e.target.value})
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Last Name"}>Last Name</label>
                      <input
                          className="input"
                          type={"Last Name"}
                          name={"Last Name"}
                          id={"Last Name"}
                          value={obj.last_name}
                          onChange={(e)=>{
                              setObj({...obj, ["last_name"]: e.target.value})
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Student ID"}>Student ID</label>
                      <input
                          className="input"
                          type={"id"}
                          name={"Student ID"}
                          id={"Student ID"}
                          value={obj.student_id}
                          onChange={(e)=>{setObj({...obj, ["student_id"]: e.target.value})}}
                      />
                  </div>


                  <div className="form-group">
                      <label htmlFor={"Address"}>Address</label>
                      <input
                          className="input"
                          type={"Address"}
                          name={"Address"}
                          id={"Address"}
                          value={obj.address}
                          onChange={(e)=>{
                              setObj({...obj, ["address"]: e.target.value})
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label>
                        Parent:
                        <select value={obj.guardian} onChange={(e) => setObj({ ...obj, ["guardian"]: e.target.value })}>
                          <option value={""} >{"-----"}</option>
                          {users.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.email}</option>
                          })}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        School:
                        <select value={obj.school} onChange={changeSchool}>
                        <option value={""} >{"-----"}</option>
                        {schoollist.map((u,i)=>{
                            return <option value={u.id} key={i}>{u.name}</option>
                        })}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        Route:
                        <select value={obj.routes} onChange={(e) => setObj({ ...obj, ["routes"]: e.target.value })}>
                          <option value={""} >{"-----"}</option>
                          {routes.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.name}</option>
                          })}
                        </select>
                      </label>
                  </div>

                  
            {
                /* ERROR! */
                error !== "" ? <div className="error">{error}</div> : ""
              }
                    
                    <div className="divider15px" />
                    
                    <button onClick={submit}>Save</button>
                </div>
            </form>
            {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
      </>
        );
}

export default NewStudentPage;

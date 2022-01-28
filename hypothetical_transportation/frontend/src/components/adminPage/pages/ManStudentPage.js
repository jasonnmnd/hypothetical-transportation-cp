import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import AssistedLocationModal from '../components/modals/AssistedLocationModal';


function ManStudentPage({action}) {
    const param = useParams()
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const emptyStudent={
      id: 0,
      student_id: "",
      full_name: "",
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

    const getStudent = () => {
      axios.get(`/api/student/${param.id}/`)
        .then(res => {
          setObj(res.data);
        }).catch(err => console.log(err));
    }

    const getUsers = () => {
      axios.get('/api/user/')
        .then(res => {
          console.log(res.data.results.filter(s=>!s.is_staff))
          setUsers(res.data.results.filter(s=>!s.is_staff));
        }).catch(err => console.log(err));
    }

  const getRoutes = (i) => {
    axios.get(`/api/route?school=${i}`)
      .then(res => {
        setRoutes(res.data.results);
      }).catch(err => console.log(err));
  }

  const submit = () => {
    console.log(obj)
    setError("")
    if(action==="new"){
      axios
          .post(`/api/student/`,obj)
          .then(res =>{
              navigate(`/admin/students/`)

          }).catch(err => console.log(err));
    }
    else{
      axios
          .put(`/api/student/${param.id}/`,obj)
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
    if(action==="edit"){
      getStudent();
      getRoutes(obj.school);
    }
  }, []);

  const confirmation = (e)=>{
  e.preventDefault();
  if(obj.guardian===""){
    setError("Guardian cannot be null")
  }
  else if(obj.school===""){
    setError("School cannot be null")
  }
  else{
    setOpenModal(true)
  }
}

const handleConfirmAddress = () => {

   
      console.log("Address confirmed")
      submit()
}


    return ( 
      <>
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='confirm_location'>{openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={obj.address}></AssistedLocationModal>}</div>
        <div className='admin-edit-page'>
        <form>
                <div className="form-inner">
                    <h2>{"New Student"}</h2>

                    <div className="form-group">
                      <label htmlFor={"Full Name"}>Name</label>
                      <input
                          className="input"
                          type={"Full Name"}
                          name={"Full Name"}
                          id={"Full Name"}
                          value={obj.full_name}
                          onChange={(e)=>{
                              setObj({...obj, ["full_name"]: e.target.value})
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
                    
                    <button onClick={confirmation}>Save</button>
                </div>
            </form>
            {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
      </>
        );
}

export default ManStudentPage;

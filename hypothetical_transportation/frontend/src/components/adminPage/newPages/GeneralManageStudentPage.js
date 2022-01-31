import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AssistedLocationModal from '../components/modals/AssistedLocationModal';
import config from '../../../utils/config';

function GeneralManageStudentPage(props) {
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
    
    const emptyUsers = [{
      id: 0,
      full_name: "",
      email: "",
      address: "",
    }]
  


    const [obj, setObj] = useState(emptyStudent)
    const [schoollist, setSchoolList] = useState(emptySchoolList)
    const [routes, setRoutes] = useState(null)
    const [users, setUsers] = useState(emptyUsers);
    const [error, setError] = useState("");

    const getSchools = () => {
      axios.get('/api/school/', config(props.token))
        .then(res => {
          setSchoolList(res.data.results);
        }).catch(err => console.log(err));
    }

    const getStudent = () => {
      axios.get(`/api/student/${param.id}/`, config(props.token))
        .then(res => {
          setObj(res.data);
          getRoutes(res.data.school);
        }).catch(err => console.log(err));
    }

    const getUsers = () => {
      axios.get('/api/user/', config(props.token))
        .then(res => {
          setUsers(res.data.results);//.filter(s=>!s.groups.includes(1)));
        }).catch(err => console.log(err));
    }

  const getRoutes = (i) => {
    if(i!=="" && i!==null && i!==undefined && i!==0){
    axios.get(`/api/route/?school=${i}`, config(props.token))
      .then(res => {
        setRoutes(res.data.results);
      }).catch(err => console.log(err));
    }
    else{
      setRoutes(null)
    }
  }

  const setAddress = (e)=>{
    setObj({ ...obj, ["guardian"]: e.target.value});
    axios.get(`/api/user/${e.target.value}/`, config(props.token))
      .then(res => {
        setObj({ ...obj, ["guardian"]: e.target.value, ["address"]: res.data.address});
      }).catch(err => console.log(err));
  }


  const submit = () => {
    console.log(obj)
    setError("")
    if(props.action==="new"){
      axios
          .post(`/api/student/`,obj, config(props.token))
          .then(res =>{
              navigate(`/admin/students/`)
          }).catch(err => console.log(err));
    }
    else{
      axios
          .put(`/api/student/${param.id}/`,obj, config(props.token))
          .then(res =>{
              navigate(`/admin/students/`)
          }).catch(err => console.log(err));
    }
  }

  const changeSchool = (e)=>{
    setObj({...obj, ["school"]:e.target.value, ["routes"]:""})
    getRoutes(e.target.value)
    console.log(routes)
  }


  useEffect(() => {
    getSchools();
    getUsers();
    setRoutes(null)
    if(props.action==="edit"){
      getStudent();
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
      submit()
      // setOpenModal(true)
    }
}

const handleConfirmAddress = () => {
  console.log("Address confirmed")
  submit()
}


    return ( 
      <>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <SidebarSliding/>
        {/* <div className='confirm_location'>{openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={obj.address}></AssistedLocationModal>}</div> */}
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
                      <label>
                        Parent:
                        <select value={obj.guardian} onChange={setAddress}>
                          <option value={""} >{"-----"}</option>
                          {users!==null && users!==undefined && users.length!==0?users.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.email}</option>
                          }):null}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        School:
                        <select value={obj.school} onChange={changeSchool}>
                        <option value={""} >{"-----"}</option>
                        {schoollist!==null && schoollist!==undefined && schoollist.length!==0?schoollist.map((u,i)=>{
                            return <option value={u.id} key={i}>{u.name}</option>
                        }):null}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        Route:
                        <select value={obj.routes} onChange={(e) => setObj({ ...obj, ["routes"]: e.target.value })}>
                          <option value={""} >{"-----"}</option>
                          {routes!==null && routes!==undefined && routes.length!==0?routes.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.name}</option>
                          }):null}
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

GeneralManageStudentPage.propTypes = {
    action: PropTypes.string
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(GeneralManageStudentPage)

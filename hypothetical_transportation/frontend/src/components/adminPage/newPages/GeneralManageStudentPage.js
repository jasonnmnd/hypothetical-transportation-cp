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
import { getSchools } from '../../../actions/schools';
import { getUsers, getUser } from '../../../actions/users';
import { getStudent, addStudent, updateStudent } from '../../../actions/students';
import { getRoutesByID } from '../../../actions/routes';

function GeneralManageStudentPage(props) {
    const param = useParams()
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);

    const emptyStudent={
      student_id: "",
      full_name: "",
      guardian: "",
      routes: "",
      school: "null",
    }
  


    const [obj, setObj] = useState(emptyStudent)



  const setParent = (e)=>{
    props.getUser(e.target.value);
    setObj({ ...obj, ["guardian"]: e.target.value});
  }


  const submit = () => {
    if(props.action==="new"){
      console.log(obj)
      props.addStudent(obj)
      navigate(`/admin/students/`)
    }
    else{
      props.updateStudent(obj);
      navigate(`/admin/students/`)
    }
  }

  const changeSchool = (e)=>{
    setObj({...obj, ["school"]:e.target.value, ["routes"]:""})

    props.getRoutesByID({school: e.target.value});
  }

  const getTitle = () => {
    return props.action + " student"
  }


  useEffect(() => {
    props.getSchools();
    props.getUsers();
    if(props.action==="edit"){
      props.getStudent(param.id);
      setObj(props.student)
      props.getRoutesByID({school: props.student.school.id})
    }
    else{
      props.getRoutesByID({school: obj.school})
    }
    
  }, []);


    return ( 
      <>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <SidebarSliding/>
        <div className='admin-edit-page'>
        <form>
                <div className="form-inner">
                    <h2>{getTitle()}</h2>

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
                        <select value={obj.guardian.id} onChange={setParent}>
                          <option value={""} >{"-----"}</option>
                          {props.users!==null && props.users!==undefined && props.users.length!==0?props.users.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.email}</option>
                          }):null}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        School:
                        <select value={obj.school.id} onChange={changeSchool}>
                        <option value={"null"} >{"-----"}</option>
                        {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                            return <option value={u.id} key={i}>{u.name}</option>
                        }):null}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        Route:
                        <select value={obj.routes.id} onChange={(e) => setObj({ ...obj, ["routes"]: e.target.value })}>
                          <option value={"null"} >{"-----"}</option>
                          {props.routes!==null && props.routes!==undefined && props.routes.length!==0?props.routes.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.name}</option>
                          }):null}
                        </select>
                      </label>
                  </div>

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

GeneralManageStudentPage.propTypes = {
    action: PropTypes.string,
    getSchools: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    getStudent: PropTypes.func.isRequired,
    getRoutesByID: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    addStudent: PropTypes.func.isRequired,
    updateStudent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  schoollist: state.schools.schools.results,
  users: state.users.users.results,
  student: state.students.viewedStudent,
  routes: state.routes.routes.results,
  selectedUser: state.users.viewedUser
});

export default connect(mapStateToProps, {getSchools, getUsers, getStudent, getRoutesByID, getUser, addStudent, updateStudent})(GeneralManageStudentPage)

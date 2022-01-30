import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';

function AdminStudentDetails(props) {
  const navigate = useNavigate();
  const param = useParams();
  const studentObject = {
    id: 0,
    student_id: "",
    first_name: "",
    last_name: "",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }
  const [student, setStudent] = useState(studentObject);
  const [parentName,setParentName] = useState("");
  const [schoolName,setSchoolName] = useState("");
  const [routeName,setRouteName] = useState("");
  const [route,setRouteExist] = useState(false);

  const getInfo = () => {
    axios.get(`/api/student/${param.id}/`, config(props.token))
      .then(res => {
        setStudent(res.data);
        axios.get(`/api/user/${res.data.guardian}/`, config(props.token))
          .then(res => {
            setParentName(res.data.full_name);
        }).catch(err => console.log(err));
        axios.get(`/api/school/${res.data.school}/`, config(props.token))
          .then(res => {
            setSchoolName(res.data.name);
        }).catch(err => console.log(err));
        if (res.data.routes!==undefined && res.data.routes!==null){
          axios.get(`/api/route/${res.data.routes}/`, config(props.token))
            .then(res => {
              setRouteName(res.data.name);
              setRouteExist(true)
          }).catch(err => console.log(err));
        }
        else{
          setRouteName("NONE")
        }
    }).catch(err => console.log(err));
  }


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete student
    //Route back to students page
    axios.delete(`/api/student/${param.id}/`, config(props.token)).then(res => {
      console.log("DELETED STUDENT");
      navigate(`/admin/students/`)

    }).catch(err => console.log(err));
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <> 
      <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
      <SidebarSliding/>
      <div className='confirm_location'>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='middle-justify'>
          <div className='admin-details'>
                  <h1>Student Details</h1>
                  <div className='info-fields'>
                      <h2>Name: </h2>
                      <h3>{student.full_name}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>StudentID: </h2>
                      <h3>{student.student_id}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>Address: </h2>
                      <h3>{student.address}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>School: </h2>
                      <Link to={`/admin/school/${student.school}`}><button className='button'><h3>{schoolName}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Route: </h2>
                      {route?
                        <Link to={`/admin/route/${student.routes}`}><button className='button'><h3>{routeName}</h3></button></Link>:
                        <h3>No Route for this student</h3>
                      }
                  </div>
                  <div className='info-fields'>
                      <h2>Parent: </h2>
                      <Link to={`/admin/user/${student.guardian}`}><button className='button'><h3>{parentName}</h3></button></Link>
                  </div>

                  {/* Table for Students Here */}

                  <div className='edit-delete-buttons'>
                        <Link to={`/admin/edit_student/${student.id}`}><button>Edit Student</button></Link>
                        <button onClick={() => {
                          setOpenModal(true);
                        }}>Delete Student</button>
                  </div>
                    {/* <Link to="/admin/students">
                      <button className='button'>To Students</button>
                    </Link> */}
                    <button onClick={() => navigate(-1)} className='button'>Go Back</button>
              </div>
            </div>
    </>
  );
}

AdminStudentDetails.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminStudentDetails)

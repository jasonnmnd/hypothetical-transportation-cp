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
import { getStudentInfo, deleteStudent } from '../../../actions/students';

function GeneralAdminStudentDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const student = props.student



  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    props.deleteStudent(param.id);
    navigate(`/admin/students/`)
  }

  useEffect(() => {
    props.getStudentInfo(param.id);
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
                      <Link to={`/admin/school/${student.school}`}><button className='button'><h3>{student.schoolName}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Route: </h2>
                      {(student.routes!==undefined && student.routes!==null) ?
                        <Link to={`/admin/route/${student.routes}`}><button className='button'><h3>{student.routeName}</h3></button></Link>:
                        <h3>No Route for this student</h3>
                      }
                  </div>
                  <div className='info-fields'>
                      <h2>Parent: </h2>
                      <Link to={`/admin/user/${student.guardian}`}><button className='button'><h3>{student.guardianName}</h3></button></Link>
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

GeneralAdminStudentDetails.propTypes = {
    getStudentInfo: PropTypes.func.isRequired,
    deleteStudent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  student: state.students.viewedStudent
});

export default connect(mapStateToProps, {getStudentInfo, deleteStudent})(GeneralAdminStudentDetails)

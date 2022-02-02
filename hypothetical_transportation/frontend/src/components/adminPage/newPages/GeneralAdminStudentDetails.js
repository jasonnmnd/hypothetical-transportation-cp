import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
      <SidebarSliding/>
      <Header textToDisplay={"Student Details"} shouldShowOptions={true}></Header>
      <div className='confirm_location'>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='header-padding'>
        <div className='action-bar'>
          <Link to={`/admin/edit_student/${student.id}`}><button>Edit Student</button></Link>
                  <button onClick={() => {
                    setOpenModal(true);
                  }}>Delete Student</button>
              <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>

        <div className='left-content'>
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
                    <h3>{student.guardian.address}</h3>
                </div>
                <div className='info-fields'>
                    <h2>School: </h2>
                    <Link to={`/admin/school/${student.school.id}`}><button className='button'><h3>{student.school.name}</h3></button></Link>
                </div>
                <div className='info-fields'>
                    <h2>Route: </h2>
                    {(student.routes!==undefined && student.routes!==null) ?
                      <Link to={`/admin/route/${student.routes.id}`}><button className='button'><h3>{student.routes.name}</h3></button></Link>:
                      <h3>No Route for this student</h3>
                    }
                </div>
                <div className='info-fields'>
                    <h2>Parent: </h2>
                    <Link to={`/admin/user/${student.guardian.id}`}><button className='button'><h3>{student.guardian.full_name}</h3></button></Link>
                </div>
                <br></br>
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
  student: state.students.viewedStudent
});

export default connect(mapStateToProps, {getStudentInfo, deleteStudent})(GeneralAdminStudentDetails)

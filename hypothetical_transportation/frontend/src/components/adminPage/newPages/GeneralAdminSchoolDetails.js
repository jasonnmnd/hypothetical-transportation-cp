import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormDeleteModal from '../components/modals/FormDeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';
import { getSchool, deleteSchool } from '../../../actions/schools';
import { getStudentsByID } from '../../../actions/students';
import { getRoutesByID } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';


function GeneralAdminSchoolDetails(props) {
  const navigate = useNavigate();
  const param = useParams();
  


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = (schoolName) => {
    props.deleteSchool(param.id)
    navigate(`/admin/schools/`)
  }


  useEffect(() => {
    props.getSchool(param.id);
    props.getStudentsByID({
        school: param.id
    })
    props.getRoutesByID({
        school: param.id
    });
  }, []);



  return (
    <>  
        <SidebarSliding/>
        <Header textToDisplay={"School Details"} shouldShowOptions={true}></Header>
        <div className='confirm_location'>{openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='middle-content'>
          <div className='admin-details'>

            <h1>School Details</h1>

            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{props.school.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Address: </h2>
              <h3>{props.school.address}</h3>
            </div>

            <div className='info-fields'>
              {/* <h2>Associated students: </h2> */}
              <GeneralAdminTableView values={props.students} tableType='student' title='Associated Students' search={null}/>
              {/* {
                  exampleSchool.students.map((s,i)=>{
                    return <Link to={`/admin/student/${s.id}`} id={i}><button className='button'>{s.name}</button></Link>
                  })
                } */}
            </div>

            <div className='info-fields'>
              {/* <h2>Associated Routes: </h2> */}
              <GeneralAdminTableView values={props.routes} tableType='route' title='Associated Routes' search={null}/>
              {/* {
                  exampleSchool.routes.map((s,i)=>{
                    return <Link to={`/admin/route/${s.id}`} id={i}><button className='button'>{s.id}</button></Link>
                  })
                } */}
            </div>
          <div className='edit-delete-buttons'>
            <Link to={`/admin/edit/school/${props.school.id}`}><button>Edit School</button></Link>
            <button onClick={() => {
              setOpenModal(true);
            }}>Delete School</button>

            <Link to={`/admin/route/plan/${props.school.id}`}>
              <button>Create New Route for This School</button>
            </Link>

          </div>
          {/* <Link to="/admin/schools">
            <button className='button'> To Schools</button>
          </Link> */}
          <button onClick={() => navigate(-1)} className='button'>Go Back</button>
          </div>
        </div>
    </>
  );
}

GeneralAdminSchoolDetails.propTypes = {
    getSchool: PropTypes.func.isRequired,
    getStudentsByID: PropTypes.func.isRequired,
    getRoutesByID: PropTypes.func.isRequired,
     deleteSchool: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  school: state.schools.viewedSchool,
  students: state.students.students.results,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getSchool, getStudentsByID, getRoutesByID, deleteSchool})(GeneralAdminSchoolDetails)

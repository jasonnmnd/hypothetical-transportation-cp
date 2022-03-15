import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import FormDeleteModal from '../components/modals/FormDeleteModal';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchool, deleteSchool } from '../../../actions/schools';
import { getStudents } from '../../../actions/students';
import { getRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import { filterObjectForKey, filterObjectForKeySubstring } from '../../../utils/utils';
import getType from '../../../utils/user2';

function GeneralAdminSchoolDetails(props) {
  const navigate = useNavigate();
  const param = useParams();
  const STUDENT_PREFIX = "stu";
  const ROUTE_PREFIX = "rou";
  
  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = (schoolName) => {
    if (props.school.name === schoolName) {
      props.deleteSchool(param.id)
      navigate(`/${getType(props.user)}/schools/`)
    } else {
      alert("School name does not match")
    }
  }

  let [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {


    if(searchParams.get(`${STUDENT_PREFIX}pageNum`) != null && searchParams.get(`${ROUTE_PREFIX}pageNum`) != null){
      const allSearchParams = Object.fromEntries([...searchParams]);

      let studentSearchParams = filterObjectForKeySubstring(allSearchParams, STUDENT_PREFIX);
      studentSearchParams.school = param.id;
      let routeSearchParams = filterObjectForKeySubstring(allSearchParams, ROUTE_PREFIX);
      routeSearchParams.school = param.id
      
      
      props.getStudents(studentSearchParams);
      props.getRoutes(routeSearchParams);
    }
    else{
      setSearchParams({
        [`${STUDENT_PREFIX}pageNum`]: 1,
        [`${ROUTE_PREFIX}pageNum`]: 1
      })
    }


    

  }, [searchParams]);

  useEffect(() => {
    props.getSchool(param.id);
  }, []);




  return (
    <>  
        <SidebarSliding/>
        <Header textToDisplay={"School Details"} shouldShowOptions={true}></Header>
        <div className='confirm_location'>{openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='header-padding'>
        <div className='action-bar'> 
            <Link to={`/${getType(props.user)}/edit/school/${props.school.id}`}><button>Edit School</button></Link>
              <button onClick={() => {
                setOpenModal(true);
              }}>Delete School</button>

              <Link to={`/${getType(props.user)}/route/plan/${props.school.id}`}>
                <button>Create New Route for This School</button>
            </Link>
            {/* <button onClick={() => navigate(-1)} className='button'>Go Back</button> */}
        </div>
          <div className='left-content'>
              <div className='info-fields'>
                <h2>Name: </h2>
                <h3>{props.school.name}</h3>
              </div>

              <div className='info-fields'>
                <h2>Address: </h2>
                <h3>{props.school.address}</h3>
              </div>
            </div>
            <div className='left-content'>
              <div className='info-fields'>
                <h2>Associated students: </h2>
                <GeneralAdminTableView values={props.students} tableType='student' title='Associated Students' search={STUDENT_PREFIX} pagination={STUDENT_PREFIX}/>
                <br></br>
              </div>
            </div>
            <div className='left-content'>
              <div className='info-fields'>
                <h2>Associated Routes: </h2>
                <GeneralAdminTableView values={props.routes} tableType='route' title='Associated Routes' search={ROUTE_PREFIX} pagination={ROUTE_PREFIX}/>
                <br></br>
              </div>
          </div>
      </div>
    </>
  );
}

GeneralAdminSchoolDetails.propTypes = {
    getSchool: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
     deleteSchool: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  school: state.schools.viewedSchool,
  students: state.students.students.results,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getSchool, getStudents, getRoutes, deleteSchool})(GeneralAdminSchoolDetails)

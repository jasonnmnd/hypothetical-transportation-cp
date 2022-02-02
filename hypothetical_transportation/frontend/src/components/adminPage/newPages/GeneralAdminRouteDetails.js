import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';
import { getRouteInfo, deleteRoute } from '../../../actions/routes';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import MapContainer from '../../maps/MapContainer';


function GeneralAdminRouteDetails(props) {


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    props.deleteRoute(parseInt(param.id));
    navigate(`/admin/routes/`);
  }
  
  const navigate = useNavigate();
  const param = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    props.getRouteInfo(param.id);
  }, []);

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.routes = param.id;
      props.getStudents(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
  }, [searchParams]);




  return (
    <>  
        <SidebarSliding/>
        <Header textToDisplay={"Route Details"} shouldShowOptions={true}></Header>
        <div className='confirm_location'>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='middle-content'>
          <div className='admin-details'>

            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{props.route.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Description: </h2>
              <h3>{props.route.description}</h3>
            </div>

            <div className='info-fields'>
              <h2>School: </h2>
              <Link to={`/admin/school/${props.route.school.id}`}><button className='button'><h3>{props.route.school.name}</h3></button></Link>
            </div>

            <MapContainer schoolData={props.route.school} routeStudentData={props.students}/>:

            <GeneralAdminTableView title='Associated Students' tableType='student' values={props.students} search="" />

            <div className='edit-delete-buttons'>
              <Link to={`/admin/route/edit/${props.route.school.id}/${props.route.id}`}><button>Edit Route</button></Link>
              <button onClick={() => {
                setOpenModal(true);
              }}>Delete Route</button>
            </div>
            {/* <Link to="/admin/routes">
              <button className='button'> To Routes</button>
            </Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
          </div>
        </div>
    </>
  );
}

GeneralAdminRouteDetails.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    deleteRoute: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  route: state.routes.viewedRoute, 
  students: state.students.students.results
});

export default connect(mapStateToProps, {getRouteInfo, getStudents, deleteRoute})(GeneralAdminRouteDetails)


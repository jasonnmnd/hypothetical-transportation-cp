import React, {useEffect, useState} from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import AssistedLocationModal from '../components/modals/AssistedLocationModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';
import { getUser, deleteUser } from '../../../actions/users';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import isAdmin from '../../../utils/user';

function AdminUserDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    props.deleteUser(parseInt(param.id))
    navigate(`/admin/users/`)
  }


  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.guardian = param.id;
      props.getStudents(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
    
  }, [searchParams]);

  useEffect(() => {
    props.getUser(param.id);
  }, []);

  return (
    <>  
        <SidebarSliding/>
        <Header textToDisplay={"User Details"} shouldShowOptions={true}></Header>
        <div className='confirm_location'>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
          <div className='header-padding'>
          <div className='action-bar'>
                    <Link to={`/admin/edit/user/${props.user.id}`}>
                    <button>Edit User</button>
                    </Link>
                    <button onClick={() => {
                      setOpenModal(true);
                    }}>Delete User</button>
                    {/* <button onClick={() => navigate(-1)} className='button'>Go Back</button> */}
          </div>
          <div className='left-content'>
                  <div className='info-fields'>
                      <h2>Name: </h2>
                      <h3>{props.user.full_name}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>Email: </h2>
                      <h3>{props.user.email}</h3>
                  </div>
                  {!isAdmin(props.user)?<div className='info-fields'>
                      <h2>Address: </h2>
                      <h3>{props.user.address}</h3>
                  </div>:<div></div>
                  }
                  <div className='info-fields'>
                      <h2>Admin: </h2>
                      <h3>{isAdmin(props.user) ? "true":"false"}</h3>
                  </div>    
          </div>

          <div className='left-content'>
            {
              props.user.groups.includes(1)? <div></div>:
              <div className='info-fields-table'>
                  <h2>List of Students: </h2>
                  <div>
                    <GeneralAdminTableView values={props.students} tableType='student' title='Students' search={null} />
                    <br></br>
                  </div>
              </div>
            } 
          </div>
          </div>
    </>
  );
}

AdminUserDetails.propTypes = {
    getUser: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.users.viewedUser,
  token: state.auth.token,
  students: state.students.students.results
  
});

export default connect(mapStateToProps, {getUser, getStudents, deleteUser})(AdminUserDetails)

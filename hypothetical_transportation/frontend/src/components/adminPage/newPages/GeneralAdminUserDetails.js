import React, {useEffect, useState} from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { getStudentsByID } from '../../../actions/students';
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




  useEffect(() => {
    props.getUser(param.id);
    props.getStudentsByID({
      guardian: param.id
    });

  }, []);

  const getUserType = () => {
      if(props.user.groups.includes(2)){
          return "parent_user"
      }
      return "admin_user"
  }

  



  
  return (
    
    <>  
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <SidebarSliding/>
        <div className='confirm_location'>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>User Details</h1>
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
                {
                  props.user.groups.includes(1)? <div></div>:
                  <div className='info-fields'>
                      
                      <GeneralAdminTableView values={props.students} tableType='student' title='Students' search={null} />

                  </div>
                }     

                <div className='edit-delete-buttons'>
                  <Link to={`/admin/edit/${getUserType()}/${props.user.id}`}><button>Edit User</button></Link>
                  <button onClick={() => {
                    setOpenModal(true);
                  }}>Delete User</button>
                </div>
                  {/* <Link to="/admin/users">
                    <button className='button'> To Users</button>
                  </Link> */}
                  <button onClick={() => navigate(-1)} className='button'>Go Back</button>
            </div>
        </div>
    </>
  );
}

AdminUserDetails.propTypes = {
    getUser: PropTypes.func.isRequired,
    getStudentsByID: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.users.viewedUser,
  token: state.auth.token,
  students: state.students.students.results
  
});

export default connect(mapStateToProps, {getUser, getStudentsByID, deleteUser})(AdminUserDetails)

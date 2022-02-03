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
import { getUser } from '../../../actions/users';



function AdminUserDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    axios.delete(`/api/user/${param.id}/`, config(props.token))
        .then(res => {

          navigate(`/admin/users/`)
        }).catch(err => /*console.log(err)*/{});
  }


  const emptyUser = {
    id: 0,
    full_name: "",
    email: "",
    address: "",
    groups:[],
  }

  const emptyStudent = {
    student_id: "",
    full_name:"",
    routes:"",
    school:"",
  }

  const studentObject = [{
    id: 0,
    student_id: "",
    full_name:"",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const [user, setUser] = useState(emptyUser);
  const [colum, setColumn] = useState("");
  const [students, setStudents] = useState(studentObject);

  // const getUser = () => {
  //   console.log("HELLO")
  //   console.log(props.token)
  //   console.log("HELLO1")
  //   axios.get(`/api/user/${param.id}/`, config(props.token))
  //       .then(res => {
  //         setUser(res.data);
  //         res.data.groups.includes(1)?setColumn("admin_user"):setColumn("parent_user")
  //       }).catch(err => /*console.log(err)*/{});
  //   }
  
  const getStudents = () => {
    axios.get(`/api/student/?guardian=${param.id}`, config(props.token))
        .then(res => {
          setStudents(res.data.results);
        }).catch(err => /*console.log(err)*/{});
    }

  useEffect(() => {
    props.getUser();
    getStudents();

  }, []);


  
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
                {user.groups.includes(2)?<div className='info-fields'>
                    <h2>Address: </h2>
                    <h3>{props.user.address}</h3>
                </div>:<div></div>
                }
                <div className='info-fields'>
                    <h2>Admin: </h2>
                    <h3>{props.user.groups.includes(1) ? "true":"false"}</h3>
                </div>
                {/* Table for Students Here */}
                {
                  user.groups.includes(1)? <div></div>:
                  <div className='info-fields'>
                      <AdminTable title={"Students"} header={Object.keys(emptyStudent)} data={students}/>

                  </div>
                }     

                <div className='edit-delete-buttons'>
                  <Link to={`/admin/edit/${colum}/${props.user.id}`}><button>Edit User</button></Link>
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
    getUser: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.users.viewedUser,
  token: state.auth.token
  
});

export default connect(mapStateToProps, {getUser})(AdminUserDetails)

import React, {useEffect, useState} from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from "react-router-dom";
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import AssistedLocationModal from '../components/modals/AssistedLocationModal';


function AdminUserDetails() {
  const navigate = useNavigate();
  const param = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    axios.delete(`/api/user/${param.id}`)
        .then(res => {
          console.log("DELETED User");
          navigate(`/admin/users/`)
        }).catch(err => console.log(err));
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
    address: "",
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

  const getUser = () => {
    axios.get(`/api/user/${param.id}/`)
        .then(res => {
          setUser(res.data);
          res.data.groups.includes(1)?setColumn("admin_user"):setColumn("parent_user")
        }).catch(err => console.log(err));
    }
  
  const getStudents = () => {
    axios.get(`/api/student?guardian=${param.id}`)
        .then(res => {
          setStudents(res.data.results);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getUser();
    getStudents();
    console.log(colum)

  }, []);


  
  return (
    
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        {/* {openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress}/>} */}
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>User Details</h1>
                <div className='info-fields'>
                    <h2>Name: </h2>
                    <h3>{user.full_name}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Email: </h2>
                    <h3>{user.email}</h3>
                </div>
                {user.groups.includes(2)?<div className='info-fields'>
                    <h2>Address: </h2>
                    <h3>{user.address}</h3>
                </div>:<div></div>
                }
                <div className='info-fields'>
                    <h2>Admin: </h2>
                    <h3>{user.groups.includes(1) ? "true":"false"}</h3>
                </div>
                {/* Table for Students Here */}
                {
                  user.groups.includes(1)? <div></div>:
                  <div className='info-fields'>
                      <AdminTable title={"Students"} header={Object.keys(emptyStudent)} data={students}/>

                  </div>
                }     

                <div className='edit-delete-buttons'>
                  <Link to={`/admin/edit/${colum}/${user.id}`}><button>Edit User</button></Link>
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

export default AdminUserDetails;

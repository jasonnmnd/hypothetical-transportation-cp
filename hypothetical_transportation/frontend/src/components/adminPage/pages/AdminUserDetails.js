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
  const exampleUser = {
    id:param.id,
    name: "First Last",
    email: "firstlast@gmail.com",
    students:[
        {
          id:444,
          name:"Al",
          studentid: "123",
          school: "A high school",
          route: "#1",
        },
        {
          id:555,
          name:"Hugo",
          studentid:"456",
          school: "B high school",
          route: "#2",
        },
        {
          id:666,
          name:"James",
          studentid:"567",
          school: "C high school",
          route: "none",
        }
      ]
  }

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete user
    //Route back to students page
    console.log("DELETED USER");
  }


  const emptyUser = {
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    admin:false,
  }

  const emptyStudents = [{
  }]

  const [user, setUser] = useState(emptyUser);
  const [colum, setColumn] = useState("");
  const [students, setStudents] = useState(emptyStudents);

  const getUser = () => {
    axios.get(`/api/user/${param.id}`)
        .then(res => {
          setUser(res.data);
          res.data.admin?setColumn("admin_user"):setColumn("parent_user")
        }).catch(err => console.log(err));
    }
  
  const getStudents = () => {
    axios.get(`/api/student?user=${param.id}`)
        .then(res => {
          setStudents(res.data);
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
                    <h3>{user.first_name} {user.last_name}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Email: </h2>
                    <h3>{user.email}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Address: </h2>
                    <h3>{user.address}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Admin: </h2>
                    <h3>{user.admin ? "true":"false"}</h3>
                </div>
                {/* Table for Students Here */}
                <div className='info-fields'>
                    {/* <h2>Students: </h2> */}
                    <AdminTable title={"Students"} header={Object.keys(exampleUser.students[0])} data={exampleUser.students}/>
                    {/* {
                      exampleUser.students.map((s,i)=>{
                        return <Link to={`/admin/student/${s.id}`} id={i}><button className='button'>{s.name}</button></Link>
                      })
                    } */}
                </div>

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

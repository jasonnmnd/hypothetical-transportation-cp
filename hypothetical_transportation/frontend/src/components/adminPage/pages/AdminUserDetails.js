import React, { useState } from 'react';
import Header from '../../header/Header';
import { Link, useParams } from "react-router-dom";
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';

function AdminUserDetails() {
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
  
  return (
    
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>User Details</h1>
                <div className='info-fields'>
                    <h2>Name: </h2>
                    <h3>{exampleUser.name}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Email: </h2>
                    <h3>{exampleUser.email}</h3>
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
                  <Link to={`/admin/edit/user/${exampleUser.id}`}><button>Edit User</button></Link>
                  <button onClick={() => {
                    setOpenModal(true);
                  }}>Delete User</button>
                </div>
                  <Link to="/admin/users">
                    <button className='button'>Go Back To Users</button>
                  </Link>
            </div>
            {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        </div>
    </>
  );
}

export default AdminUserDetails;

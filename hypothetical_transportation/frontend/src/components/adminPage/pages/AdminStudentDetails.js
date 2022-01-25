import React, { useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import SidebarSliding from '../components/sidebar/SidebarSliding';

function AdminStudentDetails() {
  const navigate = useNavigate();
  const param = useParams();

  const exampleStudent = {
    name: "First Last",
    id: param.id,
    student_id: 444,
    school: {//change this to school id for easier query?
      id: 123,
      name: "Random school"
    },
    route: {//change this to route id for easier query? because we need to access route through details page too
      id:100,
      name: "route 1"
    } ,
    parent: {//change this to parent id for easier query? then ask backend to pass parent name and email information?
      id:30,
      name:"Example Parent",
      email: "parent@parent.com"
    }
  }

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete student
    //Route back to students page
    console.log("DELETED STUDENT");
  }

  return (
    <> 
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        <div className='middle-justify'>
          <div className='admin-details'>
                  <h1>Student Details</h1>
                  <div className='info-fields'>
                      <h2>Name: </h2>
                      <h3>{exampleStudent.name}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>StudentID: </h2>
                      <h3>{exampleStudent.student_id}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>School: </h2>
                      <Link to={`/admin/school/${exampleStudent.school.id}`}><button className='button'><h3>{exampleStudent.school.name}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Route: </h2>
                      <Link to={`/admin/route/${exampleStudent.route.id}`}><button className='button'><h3>{exampleStudent.route.name}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Parent Name: </h2>
                      <Link to={`/admin/user/${exampleStudent.parent.id}`}><button className='button'><h3>{exampleStudent.parent.name}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Parent Email: </h2>
                      <h3>{exampleStudent.parent.email}</h3>
                  </div>

                  {/* Table for Students Here */}

                  <div className='edit-delete-buttons'>
                        <Link to={`/admin/edit/student/${exampleStudent.id}`}><button>Edit Student</button></Link>
                        <button onClick={() => {
                          setOpenModal(true);
                        }}>Delete Student</button>
                  </div>
                    {/* <Link to="/admin/students">
                      <button className='button'>To Students</button>
                    </Link> */}
                    <button onClick={() => navigate(-1)} className='button'>Go Back</button>
              </div>
            </div>
    </>
  );
}

export default AdminStudentDetails;
import React, { useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';

function AdminStudentDetails() {
  const navigate = useNavigate();
  const param = useParams();

  const exampleStudent = {
    name: "First Last",
    id: param.id,
    student_id: 444,
    school: "Random school",//change this to school id for easier query?
    route: 1, //change this to route id for easier query?
    parent_name: "Example Parent",//change this to parent id for easier query? then ask backend to pass parent name and email information?
    parent_email: "parent@parent.com"
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
                      <h3>{exampleStudent.school}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>Route: </h2>
                      <h3>{exampleStudent.route}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>Parent Name: </h2>
                      <h3>{exampleStudent.parent_name}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>Parent Email: </h2>
                      <h3>{exampleStudent.parent_email}</h3>
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
              {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
            </div>
    </>
  );
}

export default AdminStudentDetails;
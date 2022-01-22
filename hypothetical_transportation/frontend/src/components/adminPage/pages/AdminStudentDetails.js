import React from 'react';
import Header from '../../header/Header';
import { Link, useParams } from 'react-router-dom';
import "../adminPage.css";

function AdminStudentDetails() {

  const param = useParams();

  const exampleStudent = {
    name: "First Last",
    id: param.id,
    student_id: 444,
    school: "Random school",
    route: 1,
    parent_name: "Example Parent",
    parent_email: "parent@parent.com"
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
                      <button>Delete User</button>
                      <Link to="/admin/students">
                        <button>Go Back To Students</button>
                      </Link>
                  </div>
              </div>
            </div>
    </>
  );
}

export default AdminStudentDetails;

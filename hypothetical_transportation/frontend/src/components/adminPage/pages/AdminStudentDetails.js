import React from 'react';
import Header from '../../header/Header';
import "../adminPage.css";

function AdminStudentDetails() {
  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>Student Details</h1>
            </div>
        </div>
    </>
  );
}

export default AdminStudentDetails;

import React from 'react';
import Header from '../../header/Header';
import "../adminPage.css";

function AdminSchoolDetails() {
  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>School Details</h1>
            </div>
        </div>
    </>
  );
}

export default AdminSchoolDetails;

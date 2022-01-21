import React from 'react';
import Header from '../../header/Header';
import "../adminPage.css";

function AdminRouteDetails() {
  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>Route Details</h1>
            </div>
        </div>
    </>
  );
}

export default AdminRouteDetails;

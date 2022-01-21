import React from 'react';
import Header from '../../header/Header';
import "../adminPage.css";

function AdminUserDetails() {

    const exampleUser = {
        name: "First Last",
        email: "firstlast@gmail.com",
        students:[
            {
              name:"Al",
              id: "123",
              school: "A high school",
              route: "#1",
            },
            {
              name:"Hugo",
              id:"456",
              school: "B high school",
              route: "#2",
            },
            {
              name:"James",
              id:"567",
              school: "C high school",
              route: "none",
            }
          ]
    }

  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
            <div className='admin-details'>
                <h1>User Details</h1>
                <div className='info-fields'>
                    <h2>Name:</h2>
                    <h3>{exampleUser.name}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Email:</h2>
                    <h3>{exampleUser.name}</h3>
                </div>
                <div className='info-fields'>
                    <h2>Students:</h2>
                </div>

                {/* Table for Students Here */}

                <div className='edit-delete-buttons'>
                    <button>Edit User</button>
                    <button>Delete User</button>
                </div>
            </div>
        </div>
    </>
  );
}

export default AdminUserDetails;

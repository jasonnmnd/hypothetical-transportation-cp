import React from 'react';
import Header from '../../header/Header';
import "../adminPage.css";

function AdminSchoolDetails() {
  const param = useParams();
  const exampleSchool = {
    id:param.id,
    name: "Name",
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
                <h1>School Details</h1>
            </div>
        </div>
    </>
  );
}

export default AdminSchoolDetails;

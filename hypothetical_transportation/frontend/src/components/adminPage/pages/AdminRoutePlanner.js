import React from 'react';
import Header from '../../header/Header';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import { Link } from 'react-router-dom';

function AdminRoutePlanner() {

  const exampleRoute = {
    // id: param.id,
    name: "Route #1",
    school: {
      id:"1",
      name: "school",
    },
    description: "This is a route for a school. A Route can only be associated with 1 school",
    students:[
      {
        id: "123",
        name:"Al",
        studentid:"444",
        school: "A high school",
        route: "#1",
      },
      {
        id:"456",
        name:"Hugo",
        studentid:"234",
        school: "B high school",
        route: "#2",
      },
      {
        id:"567",
        name:"James",
        studentid:"555",
        school: "C high school",
        route: "none",
      }
    ]
  }
  return (
    
    <>
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='middle-justify'>
          <div className='admin-details'>
          <h1>Route Planner</h1>

            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{exampleRoute.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Description: </h2>
              <h3>{exampleRoute.description}</h3>
            </div>

            <div className='info-fields'>
              <h2>School: </h2>
              {/* <Link to={`/admin/school/${exampleRoute.school.id}`}> */}
                <button className='button'><h3>{exampleRoute.school.name}</h3></button>
              {/* </Link> */}
            </div>
            <h2>Map of School and Students</h2>
            <h1>// MAP OF SCHOOL AND STUDENT ADDRESSES HERE //</h1>

            <h2> Students at *this school* With No Routes </h2>
            <h1>// SHOW STUDENTS WITH NO ROUTES HERE //</h1>
          </div>
        </div>
    </>

    );
}

export default AdminRoutePlanner;

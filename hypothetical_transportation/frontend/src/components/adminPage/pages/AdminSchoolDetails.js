import React, { useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';


function AdminSchoolDetails() {
  const param = useParams();
  const exampleSchool = {
    id:param.id,
    name: "I am a school",
    routes:[
      {
        id:100,
      },
      {
        id:800,
      }
    ],
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


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    console.log("DELETED USER");
  }
  

  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-justify'>
          <div className='admin-details'>

            <h1>School Details</h1>

            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{exampleSchool.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Associated students: </h2>
              {
                  exampleSchool.students.map((s,i)=>{
                    return <Link to={`/admin/student/${s.id}`} id={i}><button className='button'>{s.name}</button></Link>
                  })
                }
            </div>

            <div className='info-fields'>
              <h2>Associated Routes: </h2>
              {
                  exampleSchool.routes.map((s,i)=>{
                    return <Link to={`/admin/route/${s.id}`} id={i}><button className='button'>{s.id}</button></Link>
                  })
                }
            </div>
          <div className='edit-delete-buttons'>
            <Link to={`/admin/edit/school/${exampleSchool.id}`}><button>Edit School</button></Link>
            <button onClick={() => {
              setOpenModal(true);
            }}>Delete School</button>
          </div>
          <Link to="/admin/schools">
            <button className='button'>Go Back To Schools</button>
          </Link>
          </div>
          {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        </div>
    </>
  );
}

export default AdminSchoolDetails;

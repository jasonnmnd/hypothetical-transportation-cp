import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormDeleteModal from '../components/modals/FormDeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';


function AdminSchoolDetails() {
  const navigate = useNavigate();
  const param = useParams();
  const exampleSchool = {
    id:param.id,
    name: "I am a school",
    address: "xxx road",
    routes:[
      {
        id:100,
        name: "route#1",
      },
      {
        id:800,
        name: "route#8",
      }
    ],
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


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = (schoolName) => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    console.log(schoolName);
  }
  
  const emptySchool = {
    id: 0,
    name: "",
    address: "",
  }

  const emptyRoute = [{
    id: 0,
    name: "",
    description: "",
  }]

  const [school, setSchool] = useState(emptySchool);
  const [routes, setRoutes] = useState(emptyRoute);

  const getSchool = () => {
    axios.get(`/api/school/${param.id}`)
        .then(res => {
            setSchool(res.data);
        }).catch(err => console.log(err));
    }
  
  const getRoutes = () => {
    axios.get(`/api/route?school=${param.id}`)
        .then(res => {
            setRoutes(res.data);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchool();
    getRoutes();
  }, []);



  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        {openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        <div className='middle-justify'>
          <div className='admin-details'>

            <h1>School Details</h1>

            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{school.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Address: </h2>
              <h3>{school.address}</h3>
            </div>

            <div className='info-fields'>
              {/* <h2>Associated students: </h2> */}
              <AdminTable title={"Associated Students"} header={Object.keys(exampleSchool.students[0])} data={exampleSchool.students}/>
              {/* {
                  exampleSchool.students.map((s,i)=>{
                    return <Link to={`/admin/student/${s.id}`} id={i}><button className='button'>{s.name}</button></Link>
                  })
                } */}
            </div>

            <div className='info-fields'>
              {/* <h2>Associated Routes: </h2> */}
              <AdminTable title={"Associated Routes"} header={Object.keys(emptyRoute[0])} data={routes}/>
              {/* {
                  exampleSchool.routes.map((s,i)=>{
                    return <Link to={`/admin/route/${s.id}`} id={i}><button className='button'>{s.id}</button></Link>
                  })
                } */}
            </div>
          <div className='edit-delete-buttons'>
            <Link to={`/admin/edit/school/${school.id}`}><button>Edit School</button></Link>
            <button onClick={() => {
              setOpenModal(true);
            }}>Delete School</button>
          </div>
          {/* <Link to="/admin/schools">
            <button className='button'> To Schools</button>
          </Link> */}
          <button onClick={() => navigate(-1)} className='button'>Go Back</button>
          </div>
        </div>
    </>
  );
}

export default AdminSchoolDetails;

import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormDeleteModal from '../components/modals/FormDeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function AdminSchoolDetails(props) {
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
    axios.delete(`/api/school/${param.id}/`)
        .then(res => {
          console.log("DELETED Route");
          navigate(`/admin/schools/`)
        }).catch(err => console.log(err));
  }
  
  const emptySchool = {
    id: 0,
    name: "",
    address: "",
  }

  const emptyStudent = {
    student_id: "",
    full_name:"",
    address: "",
  }

  const studentObject = [{
    id: 0,
    student_id: "",
    full_name:"",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const emptyRoute = [{
    id: 0,
    name: "",
    description: "",
  }]

  const [school, setSchool] = useState(emptySchool);  
  const [students, setStudents] = useState(studentObject);
  const [routes, setRoutes] = useState(emptyRoute);

  const getSchool = () => {
    axios.get(`/api/school/${param.id}/`)
        .then(res => {
          console.log("hello")
          console.log(res.data)
            setSchool(res.data);
        }).catch(err => console.log(err));
    }

  const getStudent = () => {
    axios.get(`/api/student/?school=${param.id}`)
        .then(res => {
          console.log(res.data.results)
            setStudents(res.data.results);
        }).catch(err => console.log(err));
    }
  
  const getRoutes = () => {
    axios.get(`/api/route/?school=${param.id}`)
        .then(res => {
          console.log(res.data.results)
            setRoutes(res.data.results);
        }).catch(err => console.log(err));
    }

  useEffect(() => {
    getSchool();
    getRoutes();
    getStudent();
  }, []);



  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='confirm_location'>{openModal && <FormDeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
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
              <AdminTable title={"Associated Students"} header={Object.keys(emptyStudent)} data={students}/>
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

            <Link to={`/admin/route/plan/${school.id}`}>
              <button>Create New Route for This School</button>
            </Link>

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

AdminSchoolDetails.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(AdminSchoolDetails)

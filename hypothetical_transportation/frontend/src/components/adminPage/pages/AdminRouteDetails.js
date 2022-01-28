import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function AdminRouteDetails() {


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    axios.delete(`/api/route/${param.id}`).then(res => {
      console.log("DELETED Route");
      navigate(`/admin/routes/`)

    }).catch(err => console.log(err));

  }
  
  const navigate = useNavigate();
  const param = useParams();
  const exampleRoute = {
    id:param.id,
    name: "Routie",
    school: {
      id:"1",
      name: "school",
    },
    description: "xxxxxxxx",
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



  const emptyRoute = {
    id: 0,
    name: "",
    description: "",
    school: "",
  }

  const emptyStudent = {
    student_id: "",
    first_name: "",
    last_name: "",
    address: "",
  }

  const studentObject = [{
    id: 0,
    student_id: "",
    first_name: "",
    last_name: "",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const [route, setRoute] = useState(emptyRoute);
  const [students, setStudents] = useState(studentObject);
  const [school, setSchoolName] = useState("");

  const getRoutes = () => {
    axios.get(`/api/route/${param.id}`)
    .then(res => {
      setRoute(res.data);
      axios.get(`/api/school/${res.data.school}`)
          .then(res => {
            setSchoolName(res.data.name);
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }
  
  
  const getStudent = () => {
  axios.get(`/api/student?routes=${param.id}`)
    .then(res => {
      console.log(res.data.results)
      setStudents(res.data.results);
    }).catch(err => console.log(err));
  }
  

  useEffect(() => {
    getRoutes();
    getStudent();
  }, []);




  return (
    <>  
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        <div className='middle-justify'>
          <div className='admin-details'>
            <h1>Route Details</h1>
            <div className='info-fields'>
              <h2>Name: </h2>
              <h3>{route.name}</h3>
            </div>

            <div className='info-fields'>
              <h2>Description: </h2>
              <h3>{route.description}</h3>
            </div>

            <div className='info-fields'>
              <h2>School: </h2>
              <Link to={`/admin/school/${route.school}`}><button className='button'><h3>{school}</h3></button></Link>
            </div>

            <AdminTable title={"Associated Students"} header={Object.keys(emptyStudent)} data={students}/>

            <div className='edit-delete-buttons'>
              <Link to={`/admin/edit/route/${exampleRoute.id}`}><button>Edit Route</button></Link>
              <button onClick={() => {
                setOpenModal(true);
              }}>Delete Route</button>
            </div>
            {/* <Link to="/admin/routes">
              <button className='button'> To Routes</button>
            </Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
          </div>
        </div>
    </>
  );
}

AdminRouteDetails.propTypes = {
    
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AdminRouteDetails)


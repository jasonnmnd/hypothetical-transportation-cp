import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';

function AdminStudentDetails() {
  const navigate = useNavigate();
  const param = useParams();

  const exampleStudent = {
    name: "First Last",
    id: param.id,
    student_id: 444,
    school: {//change this to school id for easier query?
      id: 123,
      name: "Random school"
    },
    route: {//change this to route id for easier query? because we need to access route through details page too
      id:100,
      name: "route 1"
    } ,
    parent: {//change this to parent id for easier query? then ask backend to pass parent name and email information?
      id:30,
      name:"Example Parent",
      email: "parent@parent.com"
    }
  }

  const studentObject = {
    id: 0,
    student_id: "",
    first_name: "",
    last_name: "",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }

  const [student, setStudent] = useState(studentObject);
  const [parentName,setParentName] = useState("");
  const [schoolName,setSchoolName] = useState("");
  const [routeName,setRouteName] = useState("");

  const getInfo = () => {
    axios.get(`/api/student/${param.id}`)
      .then(res => {
        setStudent(res.data);
        axios.get(`/api/user/${res.data.guardian}`)
          .then(res => {
            setParentName(res.data.full_name);
        }).catch(err => console.log(err));
        axios.get(`/api/school/${res.data.school}`)
          .then(res => {
            setSchoolName(res.data.name);
        }).catch(err => console.log(err));
        axios.get(`/api/route/${res.data.routes}`)
          .then(res => {
            setRouteName(res.data.name);
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete student
    //Route back to students page
    axios.delete(`/api/student/${param.id}`).then(res => {
      console.log("DELETED STUDENT");
      navigate(`/admin/students/`)

    }).catch(err => console.log(err));
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <> 
      <Header textToDisplay={"Admin Portal"}></Header>
      <SidebarSliding/>
        {openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}
        <div className='middle-justify'>
          <div className='admin-details'>
                  <h1>Student Details</h1>
                  <div className='info-fields'>
                      <h2>Name: </h2>
                      <h3>{student.first_name + " " +student.last_name}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>StudentID: </h2>
                      <h3>{student.student_id}</h3>
                  </div>
                  <div className='info-fields'>
                      <h2>School: </h2>
                      <Link to={`/admin/school/${student.school}`}><button className='button'><h3>{schoolName}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Route: </h2>
                      <Link to={`/admin/route/${student.routes}`}><button className='button'><h3>{routeName}</h3></button></Link>
                  </div>
                  <div className='info-fields'>
                      <h2>Parent: </h2>
                      <Link to={`/admin/user/${student.guardian}`}><button className='button'><h3>{parentName}</h3></button></Link>
                  </div>

                  {/* Table for Students Here */}

                  <div className='edit-delete-buttons'>
                        <Link to={`/admin/edit/student/${exampleStudent.id}`}><button>Edit Student</button></Link>
                        <button onClick={() => {
                          setOpenModal(true);
                        }}>Delete Student</button>
                  </div>
                    {/* <Link to="/admin/students">
                      <button className='button'>To Students</button>
                    </Link> */}
                    <button onClick={() => navigate(-1)} className='button'>Go Back</button>
              </div>
            </div>
    </>
  );
}

export default AdminStudentDetails;
import React,{useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminStudentsPage() {

  //Mock Student Data (API Call Later for Real Data)
  const title = "Students"
  const data = [
    {
      id:111,
      name: "Anna",
      studentid: 12,
      school: "School 1",
      route: "",
    },

    {
      id:222,
      name: "Emma",
      studentid: 1223,
      school: "School 2",
      route:4,
    },

    {
      id:332,
      name: "Mark",
      studentid: 1213214,
      school: "School 3",
      route:3,
    },

    {
      id:4441,
      name: "Bob",
      studentid: 23423,
      school: "School 4",
      route:4,
    }

  ]

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

  const emptyStudent = {
    student_id: "",
    first_name: "",
    last_name: "",
    school: "",
  }

  const [students, setStudents] = useState(studentObject);

  const getStudent = () => {
    axios.get(`/api/student/`)
        .then(res => {
          console.log(res.data.results)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
    }
  

  useEffect(() => {
    getStudent();
  }, []);

  const searchStudent = (i1,i2) => {
    axios.get(`/api/student?${i1}Includes='${i2}'`)
        .then(res => {
          console.log(`/api/student?${i1}Includes='${i2}'`)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
  }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchStudent(value.by, value.value)
  }

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
    console.log("Prev Clicked");
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
    console.log("Next Clicked");
  }

  

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-content'>
          <div className='center-buttons'>
            <Link to="/admin/newstudent/">
              <button className='button'>Add New Student</button>
            </Link>          
          </div>
          <div className='table-and-buttons'>
            <AdminTable title={title} header={Object.keys(emptyStudent)} data={students} search={search}/>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
          </div>
        </div>
    </div>
    
  )
}
export default AdminStudentsPage;

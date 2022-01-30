import React,{useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';

function AdminStudentsPage(props) {

  //Mock Student Data (API Call Later for Real Data)
  const title = "Students"
  const studentObject = [{
    id: 0,
    student_id: "",
    full_name:"",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
  }]

  const emptyStudent = {
    student_id: "",
    full_name:"",
    school: "",
  }

  const [students, setStudents] = useState(studentObject);

  const getStudent = () => {
    axios.get(`/api/student/`, config(props.token))
        .then(res => {
          console.log(res.data.results)
          setStudents(res.data.results);
        }).catch(err => console.log(err));
    }
  

  useEffect(() => {
    getStudent();
  }, []);

  const searchStudent = (i1,i2) => {
    axios.get(`/api/student/?search=${i2}&search_fields=${i1}`, config(props.token))
        .then(res => {
          console.log(`/api/student?search=${i2}&search_fields=${i1}`)
          console.log(res.data.results)
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
            <Link to="/admin/new_student/">
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
AdminStudentsPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminStudentsPage)

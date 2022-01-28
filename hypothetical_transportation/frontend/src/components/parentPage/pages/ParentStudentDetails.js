import React, { useEffect, useState } from "react";
import "../parentPage.css";
import Header from "../../header/Header";
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios";


function ParentStudentDetails(){
    const param = useParams();

    const studentObject = {
        id: 0,
        student_id: 0,
        full_name: "",
        address: "",
        guardian: 0,
        routes: 0,
        school: 0,
      }

    const [student, setStudent] = useState(studentObject);

    const getStudentInfo = () => {
        axios.get(`/api/student/${param.id}/`)
        .then(res => {
            console.log(res.data);
            setStudent(res.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getStudentInfo();
    }, []);

    return(
        <>
        <Header textToDisplay={"Parent Portal"}></Header>
            <div className='middle-justify'>
                <div className='parent-details'>
                        <h1>Your Student's Details</h1>
                        <div className='info-fields'>
                            <h2>Name:</h2>
                            <h3>{student.full_name}</h3>
                        </div>
                        <div className='info-fields'>
                            <h2>ID:</h2>
                            <h3>{student.student_id}</h3>
                        </div>
                        <div className='info-fields'>
                            <h2>School:</h2>
                            <h3>{student.school}</h3>
                        </div>
                        <div className='info-fields'>
                            <h2>Route:</h2>
                            <h3>{student.routes}</h3>
                        </div>

                        <div className='edit-delete-buttons'>
                            <Link to="/parent">
                                <button>Go Back</button>
                            </Link>
                        </div>
                </div>
            </div>
        </>
    )
}

ParentStudentDetails.propTypes = {

}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(ParentStudentDetails)
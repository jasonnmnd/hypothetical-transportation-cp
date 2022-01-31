import React, { useEffect, useState } from "react";
import "../parentPage.css";
import Header from "../../header/Header";
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios";
import config from "../../../utils/config";
import { getStudentInfo } from '../../../actions/students';

function ParentStudentDetails(props){
    const param = useParams();
    const student = props.student;

    useEffect(() => {
        props.getStudentInfo(param.id);
    }, []);

    return(
        <>
        <Header textToDisplay={"Parent Portal"} shouldShowOptions={true}></Header>
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
                            <h3>{student.schoolName}</h3>
                        </div>
                        <div className='info-fields'>
                            <h2>Route:</h2>
                            <h3>{(student.routes !==undefined && student.routes!==null) ? student.routeName : "NONE"}</h3>
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
    getStudentInfo: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    student: state.students.viewedStudent
});

export default connect(mapStateToProps, {getStudentInfo})(ParentStudentDetails)
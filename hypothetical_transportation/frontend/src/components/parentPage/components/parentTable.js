import React, { useState, Fragment } from 'react';
import "../parentPage.css";
import mockData from "../mock-data.json" //Mock data that we are eventually expecting from the backend
import ParentRow from './ParentRow';
import { Routes, Route, Navigate } from 'react-router-dom';
import ParentStudentDetails from '../pages/ParentStudentDetails';
import { useNavigate } from 'react-router-dom'

function ParentTable() {
    const nav = useNavigate();
    //useState to set students
    const [students, setStudents] = useState(mockData);
    //record which student we want to view
    const [viewStudent, setViewStudent] = useState(null);

    //Parent can click and view student
    const handleViewClick = (student) => {
        // event.preventDefault();
        setViewStudent(student.id);
        console.log(student.id);
        nav(`/parent/student/${student.id}`);
        //return <Navigate to={`/parent/viewstudent/${student.id}`}></Navigate>
    };


    return (
        <div className="parentTable-container">
            <table className='center'>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>School</th>
                        <th>Bus Route</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student,i) => (
                        <Fragment key={i}>
                            <ParentRow student={student} handleViewClick={handleViewClick}/>
                        </Fragment>
                        ))}
                </tbody>
            </table>
        </div>
    )
}

export default ParentTable
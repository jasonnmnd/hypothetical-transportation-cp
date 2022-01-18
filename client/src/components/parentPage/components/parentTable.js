import React, { useState } from 'react';
import "../parentPage.css";
import mockData from "../mock-data.json" //Mock data that we are eventually expecting from the backend

function ParentTable() {

    //useState to set students
    const [students, setStudents] = useState(mockData);
    //record which student we want to view
    const [viewStudent, setViewStudent] = useState(null);

    //Parent can click and view student
    const handleViewClick = (event, student) => {
        event.preventDefault();
        //setViewStudent(student.id);
        console.log(student);
    };


    return (
        <div className="parentTable-container">
            <table>
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
                    {students.map((student) => 
                        <tr>
                            <td>{student.name}</td>
                            <td>{student.id}</td>
                            <td>{student.school}</td>
                            <td>{student.route}</td>
                            <td>
                                <button type="button" onClick={(event, student) => handleViewClick(event, student)}>View</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            
        </div>
    )
}

export default ParentTable

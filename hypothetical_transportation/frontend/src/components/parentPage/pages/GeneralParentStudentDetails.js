import React, { useEffect, useState } from "react";
import ParentHeader from "../../header/ParentHeader";
import { Link, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios";
import config from "../../../utils/config";
import { getStudentInfo } from '../../../actions/students';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

function ParentStudentDetails(props){
    const param = useParams();
    const student = props.student;

    useEffect(() => {
        props.getStudentInfo(param.id);
    }, []);

    return(
        // <>
        // <Header textToDisplay={"Student Details"} shouldShowOptions={true}></Header>
        //     <div className='header-padding'>
        //     <div className='left-content'>
        //         <div className='info-fields'>
        //             <h2>Name:</h2>
        //             <h3>{student.full_name}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>ID:</h2>
        //             <h3>{student.student_id}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>School:</h2>
        //             <h3>{student.school.name}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>Route:</h2>
        //             <h3>{(student.routes !==undefined && student.routes!==null) ? student.routes.name : "NONE"}</h3>
        //         </div>

        //         <div className='edit-delete-buttons'>
        //             <Link to="/parent">
        //                 <button>Go Back</button>
        //             </Link>
        //         </div>
        //     </div>
        //     </div>
        // </>

        <div>  
        <ParentHeader></ParentHeader>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{student.full_name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">StudentID </Card.Header>
            <Card.Body>
                <Card.Text>{student.student_id}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">School </Card.Header>
            <Card.Body>
                <Card.Text>{student.school.name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Route</Card.Header>
            <Card.Body>
                <Card.Text>{(student.routes !==undefined && student.routes!==null) ? student.routes.name : "NONE"}</Card.Text>
            </Card.Body>
        </Card>
        </Container>
    </div>

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
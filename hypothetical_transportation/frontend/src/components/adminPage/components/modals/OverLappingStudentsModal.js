import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Modal, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import { getStudentRouteName } from '../../../../utils/planner_maps';
import "./modal.css";





function OverlappingStudentsModal(props){

    const getInstructionsString = (routeName) => {
        if(routeName == "none"){
            return "Please select which students you would like to remove from their routes."
        }
        if(routeName == null || routeName == "" || props.allRoutes.length == 0){
            return null
        }
        return `Please select which students you would like to add to ${props.allRoutes.find(route => route.id == parseInt(routeName)).name}.`
    }

    const getStudentRows = () => {
        return props.students.map((student) => (
            <tr key={student.id}> 
                <td>{student.full_name}</td>
                <td>{student.guardian.address}</td>
                <td>{getStudentRouteName(student.id, student.routes, props.studentChanges, props.allRoutes)}</td>
                <td>
                    <Button variant="yellowTableSm" onClick={() => props.changeStudentRoute(student, null)}>Add</Button>
                </td>
            </tr>
        ))
    }

    const getStudentTable = () => {
        return (
            <Table striped bordered size="sm">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Route</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {getStudentRows()}  
                </tbody>
            </Table>
        )
    }

    return (
        <Modal show={props.students.length > 0} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>Multiple Students</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <h2>There are multiple students at this marker!</h2>
                    <h5>{getInstructionsString(props.currentRoute)}</h5>
                    {getStudentTable()}
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                    </Container>
                    
                </Modal.Footer>
        </Modal>  
    )
}

OverlappingStudentsModal.propTypes = {
    students: PropTypes.array,
    closeModal: PropTypes.func,
    studentChanges: PropTypes.object,
    allRoutes: PropTypes.array,
    changeStudentRoute: PropTypes.func,
    currentRoute: PropTypes.string
}

OverlappingStudentsModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(OverlappingStudentsModal)

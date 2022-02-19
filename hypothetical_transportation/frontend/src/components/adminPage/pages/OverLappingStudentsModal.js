import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import { getStudentRouteName } from '../../../utils/planner_maps';





function OverlappingStudentsModal(props){

    const getInstructionsString = (routeName) => {
        if(routeName == "none"){
            return "Please select which students you would like to remove from their routes."
        }
        return `Please select which students you would like to add to the route.`
    }

    const getStudentRows = () => {
        return props.students.map((student) => (
            <tr key={student.id}> 
                <td>{student.full_name}</td>
                <td>{student.guardian.address}</td>
                <td>{getStudentRouteName(student.id, student.routes, props.studentChanges, props.allRoutes)}</td>
                <td>
                    <Button onClick={() => props.changeStudentRoute(student, null)}>Add to Route</Button>
                </td>
            </tr>
        ))
    }

    const getStudentTable = () => {
        return (
            <Table>
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
                    <Modal.Title>Multiple Students</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h2>There are multiple students at this marker!</h2>
                    <h4>{getInstructionsString(props.currentRoute)}</h4>
                    {getStudentTable()}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={props.closeModal}>Close</Button>
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

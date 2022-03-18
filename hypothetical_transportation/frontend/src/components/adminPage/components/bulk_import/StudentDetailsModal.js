import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';
import ErrorSection from './ErrorSection';
import { errOrDupExists, getEditableTextField, getEditableTextFieldClass } from '../../../../utils/bulk_import';


const TYPE_TITLES = {
    parent_email: "Parent Email",
    full_name: "Name",
    school_name: "School Name",
    student_id: "Student ID"
}


function StudentDetailsModal(props){

    const getStudentInfoFromProp = () => {
        return {
            parent_email: {value: props.student?.parent_email.value},
            full_name: {value: props.student?.full_name.value},
            school_name: {value: props.student?.school_name.value},
            student_id: {value: props.student?.student_id.value},
            index: props.student?.index
        }
    }
    
    const [studentInfo, setStudentInfo] = useState(getStudentInfoFromProp());
    
    useEffect(()=>{
        setStudentInfo(getStudentInfoFromProp())
      },[props.student])
    
    
    
    const onChange = (change) => {
        setStudentInfo({
            ...studentInfo,
            [change.key]: {value: change.value}
        })
    }

    const getTextFieldStudent = (type) => {
        return getEditableTextField(type, TYPE_TITLES[type], studentInfo, onChange, props.student)
    }

    return (
        <Modal dialogClassName="user-modal" show={props.student} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>{props.student?.full_name.value}</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                            {getTextFieldStudent("full_name")}
                            {getTextFieldStudent("student_id")}
                            {getTextFieldStudent("school_name")}
                            {getTextFieldStudent("parent_email")}
                            <ErrorSection transaction={props.student} type='student'/>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="yellowclose" onClick={() => props.saveModal(studentInfo)}>Save</Button>
                    </Container>
                </Modal.Footer>
        </Modal>  
    )
}

StudentDetailsModal.propTypes = {
    student: PropTypes.object,
    closeModal: PropTypes.func,
    saveModal: PropTypes.func,
}

StudentDetailsModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(StudentDetailsModal)

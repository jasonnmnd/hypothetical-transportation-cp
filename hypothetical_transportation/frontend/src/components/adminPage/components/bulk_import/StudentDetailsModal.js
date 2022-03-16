import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';


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

    const getEditableTextField = (type) => {
        if(type == 'address'){
            return <Card>
            <Card.Header as="h4">{TYPE_TITLES[type]}</Card.Header>
            <Card.Body>
                <AddressInputWithMap value={studentInfo[type].value} title={TYPE_TITLES[type]} keyType={type} onSubmit={onChange}/>
            </Card.Body>
        </Card>
        }
        return (
            <Card>
                <Card.Header as="h4">{TYPE_TITLES[type]}</Card.Header>
                <Card.Body>
                    <EditableTextField value={studentInfo[type].value} title={TYPE_TITLES[type]} keyType={type} onSubmit={onChange}/>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Modal dialogClassName="user-modal" show={props.student} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>{props.student?.full_name.value}</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>

                    <Container className="d-flex flex-column justify-content-center">
                        <Row  style={{gap: "10px"}}> 
                            {getEditableTextField("full_name")}
                            {getEditableTextField("student_id")}
                        </Row>
                        <Row  style={{gap: "10px"}}> 
                            {getEditableTextField("school_name")}
                            {getEditableTextField("parent_email")}
                        </Row>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="saveModal" onClick={() => props.saveModal(studentInfo)}>Save</Button>
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

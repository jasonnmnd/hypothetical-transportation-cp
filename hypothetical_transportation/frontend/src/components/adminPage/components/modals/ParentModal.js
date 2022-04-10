import React, { useEffect, useState } from 'react';
import "../modals/modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Card, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import getType from '../../../../utils/user2';
import { addStudent,resetExposedUser } from '../../../../actions/students';



function ParentModal(props) {
    const navigate = useNavigate();
    const [show, setShow]=useState(false);
    const closeModal = () => {
        setShow(false)
        props.resetExposedUser()
        props.setFieldValues({...props.parent, email:""})
    }

    
    const submit = () => {
        props.addStudent({ ...props.student, ["guardian"]: props.exposedUser.id})
        navigate(`/${getType(props.user)}/students/`)  
    }


  useEffect(()=>{
    if(props.exposedUser.id>0){
        setShow(true)
    }
  },[props.exposedUser])

    return (
        <Modal dialogClassName="user-modal" show={show}> 
        {props.exposedUser.groups[0].id==2 ?
        // <div>??</div>
            <div>
                <Modal.Header closeButton onClick={closeModal}>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>This guardian already exists in the database. Would you like to use them instead?</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                    <Card>
                        <Card.Header as="h5">Name</Card.Header>
                        <Card.Body>
                            <Card.Text>{props.exposedUser.full_name}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header as="h5">Email </Card.Header>
                        <Card.Body>
                            <Card.Text>{props.exposedUser.email}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header as="h5">Phone Number </Card.Header>
                        <Card.Body>
                            <Card.Text>{props.exposedUser.phone_number}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Header as="h5">Address </Card.Header>
                        <Card.Body>
                            <Card.Text>{props.exposedUser.address}</Card.Text>
                        </Card.Body>
                    </Card>

                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={closeModal}>Cancel</Button>
                        <Button variant="yellowclose" onClick={submit}>Save</Button>
                    </Container>
                </Modal.Footer>
                </div>
              : 

        // <div>.......</div>
            <div>
                <Modal.Header closeButton onClick={closeModal}>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>This email already exists in the database, but belongs to a privileged user</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className='d-flex flex-row justify-content-center'>
                        <p>Please use a different email if you would like to create a new guardian user.</p>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={closeModal}>Back</Button>
                    </Container>
                </Modal.Footer>
            </div>
        }
        </Modal> 
    
  );
}

ParentModal.propTypes = {
    parent: PropTypes.object,
    student: PropTypes.object,
    setFieldValues: PropTypes.func,
    resetExposedUser: PropTypes.func,
    fieldValue:PropTypes.object,

}

const mapStateToProps = (state) => ({
    exposedUser: state.users.exposedUser,
    user: state.auth.user,
});

export default connect(mapStateToProps, {addStudent,resetExposedUser})(ParentModal)

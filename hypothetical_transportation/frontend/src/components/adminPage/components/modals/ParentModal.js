import React from 'react';
import "../modals/modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



function ParentModal(props) {
    const navigate = useNavigate();


    const closeModal = () => {

    }

    
    const submit = () => {
    }


    return (
        <Modal dialogClassName="user-modal" show={props.exposedUser.id>0}> 
        {/* //onHide={closeModal}> */}
            <Modal.Header closeButton>
                <Container className='d-flex flex-row justify-content-center'>
                    <Modal.Title>This email Already Exists in the database. Would you like to use them instead?</Modal.Title>
                </Container>
            </Modal.Header>

            <Modal.Body>
                <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                    <Button variant="yellowclose" onClick={closeModal}>Cancel</Button>
                    <Button variant="yellowclose" onClick={submit}>Save</Button>
                </Container>
            </Modal.Footer>
        </Modal>  
    
  );
}

ParentModal.propTypes = {
    
}

const mapStateToProps = (state) => ({
    exposedUser: state.users.exposedUser,
});

export default connect(mapStateToProps, {})(ParentModal)

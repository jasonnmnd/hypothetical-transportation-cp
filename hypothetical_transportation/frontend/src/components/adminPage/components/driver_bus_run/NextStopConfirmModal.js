import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';



const TYPE_TITLES = {
    parent_email: "Parent Email",
    full_name: "Name",
    school_name: "School Name",
    student_id: "Student ID"
}


function NextStopConfirmModal(props){

    return (
        <Modal dialogClassName="user-modal" show={props.show} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>Reached Next Stop</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                            Have you arrived at {props.stopAddress}?
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="yellowclose" onClick={() => {props.saveModal(); props.closeModal();}}>Confirm</Button>
                    </Container>
                </Modal.Footer>
        </Modal>  
    )
}

NextStopConfirmModal.propTypes = {
    stopAddress: PropTypes.string,
    show: PropTypes.bool,
    closeModal: PropTypes.func,
    saveModal: PropTypes.func,
}

NextStopConfirmModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(NextStopConfirmModal)

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';



function BusRunStartConfirmModal(props){
    
    


    return (
        <Modal dialogClassName="user-modal" show={props.show} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>Bus Run Start</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                            Warning: {props.errorMessage}. Are you sure you want to start the run?
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="yellowclose" onClick={() => {props.saveModal(); props.closeModal();}}>Start Run</Button>
                    </Container>
                </Modal.Footer>
        </Modal>  
    )
}

BusRunStartConfirmModal.propTypes = {
    errorMessage: PropTypes.string,
    show: PropTypes.bool,
    closeModal: PropTypes.func,
    saveModal: PropTypes.func,
}

BusRunStartConfirmModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(BusRunStartConfirmModal)

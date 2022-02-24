import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Modal, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import { getCurRouteFromStudent, getStudentRouteName } from '../../../../utils/planner_maps';
import "./modal.css";
import { NO_ROUTE } from '../../../../utils/utils';





function SaveChangesModal(props){

    const onContinue = () => {
        props.onContinue();
        props.onCancel();
    }

    const onSave = () => {
        props.onSave();
        onContinue();
    }

    return (
        <Modal show={props.show} onHide={props.onCancel} >
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>Save Changes?</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <h5>{props.text}</h5>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "20px"}}>
                            <Button variant="saveModal" onClick={props.onCancel}>Cancel</Button>
                            <Button variant="saveModal" onClick={onContinue}>Continue without Saving</Button>
                            <Button variant="saveModal" onClick={onSave}>Save and Continue</Button>
                    </Container>
                </Modal.Footer>
        </Modal>  
    )
}

SaveChangesModal.propTypes = {
    show: PropTypes.bool,
    text: PropTypes.string,
    onSave: PropTypes.func,
    onContinue: PropTypes.func,
    onCancel: PropTypes.func
}

SaveChangesModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(SaveChangesModal)

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Modal, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';

import "../modals/modal.css";

import ModifyRouteInfo from '../forms/ModifyRouteInfo';





function CreateRouteModal(props){


    return (
        <>
            <Button variant='yellow' onClick={() => props.setCreateSearchParam("true")}>Add New Route</Button>
            <Modal show={props.show} onHide={() => props.setCreateSearchParam("false")} >
                <Modal.Header closeButton>
                    <Modal.Title>Create Route</Modal.Title>
                </Modal.Header>
                <ModifyRouteInfo onSubmitFunc={(e) => {props.onInfoSubmit(e, true); props.setCreateSearchParam("false")}} />
            </Modal>  
        </>
    )
}

CreateRouteModal.propTypes = {
    show: PropTypes.bool,
    setCreateSearchParam: PropTypes.func,
    onInfoSubmit: PropTypes.func
}



const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(CreateRouteModal)

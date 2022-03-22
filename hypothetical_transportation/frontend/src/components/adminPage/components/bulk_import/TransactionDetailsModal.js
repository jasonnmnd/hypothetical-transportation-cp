import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';
import UserDetailsModal from './UserDetailsModal';
import StudentDetailsModal from './StudentDetailsModal';


function TransactionDetailsModal(props){

    if(props.info == null){
        return null;
    }

    return (
        <>
            {props.modalType == 'user' ? <UserDetailsModal 
                                            user={props.info} 
                                            closeModal={props.closeModal} 
                                            saveModal={props.saveModal}/> 
                                        : <StudentDetailsModal
                                            student={props.info}
                                            closeModal={props.closeModal}
                                            saveModal={props.saveModal}/>
                                        }
        </>
        
    )
}

TransactionDetailsModal.propTypes = {
    modalType: PropTypes.string,
    info: PropTypes.object,
    closeModal: PropTypes.func,
    saveModal: PropTypes.func,
}

TransactionDetailsModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(TransactionDetailsModal)

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';
import ErrorSection from './ErrorSection';
import { getEditableTextField, getEditableTextFieldClass } from '../../../../utils/bulk_import';


const TYPE_TITLES = {
    email: "Email",
    full_name: "Name",
    address: "Address",
    phone_number: "Phone Number"
}


function UserDetailsModal(props){

    const getUserInfoFromProp = () => {
        return {
            email: {value: props.user?.email.value},
            full_name: {value: props.user?.full_name.value},
            address: {value: props.user?.address.value},
            phone_number: {value: props.user?.phone_number.value},
            index: props.user?.index
        }
    }
    
    const [userInfo, setUserInfo] = useState(getUserInfoFromProp());
    
    useEffect(()=>{
        //console.log(props.user)
        setUserInfo(getUserInfoFromProp())
      },[props.user])
    
    
    
    const onChange = (change) => {
        console.log(change)
        setUserInfo({
            ...userInfo,
            [change.key]: {value: change.value}
        })
    }


    const getTextFieldUser = (type) => {
        return getEditableTextField(type, TYPE_TITLES[type], userInfo, onChange, props.user)
    }

    return (
        <Modal dialogClassName="user-modal" show={props.user} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>{props.user?.full_name.value}</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>
                    <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>

                            {getTextFieldUser("email")}
                            {getTextFieldUser("phone_number")}
                            {getTextFieldUser("full_name")}
                            {getTextFieldUser("address")}
                            <ErrorSection transaction={props.user} type='user'/>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="yellowclose" onClick={() => props.saveModal(userInfo)}>Save</Button>
                    </Container>
                </Modal.Footer>
        </Modal>  
    )
}

UserDetailsModal.propTypes = {
    user: PropTypes.object,
    closeModal: PropTypes.func,
    saveModal: PropTypes.func,
}

UserDetailsModal.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(UserDetailsModal)

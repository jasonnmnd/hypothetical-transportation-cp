import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';
import ErrorSection from './ErrorSection';


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
        setUserInfo({
            ...userInfo,
            [change.key]: {value: change.value}
        })
    }

    const getEditableTextField = (type) => {
        if(type == 'address'){
            return <Card>
            <Card.Header as="h4">{TYPE_TITLES[type]}</Card.Header>
            <Card.Body>
                <AddressInputWithMap value={userInfo[type].value} title={TYPE_TITLES[type]} keyType={type} onSubmit={onChange}/>
            </Card.Body>
        </Card>
        }
        return (
            <Card>
                <Card.Header as="h4">{TYPE_TITLES[type]}</Card.Header>
                <Card.Body>
                    <EditableTextField value={userInfo[type].value} title={TYPE_TITLES[type]} keyType={type} onSubmit={onChange}/>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Modal dialogClassName="user-modal" show={props.user} onHide={props.closeModal}>
                <Modal.Header closeButton>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Modal.Title>{props.user?.full_name.value}</Modal.Title>
                    </Container>
                </Modal.Header>

                <Modal.Body>

                    <Container className="d-flex flex-column justify-content-center">
                        <Row  style={{gap: "10px"}}> 
                            {getEditableTextField("email")}
                            {getEditableTextField("phone_number")}
                        </Row>
                        <Row  style={{gap: "10px"}}> 
                            {getEditableTextField("full_name")}
                        </Row>
                        <Row  style={{gap: "10px"}}> 
                            {getEditableTextField("address")}
                        </Row>
                        <Row  style={{gap: "10px"}}> 
                            <ErrorSection transaction={props.user} type='user'/>
                        </Row>
                    </Container>
                </Modal.Body>

                <Modal.Footer>
                    <Container className='d-flex flex-row justify-content-center'>
                        <Button variant="yellowclose" onClick={props.closeModal}>Close</Button>
                        <Button variant="saveModal" onClick={() => props.saveModal(userInfo)}>Save</Button>
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

import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/Header";
import SidebarSliding from "../components/sidebar/SidebarSliding";
import { getUser, updateUser } from "../../../actions/users";
import { register } from "../../../actions/auth";
import AssistedLocationModal from "../components/modals/AssistedLocationModal";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { Form, Button, Row, Col, Container, InputGroup, DropdownButton, Dropdown, FormControl} from 'react-bootstrap';

//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function NEWGeneralEditUserForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    
    const [fieldValues, setFieldValues] = useState({
        full_name: "",
        address: "",
        email: "",
        groups: 1,
        password: ""
    });
    const [address, setAddress] = useState("");

    useEffect(() => {
        if(props.action == "edit"){
            props.getUser(param.id);
            setFieldValues({
                full_name: props.curUser.full_name,
                address: props.curUser.address,
                email: props.curUser.email,
                groups: props.curUser.groups[0].id
            });
            setAddress(props.curUser.address);
        }
    }, []);

    const submit = () => {
        const createVals = {
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address
        }
        if(props.action == "edit"){
            props.updateUser(createVals, param.id);
            navigate(`/admin/users`)
        }
        else{
            props.register(createVals);
            navigate(`/admin/new_student`)
        }
        
    }


    // const confirmation = (e)=>{
    //     e.preventDefault();
    //     setOpenModal(true)
    // }

    // const handleConfirmAddress = () => {
    //     console.log("Address confirmed")
    //     submit()
    //   }
    
    return (
        <div> 
            <Header></Header>
                <Container className="container-main">
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded">

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress2">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control placeholder="Enter name here..." />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>User Type</Form.Label>
                                <InputGroup className="mb-3">
                                    <DropdownButton
                                    variant="outline-secondary"
                                    title="Select..."
                                    id="input-group-dropdown-1"
                                    >
                                    <Dropdown.Item href="#">Administrator</Dropdown.Item>
                                    <Dropdown.Item href="#">Guardian</Dropdown.Item>
                                    </DropdownButton>
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email..." />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password..." />
                            </Form.Group>
                        </Row>
                                                
                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Address</Form.Label>
                            <Form.Control placeholder="1234 Main St" />
                        </Form.Group>

                        <Button variant="yellowsubmit" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
        </div>
    )
}

NEWGeneralEditUserForm.propTypes = {
    getUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    //addSchool: PropTypes.func.isRequired,
    action: PropTypes.string,
    register: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    curUser: state.users.viewedUser

});

export default connect(mapStateToProps, {getUser, updateUser, register})(NEWGeneralEditUserForm)


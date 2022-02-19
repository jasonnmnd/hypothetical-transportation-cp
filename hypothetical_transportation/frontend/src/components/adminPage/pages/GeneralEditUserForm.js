import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/Header";
import { getUser, updateUser } from "../../../actions/users";
import { register } from "../../../actions/auth";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';
import { getItemCoord } from "../../../utils/geocode";
import PageNavigateModal from "../components/modals/PageNavigateModal";
import { resetPostedUser } from "../../../actions/users";
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditUserForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:36.0016944, lng:-78.9480547});
    
    const [fieldValues, setFieldValues] = useState({
        id: 0,
        full_name: "",
        address: "",
        email: "",
        groups: [2],
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
            setCoord({lat: Number(props.curUser.latitude), lng: Number(props.curUser.longitude)})
        }
    }, []);

    useEffect(()=>{
        if(props.action !== "edit"){
            setFieldValues({
                full_name: "",
                address: "",
                email: "",
                groups: [2],
            })
            setAddress("")
            setCoord({lat: 36.0016944, lng: -78.9480547})
        }
    },[props.action])

    useEffect(()=>{
        if(props.action == "edit"){
            setFieldValues({
                full_name: props.curUser.full_name,
                address: props.curUser.address,
                email: props.curUser.email,
                groups: props.curUser.groups[0].id
            });
            setAddress(props.curUser.address);
            setCoord({lat: Number(props.curUser.latitude), lng: Number(props.curUser.longitude)})
        }
    },[props.curUser])

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const createVals = {
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address,
            longitude: coord.lng.toFixed(6),
            latitude: coord.lat.toFixed(6),
        }
        console.log(createVals)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            if(props.action == "edit"){
                props.updateUser(createVals, param.id).then(console.log("EDITED"));
                // setOpenModal(true)
                navigate(`/admin/users`)
            }
            else{
                props.register(createVals);
                // navigate(`/admin/new_student`)
                setOpenModal(true)
            }
        }
        setValidated(true);
    }

    const groupTypes = [
        {name: "Administrator", value: 1},
        {name: "Guardian", value: 2}
    ]


    // const confirmation = (e)=>{
    //     e.preventDefault();
    //     setOpenModal(true)
    // }

    // const handleConfirmAddress = () => {
    //     console.log("Address confirmed")
    //     submit()
    //   }

    const navToNewStudent = ()=>{
        navigate(`/admin/new_student`);
    }

    const navToUsers = ()=>{
        resetPostedUser();
        navigate(`/admin/users`);
    }
    
    return (
        <div> 
            {/* <div>{openModal && <PageNavigateModal closeModal={setOpenModal} yesFunc={navToNewStudent} noFunc={navToUsers} message={`You have created a new User!`} question={`Would you like to navigate to the create a new student for them?`}/>}</div> */}
            <Header></Header>
                <Container className="container-main">
                <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                    {props.action == "edit" ? <h1>Edit User</h1> : <h1>Create User</h1>}
                </div>
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridAddress2">
                                <Form.Label as="h5">Full Name</Form.Label>
                                <Form.Control 
                                required 
                                type="text"
                                placeholder="Enter name..." 
                                value={fieldValues.full_name}
                                onChange={(e)=>{
                                    setFieldValues({...fieldValues, full_name: e.target.value});
                                }}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide a valid name.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label as="h5">User Type</Form.Label>
                                <InputGroup className="mb-3">
                                <ButtonGroup>
                                    {groupTypes.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant={'outline-success'}
                                        name="radio"
                                        value={radio.value}
                                        checked={fieldValues.groups == radio.value}
                                        onChange={(e)=>{
                                            setFieldValues({...fieldValues, groups: e.target.value});
                                        }}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                    ))}
                                </ButtonGroup>
                                </InputGroup>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label as="h5">Email</Form.Label>
                            <Form.Control 
                            required 
                            type="email" 
                            placeholder="Enter email..." 
                            value={fieldValues.email}
                            onChange={
                              (e)=>{
                                setFieldValues({...fieldValues, email: e.target.value});
                                }
                            }/>
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                            </Form.Group>

                            {/* <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label as="h5">Password</Form.Label>
                            <Form.Control 
                            type="password" 
                            placeholder="Enter password..." 
                            value={fieldValues.password}
                            onChange={
                              (e)=>{
                                setFieldValues({...fieldValues, password: e.target.value});
                                }
                            }
                            />
                            </Form.Group> */}
                        </Row>
                                                
                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label as="h5">Address</Form.Label>
                            <Form.Control 
                            required
                            type="text"
                            placeholder="Enter address..." 
                            value={address}
                            onChange={
                              (e)=>{
                                setAddress(e.target.value);
                                getItemCoord(e.target.value,setCoord);
                                }
                            }
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label as="h5">Location Assistance</Form.Label>
                            <AssistedLocationMap address={address} coord={coord} setAddress={setAddress} setCoord={setCoord}></AssistedLocationMap>

                        </Form.Group>

                        <Button variant="yellowsubmit" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
        </div>
    )
}

GeneralEditUserForm.propTypes = {
    getUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    //addSchool: PropTypes.func.isRequired,
    action: PropTypes.string,
    register: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    curUser: state.users.viewedUser

});

export default connect(mapStateToProps, {getUser, updateUser, register})(GeneralEditUserForm)


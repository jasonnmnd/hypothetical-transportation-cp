import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/AdminHeader";
import { getUser, updateUser } from "../../../actions/users";
import { register } from "../../../actions/auth";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';
import { getItemCoord } from "../../../utils/geocode";
import PageNavigateModal from "../components/modals/PageNavigateModal";
import { resetPostedUser } from "../../../actions/users";
import { getSchools } from "../../../actions/schools";
import getType from "../../../utils/user2";

import Select from 'react-select';

//Edit/New user form
function GeneralEditUserForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:36.0016944, lng:-78.9480547});
    const [schoolSelected, setSchoolSelected] = useState([])
    
    const [fieldValues, setFieldValues] = useState({
        id: 0,
        full_name: "",
        address: "",
        email: "",
        groups: 2,
    });
    const [address, setAddress] = useState("");


    useEffect(() => {
        props.getSchools({ordering:"name"});
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
                groups: 2,
            })
            setAddress("")
            setCoord({lat: 36.0016944, lng: -78.9480547})
        }
        else{
            props.getUser(param.id);
        }
    },[props.action])


    // useEffect(()=>{
    //     console.log(schoolSelected)
    // },[schoolSelected])

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
        const finalSchoolList = schoolSelected.map((item)=>{return item.value})
        console.log(finalSchoolList)
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
                navigate(`/${getType(props.user)}/users`)
            }
            else{
                props.register(createVals);
                setOpenModal(true)
            }
        }
        setValidated(true);
    }

    const groupTypes = [
        {name: "Administrator", value: 1},
        {name: "Guardian", value: 2},
        {name: "Driver", value: 3},
        {name: "Staff", value: 4}
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
        navigate(`/${getType(props.user)}/new_student`);
    }

    const navToUsers = ()=>{
        resetPostedUser();
        navigate(`/${getType(props.user)}/users`);
    }

    const [val, setVal] = useState([])

    useEffect(()=>{
        console.log(val)
    },[val])

    // const handleChange = (e)=>{
    //     // var options = e.target.options;
    //     // var value = [];
    //     // for (var i = 0, l = options.length; i < l; i++) {
    //     //   if (options[i].selected) {
    //     //     value.push(options[i].value);
    //     //   }
    //     // }
    //     // setVal(value);
    //     const list = e.map((i)=>{
    //         return i.value
    //     })
    //     setSchoolSelected(list)
    //   }

    const getSchoolOPtion = ()=>{
        var opt = []
        if(props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0){
            const x = props.schoollist.map((item)=> {
                return ({value:item.id, label:item.name})
            })    
            opt = x  
        }
        console.log(opt)
        return opt
    }
    
    return (
        <div> 
            {/* <div>{openModal && <PageNavigateModal closeModal={setOpenModal} yesFunc={navToNewStudent} noFunc={navToUsers} message={`You have created a new User!`} question={`Would you like to navigate to the create a new student for them?`}/>}</div> */}
            <Header></Header>
                <Container className="container-main">
                <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                    {props.action == "edit" ? <h1>Edit User</h1> : <h1>Create User</h1>}
                </div>
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} 
                    onSubmit={handleSubmit}
                    onKeyPress={event => {
                        if (event.key === 'Enter' /* Enter */) {
                          event.preventDefault();
                        }
                      }}
                    >

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
                            {props.user.groups[0] == 1 ? 
                                <Form.Group as={Col}>
                                    <Form.Label as="h5">User Type</Form.Label>
                                    <InputGroup className="mb-3">
                                        <ButtonGroup>
                                            {groupTypes.map((radio, idx) => (
                                            <ToggleButton
                                                key={idx}
                                                id={`radio-${idx}`}
                                                type="radio"
                                                variant={'outline-warning'}
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
                                </Form.Group> : <></>
                            }
                        </Row>
                        {fieldValues.groups ==4 ?
                        <Row className="mb-3">
                            <Form.Group >
                                <Form.Label>Please select schools that this user can manage</Form.Label>
                                {/* <Form.Control
                                    as="select"
                                    multiple
                                    value={val}
                                    onChange={handleChange}
                                >
                                    {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                                    return <option value={u.id} key={i}>{u.name}</option>
                                    }):null}
                                </Form.Control> */}
                                <Select isMulti options={getSchoolOPtion()} value={schoolSelected} onChange={setSchoolSelected}/>
                                {/* <Form.Text muted> hold ctrl or command for multiple select</Form.Text> */}
                            </Form.Group>
                        </Row>:<></>}

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

                            <Form.Group as={Col} md="3" controlId="validationCustom">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control 
                                required
                                type="text" 
                                placeholder="Phone number..."  
                                // value={fieldValues.email}
                                // onChange={
                                //     (e) => setFieldValues({...fieldValues, phoneNumber: e.target.value})
                                // }
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid phone number.
                                </Form.Control.Feedback>
                            </Form.Group>
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
    register: PropTypes.func.isRequired,
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    curUser: state.users.viewedUser,
    schoollist: state.schools.schools.results,
});

export default connect(mapStateToProps, {getSchools, getUser, updateUser, register})(GeneralEditUserForm)


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/AdminHeader";
import { getUser, updateUser } from "../../../actions/users";
import { register } from "../../../actions/auth";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { Card, Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton, Alert} from 'react-bootstrap';
import { getItemCoord } from "../../../utils/geocode";
import PageNavigateModal from "../components/modals/PageNavigateModal";
import { resetPostedUser } from "../../../actions/users";
import { getSchools } from "../../../actions/schools";
import getType from "../../../utils/user2";

import Select from 'react-select';

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


//Edit/New user form
function GeneralEditUserForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:36.0016944, lng:-78.9480547});
    const [schoolSelected, setSchoolSelected] = useState([])
    const [studentChecked, setStudentChecked] = useState(false);

    const handleStudentChecked = () => {
        setStudentChecked(!studentChecked);
    }
    
    const [fieldValues, setFieldValues] = useState({
        id: 0,
        full_name: "",
        address: "",
        email: "",
        phone_number: "",
        groups: 2,
    });
    const [address, setAddress] = useState("");
    const [studentEmail, setStudentEmail] = useState("");


    useEffect(() => {
        props.getSchools({ordering:"name"});
        if(props.action == "edit"){
            props.getUser(param.id);
            setFieldValues({
                full_name: props.curUser.full_name,
                address: props.curUser.address,
                email: props.curUser.email,
                phone_number: props.curUser.phone_number,
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
                phone_number: "",
                groups: 2,
            })
            setAddress("")
            setCoord({lat: 36.0016944, lng: -78.9480547})
        }
        else{
            props.getUser(param.id);
        }
    },[props.action])

    useEffect(()=>{
        var schoolss = props.schoollist.filter((s)=>{
            if(props.curUser.managed_schools!==undefined){
                if(props.curUser.managed_schools.includes(s.id)){
                    return {value:s.id, label:s.name}
                }
            }
        })
        var school22 = schoolss.map((i)=>{return {value:i.id, label:i.name}})
        setSchoolSelected(school22)
    },[props.schoollist, props.curUser])


    // useEffect(()=>{
    //     console.log(schoolSelected)
    // },[schoolSelected])

    useEffect(()=>{
        if(props.action == "edit"){
            setFieldValues({
                full_name: props.curUser.full_name,
                address: props.curUser.address,
                email: props.curUser.email,
                phone_number: props.curUser.phone_number,
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
        // console.log(finalSchoolList)
        const createVals = fieldValues.groups==3 ? {
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address,
            longitude: coord.lng.toFixed(6),
            latitude: coord.lat.toFixed(6),
            managed_schools: finalSchoolList,
        }:{
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address,
            longitude: coord.lng.toFixed(6),
            latitude: coord.lat.toFixed(6),
            managed_schools: []
        }
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
                // console.log(createVals)
                if(fieldValues.groups==2){
                    props.register(createVals, newStudentList);
                }
                else{
                    props.register(createVals, []);
                }
                setOpenModal(true)
            }
        }
        setValidated(true);
    }

    const groupTypes = [
        {name: "Administrator", value: 1},
        {name: "Guardian", value: 2},
        {name: "Driver", value: 4},
        {name: "Staff", value: 3}
    ]

    const PrivilegedGroupType = [
        {name: "Administrator", value: 1},
        {name: "Driver", value: 4},
        {name: "Staff", value: 3}
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

    // useEffect(()=>{
    //     console.log(val)
    // },[val])

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
        // console.log(opt)
        return opt
    }

    const emptyStudent={
        student_id: null,
        full_name: "",
        guardian: "",
        routes: "",
        school: "",
    }
    
    const [createNew,setCreateNew] = useState(false)
    const [newStudent,setNewStudent] = useState(emptyStudent)
    const [studentSchoolSelected, setStudentSchoolSelected] = useState({value: null, label: "-----------------------"})


    const getSchoolforStudent = ()=>{
        var opt = [{value: null, label: "-----------------------"}]
        if(props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0){
            const x = props.schoollist.map((item)=> {
                return ({value:item.id, label:item.name})
            })    
            opt = [...opt, ...x]
        }
        // console.log(opt)
        return opt
    }

    const changeSchool = (e)=>{
        // console.log(e)
        setStudentSchoolSelected(e)
        setNewStudent({...newStudent, ["school"]:e.value, ["routes"]:""})
    
        // props.getRoutesByID({school: e.target.value});
      }
    
    const [newStudentList, setNewStudentList] = useState([])
    const saveStudent = ()=>{
        var list = newStudentList;
        list = list.concat(newStudent);
        setNewStudentList(list);
        setNewStudent(emptyStudent);
        setStudentSchoolSelected({value: null, label: "-----------------------"})
        setCreateNew(false);
    }
    
    useEffect(()=>{
        console.log(newStudentList)
    },[newStudentList])
    
    
    return (
        <div> 
            {/* <div>{openModal && <PageNavigateModal closeModal={setOpenModal} yesFunc={navToNewStudent} noFunc={navToUsers} message={`You have created a new User!`} question={`Would you like to navigate to the create a new student for them?`}/>}</div> */}
            <Header></Header>
                {props.action == "edit" || getType(props.user) == "admin" ?
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
                            {props.user.groups[0] == 1 && props.action=="new"  ? 
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
                                </Form.Group>  :
                                props.action=="edit" && props.user.id!==props.curUser.id && !((fieldValues.groups==2) || (fieldValues.groups==5)) ?
                                    <Form.Group as={Col}>
                                        <Form.Label as="h5">User Type</Form.Label>
                                        <InputGroup className="mb-3">
                                            <ButtonGroup>
                                                {PrivilegedGroupType.map((radio, idx) => (
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
                        {fieldValues.groups ==3 && props.user.groups[0] == 1 ?
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
                                <Form.Text muted> You can type into the box to filter the options</Form.Text>
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
                                <Form.Label><strong>Phone Number</strong></Form.Label>
                                <Form.Control 
                                required
                                type="text" 
                                placeholder="Phone number..."  
                                value={fieldValues.phone_number}
                                onChange={
                                    (e) => setFieldValues({...fieldValues, phone_number: e.target.value})
                                }
                                />
                                {/* <PhoneInput
                                    placeholder="Phone number"
                                    defaultCountry="US"
                                    value={fieldValues.phone_number}
                                    onChange={
                                    (e)=>{
                                        setFieldValues({...fieldValues, phone_number: e.target.value});
                                        }
                                    }
                                    /> */}
                                
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
                        {
                            newStudentList.length>0?
                            <Card  style={{padding: "20px"}}>
                                <Form.Label as="h5">New Students To Be Added</Form.Label>
                                {newStudentList.map((stu, i)=>{
                                    return <Card  style={{padding: "20px"}} id={i}>
                                        <Card.Body>
                                            <Card.Text>{"Name: " + stu.full_name}</Card.Text>
                                            <Card.Text>{"Student ID: " + stu.student_id}</Card.Text>
                                            <Card.Text>{"School: " + props.schoollist.find((el)=>{return el.id===stu.school}).name}</Card.Text>
                                            <Card.Text>{stu.email!==undefined ? ("Email: " + stu.email) : null}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                })}
                            </Card>:
                            <></>
                        }
                        {createNew ? 
                        <Card  style={{padding: "20px"}}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridName" >
                                    <Form.Label as="h5">Full Name</Form.Label>
                                    <Form.Control 
                                    required type="text"
                                    placeholder="Enter name..." 
                                    value={newStudent.name}
                                    onChange={(e)=>{
                                        setNewStudent({...newStudent, ["full_name"]: e.target.value})
                                    }}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Please provide a valid name.</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridID">
                                    <Form.Label as="h5">Student ID</Form.Label>
                                    <Form.Control 
                                    type="text"
                                    placeholder="Enter A Number For Student ID..." 
                                    value={newStudent.student_id==null? "":newStudent.student_id}
                                    onChange={(e)=>{setNewStudent({...newStudent, ["student_id"]: e.target.value===""?null:e.target.value})}}
                                    />
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Please provide a valid ID.</Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="">
                                <Form.Label as="h5">School</Form.Label>
                                <Select  options={getSchoolforStudent()} value={studentSchoolSelected} onChange={changeSchool}/>
                            </Form.Group>



                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridName" >
                                    <Form.Label as="h5">Student Account</Form.Label>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox size="medium" checked={studentChecked} onChange={handleStudentChecked}/>} label="Create Account for this Student" />
                                    </FormGroup>
                                </Form.Group>
                                
                                {studentChecked ?
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label as="h5">Student Email</Form.Label>
                                        <Form.Control 
                                        required 
                                        type="email" 
                                        placeholder="Enter email..." 
                                        value={newStudent.email!==undefined ? newStudent.email : ""}
                                        onChange={
                                        (e)=>{
                                            setNewStudent({...newStudent, ["email"]: e.target.value===""?undefined:e.target.value})
                                            }
                                        }/>
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                                </Form.Group>
                                :
                                <></>
                                }
                            </Row>



                            <Button variant="yellowsubmit" onClick={saveStudent}>
                                Save This Student
                            </Button>
                        </Card>:
                        <></>    
                        }
                        {createNew || props.action=="edit" || fieldValues.groups!==2 ? 
                        <></>:
                        <Button variant="yellowsubmit" onClick={()=>setCreateNew(true)}>
                            Create New Student
                        </Button>
                        }
                        
                        <Button variant="yellowsubmit" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container> : getType(props.user) == "staff" ? 
                <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>You cannot create user with no students attached.</Alert.Heading>
                  <p>
                    Please navigate to create student and select "Create New User" in order to create a new student and user at the same time
                  </p>
                  <hr />
                  <Link to={`/staff/new_student/`}>
                    <Button variant='yellow'>
                        Create New Student
                    </Button>
                </Link>
                  </Alert>
                </Container>:
                <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>Access Denied</Alert.Heading>
                  <p>
                    You do not have access to this page. If you believe this is an error, contact an administrator.          
                    </p>
                  </Alert>
                </Container>}
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


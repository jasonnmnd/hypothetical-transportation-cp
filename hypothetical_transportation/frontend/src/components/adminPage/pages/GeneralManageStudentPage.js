import React, { useState, useEffect } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import { getUsers, getUser,emailExpose } from '../../../actions/users';
import { getStudent, addStudent, updateStudent, addStudentWithParent, updateStudentWithParent } from '../../../actions/students';
import { getRoutesByID } from '../../../actions/routes';
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton, Card, Alert} from 'react-bootstrap';
import { resetPostedUser } from '../../../actions/users';
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import getType from '../../../utils/user2';
import Select from 'react-select';
import { getItemCoord } from "../../../utils/geocode";
import ParentModal from '../components/modals/ParentModal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';




function GeneralManageStudentPage(props) {
    const param = useParams()
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:36.0016944, lng:-78.9480547});
    const [studentChecked, setStudentChecked] = useState(false);

    const handleStudentChecked = () => {
        setStudentChecked(!studentChecked);
        // setObj({...obj, ["phone_number"]: ""});
        // setObj({...obj, ["email"]: null})

    }

    const emptyStudent = {
      student_id: null,
      full_name: "",
      guardian: "",
      routes: "",
      school: "",
      email: null,
      phone_number: "",
    }
  

    const [obj, setObj] = useState(emptyStudent)
    const [parent, setPar] = useState(emptyStudent)

  const setParent = (e)=>{
    if(e.value!=="new"){
      props.getUser(e.value);
    }
    setObj({ ...obj, ["guardian"]: e.value});
    setGuardianSelected(e)
  }
  const [staffSchool, setStaffSchoolSelected] = useState([])


  const handleSubmit = (event) => {
    // console.log(obj)
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if(!studentChecked || (obj.phone_number!=="" && obj.email!=="")){
        if(props.action==="new"){
          if(obj.guardian!=="new"){

            if(studentChecked) {
              props.addStudent(obj);
            }
            else {
              props.addStudent({...obj, ["email"]:null,["phone_number"]:""});
            }
            navigate(`/${getType(props.user)}/students/`)
          }
          else{
            const finalSchoolList = staffSchool.map((item)=>{return item.value})
            // console.log(finalSchoolList)
            const createVals = fieldValues.groups==3 ? {
                ...fieldValues,
                groups:[fieldValues.groups],
                address: address,
                longitude: coord.lng.toFixed(6),
                latitude: coord.lat.toFixed(6),
                managed_schools: finalSchoolList,
            }:{
                ...fieldValues,
                address: address,
                groups:[fieldValues.groups],
                longitude: coord.lng.toFixed(6),
                latitude: coord.lat.toFixed(6),
                managed_schools: []
            }
            setPar(createVals)
            props.emailExpose(createVals.email)
            //hit email expose endpoint
            //if email expose endpoint gives yes, show popup
            //if yes clicked on popup,  props.addStudentWithParent(createVals, obj)
            //else do nothing? don't navigate? Tell user email exist?
          }
        }
        else{
          if(obj.guardian!=="new"){
            if(studentChecked) {
              props.updateStudent(obj,param.id);
            }
            else {
              props.updateStudent({...obj, ["email"]:null,["phone_number"]:""},param.id);
            }
            
          }
          else{
            const createVals = {
              ...fieldValues,
              groups: [fieldValues.groups],
              address: address,
              longitude: coord.lng.toFixed(6),
              latitude: coord.lat.toFixed(6),
            }
            props.updateStudentWithParent(createVals, obj)
          }
          navigate(`/${getType(props.user)}/students/`)
        }
      }
    }
    setValidated(true);
  }


  useEffect(() => {
    if(props.exposedUser.id==-1){
        console.log("?")
        const finalSchoolList = staffSchool.map((item)=>{return item.value})
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
      props.addStudentWithParent(createVals, obj)
      navigate(`/${getType(props.user)}/students/`)
    }
    else{
      console.log("???")
    }
  }, [props.exposedUser]);

  const [schoolSelected, setSchoolSelected] = useState({value: null, label: "-----------------------"})
  const [guardianSelected, setGuardianSelected] = useState({value: null, label: "-----------------------"})
  const changeSchool = (e)=>{
    // console.log(e)
    setSchoolSelected(e)
    setObj({...obj, ["school"]:e.value, ["routes"]:""})

    // props.getRoutesByID({school: e.target.value});
  }

  const getTitle = () => {
    return props.action + " student"
  }


  useEffect(() => {
    props.getSchools({ordering:"name"});
    props.getUsers({ordering:"email", groups:2});
    if(props.action==="edit"){
      props.getStudent(param.id);
      setObj({...props.student, ["guardian"]:props.student.guardian.id,["school"]:props.student.school.id,["routes"]:props.student.routes?props.student.routes.id:null})
      setSchoolSelected({value: props.student.school.id, label: props.student.school.name})
      setGuardianSelected({value: props.student.guardian.id, label: props.student.guardian.email})
      props.resetPostedUser()

      // props.getRoutesByID({school: props.student.school.id}) // Normal to get an api request error on first load
    }
    else{
      setSchoolSelected({value: null, label: "-----------------------"})
      setGuardianSelected({value: null, label: "-----------------------"})
    }
    // console.log("also")
    // console.log(props.selectedUser)
    if(props.selectedUser!==null && props.selectedUser.id!==0&& props.selectedUser.id!==obj.guardian){
      // console.log("setting obj")
      setObj({ ...obj, ["guardian"]: props.selectedUser.id});
      setGuardianSelected({value: props.selectedUser.id, label: props.selectedUser.email})  
      props.resetPostedUser()
    }
    // else{
    //   props.getRoutesByID({school: obj.school})
    // }
    
  }, []);


  useEffect(() => {
      setObj({...props.student, ["guardian"]:props.student.guardian.id,["school"]:props.student.school.id,["routes"]:props.student.routes?props.student.routes.id:null})
      setSchoolSelected({value: props.student.school.id, label: props.student.school.name})
      setGuardianSelected({value: props.student.guardian.id, label: props.student.guardian.email})
  }, [props.student]);

  useEffect(()=>{
    // console.log(props.selectedUser)
    if(props.selectedUser!==null && props.selectedUser.id!==0 && props.selectedUser.id!==obj.guardian){
      // console.log("setting obj useeffecgt selecteds user")
      setObj({ ...obj, ["guardian"]: props.selectedUser.id});
    }
  },[props.selectedUser])


  const getSchoolOPtion = ()=>{
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


const getParentOption = ()=>{
  var opt = [{value: null, label: "-----------------------"}, {value: "new", label: "---Create New User---"}]
  if(props.users!==null && props.users!==undefined && props.users.length!==0){
      const x = props.users.map((item)=> {
          return ({value:item.id, label:item.email})
      })    
      opt = [...opt, ...x]
  }
  // console.log(opt)
  return opt
}


  const [newParent, setNewParent] = useState(false)
  useEffect(()=>{
    // console.log(props.selectedUser)
    // console.log(obj.guardian)
    if(obj.guardian=="new"){
      setNewParent(true)
    }
    else{
      setNewParent(false)
    }
  },[obj.guardian])

  const [fieldValues, setFieldValues] = useState({
    id: 0,
    full_name: "",
    address: "",
    email: "",
    groups: 2,
});
const [address, setAddress] = useState("");

const groupTypes = [
  {name: "Administrator", value: 1},
  {name: "Guardian", value: 2},
  {name: "Driver", value: 4},
  {name: "Staff", value: 3}
]


  useEffect(()=>{
    if(props.action !== "edit"){
      if(props.selectedUser!==null && props.selectedUser.id!==0 && props.selectedUser.id!==obj.guardian){
        // console.log("action if")
        setObj({ ...emptyStudent, ["guardian"]: props.selectedUser.id});
        setGuardianSelected({value: props.selectedUser.id, label: props.selectedUser.email})  
        props.resetPostedUser()
      }
      else{
        // console.log("action else")
        setObj({...emptyStudent, ["guardian"]: obj.guardian})
        setSchoolSelected({value: null, label: "-----------------------"})
        setGuardianSelected({value: null, label: "-----------------------"})
      }
    }
    else{
      props.getStudent(param.id);
    }
  },[props.action])

useEffect(()=>{
  if(props.action == "edit"){
    setObj({...props.student, ["guardian"]:props.student.guardian.id,["school"]:props.student.school.id,["routes"]:props.student.routes?props.student.routes.id:null})
    if(props.student.email!==undefined && props.student.email!==null && props.student.phone_number!==undefined && props.student.phone_number!==""){
      setStudentChecked(true)
    }
  }

},[props.student])


    return ( 
      <>
        <Header></Header>
        <ParentModal student={obj} parent={parent} fieldValue={fieldValues} setFieldValues={setFieldValues}/>
        {getType(props.user) == "staff"  || getType(props.user) == "admin" ?
        <Container className="container-main">
          <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}
            onKeyPress={event => {
              if (event.key === 'Enter' /* Enter */) {
                event.preventDefault();
              }
            }}
            >
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridName" >
                <Form.Label as="h5">Full Name</Form.Label>
                <Form.Control 
                required type="text"
                placeholder="Enter name..." 
                value={obj.full_name}
                onChange={(e)=>{
                  setObj({...obj, ["full_name"]: e.target.value})
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
                value={obj.student_id==null? "":obj.student_id}
                onChange={(e)=>{setObj({...obj, ["student_id"]: e.target.value===""?null:e.target.value})}}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please provide a valid ID.</Form.Control.Feedback>
            </Form.Group>
            </Row>
            
            <Form.Group className="mb-3" controlId="">
              <Form.Label as="h5">Guardian</Form.Label>
                <Select  options={getParentOption()} value={guardianSelected} onChange={setParent}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="">
                <Form.Label as="h5">School</Form.Label>
                <Select  options={getSchoolOPtion()} value={schoolSelected} onChange={changeSchool}/>
            </Form.Group>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridName" >
                    <Form.Label as="h5">Student Account</Form.Label>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox size="medium" checked={studentChecked} onChange={handleStudentChecked}/>} label="Create Account for this Student" />
                    </FormGroup>
                </Form.Group>
                
            </Row>
                {studentChecked ?
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridEmail">
                      <Form.Label as="h5">Student Email</Form.Label>
                          <Form.Control 
                          required 
                          type="email" 
                          placeholder="Enter email..." 
                          value={obj.email}
                          onChange={
                          (e)=>{
                              setObj({...obj, ["email"]: e.target.value})
                              }
                          }/>
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPhone">
                      <Form.Label as="h5">Phone Number</Form.Label>
                          <Form.Control 
                          required 
                          type="text" 
                          placeholder="Enter phone number..." 
                          value={obj.phone_number}
                          onChange={
                          (e)=>{
                            setObj({...obj, ["phone_number"]: e.target.value})
                              }
                          }/>
                          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Row>
                :
                <></>
                }

            { newParent===true ? 
              <>
              <br></br>
              <Card style={{padding: "20px"}}>
              <h4>Create Users</h4>
              <br></br>
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
                  {/* {props.user.groups[0] == 1 ? 
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
                } */}
              </Row>

              {/* {fieldValues.groups ==3 ?
                <Row className="mb-3">
                  <Form.Group >
                      <Form.Label>Please select schools that this user can manage</Form.Label>
                      <Select isMulti options={getSchoolOPtion()} value={staffSchool} onChange={setStaffSchoolSelected}/>
                      <Form.Text muted> You can type into the box to filter the options</Form.Text>
                  </Form.Group>
                </Row>:<></>} */}

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
              </Card>
              <p> </p>
            </> : <></>
            }
            

            <Button variant="yellowsubmit" type="submit">
                Submit
            </Button>

          {/* </Row> */}
          </Form>

        </Container>:
        <Container className="container-main">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You do not have access to this page. If you believe this is an error, contact an administrator.          
            </p>
          </Alert>
        </Container>}
      </>
        );
}

GeneralManageStudentPage.propTypes = {
    action: PropTypes.string,
    getSchools: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    getStudent: PropTypes.func.isRequired,
    getRoutesByID: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    addStudent: PropTypes.func.isRequired,
    updateStudent: PropTypes.func.isRequired,
    resetPostedUser: PropTypes.func.isRequired,
    addStudentWithParent: PropTypes.func.isRequired,
    updateStudentWithParent: PropTypes.func.isRequired,
    emailExpose: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  schoollist: state.schools.schools.results,
  users: state.users.users.results,
  student: state.students.viewedStudent,
  routes: state.routes.routes.results,
  selectedUser: state.users.postedUser,
  exposedUser: state.users.exposedUser,
});

export default connect(mapStateToProps, {getSchools, getUsers, getStudent, getRoutesByID, getUser, addStudent, updateStudent,resetPostedUser,emailExpose, addStudentWithParent,updateStudentWithParent})(GeneralManageStudentPage)

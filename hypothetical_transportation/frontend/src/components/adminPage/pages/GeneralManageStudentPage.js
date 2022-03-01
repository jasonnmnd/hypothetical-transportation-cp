import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import { getUsers, getUser } from '../../../actions/users';
import { getStudent, addStudent, updateStudent, addStudentWithParent, updateStudentWithParent } from '../../../actions/students';
import { getRoutesByID } from '../../../actions/routes';
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';
import { resetPostedUser } from '../../../actions/users';
import AssistedLocationMap from "../../maps/AssistedLocationMap";


function GeneralManageStudentPage(props) {
    const param = useParams()
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:36.0016944, lng:-78.9480547});


    const emptyStudent={
      student_id: "",
      full_name: "",
      guardian: "",
      routes: "",
      school: "",
    }
  


    const [obj, setObj] = useState(emptyStudent)



  const setParent = (e)=>{
    if(e.target.value!=="new"){
      props.getUser(e.target.value);
    }
    setObj({ ...obj, ["guardian"]: e.target.value});
  }


  const handleSubmit = (event) => {
    // console.log(obj)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if(props.action==="new"){
        if(obj.guardian!=="new"){
          props.addStudent(obj)
        }
        else{
          const createVals = {
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address,
            longitude: coord.lng.toFixed(6),
            latitude: coord.lat.toFixed(6),
          }
          props.addStudentWithParent(createVals, obj)
        }
        navigate(`/admin/students/`)
      }
      else{
        if(obj.guardian!=="new"){
          props.updateStudent(obj,param.id);
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
        navigate(`/admin/students/`)
      }
    }
    setValidated(true);

  }

  const changeSchool = (e)=>{
    setObj({...obj, ["school"]:e.target.value, ["routes"]:""})

    // props.getRoutesByID({school: e.target.value});
  }

  const getTitle = () => {
    return props.action + " student"
  }


  useEffect(() => {
    props.getSchools();
    props.getUsers();
    if(props.action==="edit"){
      props.getStudent(param.id);
      setObj({...props.student, ["guardian"]:props.student.guardian.id,["school"]:props.student.school.id,["routes"]:props.student.routes?props.student.routes.id:null})
      props.resetPostedUser()

      // props.getRoutesByID({school: props.student.school.id}) // Normal to get an api request error on first load
    }
    // console.log("also")
    // console.log(props.selectedUser)
    if(props.selectedUser!==null && props.selectedUser.id!==0&& props.selectedUser.id!==obj.guardian){
      // console.log("setting obj")
      setObj({ ...obj, ["guardian"]: props.selectedUser.id});
      props.resetPostedUser()
    }
    // else{
    //   props.getRoutesByID({school: obj.school})
    // }
    
  }, []);

  useEffect(()=>{
    // console.log(props.selectedUser)
    if(props.selectedUser!==null && props.selectedUser.id!==0 && props.selectedUser.id!==obj.guardian){
      // console.log("setting obj useeffecgt selecteds user")
      setObj({ ...obj, ["guardian"]: props.selectedUser.id});
    }
  },[props.selectedUser])


  const [newParent, setNewParent] = useState(false)
  useEffect(()=>{
    // console.log(props.selectedUser)
    if(obj.guardian=="new"){
      setNewParent(true)
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
  {name: "Guardian", value: 2}
]


  useEffect(()=>{
    if(props.action !== "edit"){
      if(props.selectedUser!==null && props.selectedUser.id!==0 && props.selectedUser.id!==obj.guardian){
        // console.log("action if")
        setObj({ ...emptyStudent, ["guardian"]: props.selectedUser.id});
        props.resetPostedUser()
      }
      else{
        // console.log("action else")
        setObj({...emptyStudent, ["guardian"]: obj.guardian})
      }
    }
    else{
      props.getStudent(param.id);
    }
  },[props.action])

useEffect(()=>{
  if(props.action == "edit"){
    setObj({...props.student, ["guardian"]:props.student.guardian.id,["school"]:props.student.school.id,["routes"]:props.student.routes?props.student.routes.id:null})
  }

},[props.student])


    return ( 
      <>
        <Header></Header>
        {/* <div className='admin-edit-page'>
        <form>
            <div className="submit-form-content"> 
                <div className="form-inner">
                    <h2>{getTitle()}</h2>

                    <div className="form-group">
                      <label htmlFor={"Full Name"}>Name</label>
                      <input
                          className="input"
                          type={"Full Name"}
                          name={"Full Name"}
                          id={"Full Name"}
                          value={obj.full_name}
                          onChange={(e)=>{
                              setObj({...obj, ["full_name"]: e.target.value})
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Student ID"}>Student ID</label>
                      <input
                          className="input"
                          type={"id"}
                          name={"Student ID"}
                          id={"Student ID"}
                          value={obj.student_id}
                          onChange={(e)=>{setObj({...obj, ["student_id"]: e.target.value})}}
                      />
                  </div>

                  <div className="form-group">
                      <label>
                        <label>Parent</label>
                        <select value={obj.guardian} onChange={setParent}>
                          <option value={""} >{"-----"}</option>
                          {props.users!==null && props.users!==undefined && props.users.length!==0?props.users.map((u,i)=>{
                              return <option value={u.id} key={i}>{u.email}</option>
                          }):null}
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label>
                        <label>School</label>
                        <select value={obj.school} onChange={changeSchool}>
                        <option value={"null"} >{"-----"}</option>
                        {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                            return <option value={u.id} key={i}>{u.name}</option>
                        }):null}
                        </select>
                      </label>
                  </div>
                    <div className="divider15px" />
                    
                    <div className="center-buttons">
                      <button onClick={submit}>Save</button>
                    </div>
                </div>
              </div>
            </form>
        </div> */}
        <Container className="container-main">
          <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}>
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

            <Form.Group className="mb-3" controlId="">
                <Form.Label as="h5">Parent</Form.Label>
                <Form.Select size="sm" value={obj.guardian} onChange={setParent}>
                <option value={""}>{"-----"}</option>
                <option value={"new"}>{"---Create New User---"}</option>
                {props.users!==null && props.users!==undefined && props.users.length!==0?props.users.map((u,i)=>{
                    return <option value={u.id} key={i}>{u.email}</option>
                }):null}
                </Form.Select>
            </Form.Group>


            <Form.Group className="mb-3" controlId="">
                <Form.Label as="h5">School</Form.Label>
                <Form.Select size="sm" value={obj.school} onChange={changeSchool}>
                  <option value={""} >{"-----"}</option>
                    {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                        return <option value={u.id} key={i}>{u.name}</option>
                    }):null}
                </Form.Select>
            </Form.Group>

            { newParent===true ? 
              <>

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
            </> : <></>
            }
            

            <Button variant="yellowsubmit" type="submit">
                Submit
            </Button>

          </Row>
          </Form>

        </Container>
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
    updateStudentWithParent: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
  schoollist: state.schools.schools.results,
  users: state.users.users.results,
  student: state.students.viewedStudent,
  routes: state.routes.routes.results,
  selectedUser: state.users.postedUser
});

export default connect(mapStateToProps, {getSchools, getUsers, getStudent, getRoutesByID, getUser, addStudent, updateStudent,resetPostedUser,addStudentWithParent,updateStudentWithParent})(GeneralManageStudentPage)

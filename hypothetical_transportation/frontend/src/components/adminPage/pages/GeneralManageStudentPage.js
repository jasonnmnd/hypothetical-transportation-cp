import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import { getUsers, getUser } from '../../../actions/users';
import { getStudent, addStudent, updateStudent } from '../../../actions/students';
import { getRoutesByID } from '../../../actions/routes';
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';
import { resetPostedUser } from '../../../actions/users';

function GeneralManageStudentPage(props) {
    const param = useParams()
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const emptyStudent={
      student_id: null,
      full_name: "",
      guardian: "",
      routes: "",
      school: "null",
    }
  


    const [obj, setObj] = useState(emptyStudent)



  const setParent = (e)=>{
    props.getUser(e.target.value);
    setObj({ ...obj, ["guardian"]: e.target.value});
  }


  const handleSubmit = (event) => {
    console.log(obj)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if(props.action==="new"){
        props.addStudent(obj)
        navigate(`/admin/students/`)
      }
      else{
        props.updateStudent(obj,param.id);
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
      // props.getRoutesByID({school: props.student.school.id}) // Normal to get an api request error on first load
    }
    if(props.selectedUser!==null && props.selectedUser.id!==0){
      setObj({ ...obj, ["guardian"]: props.selectedUser.id});
      resetPostedUser();
    }
    // else{
    //   props.getRoutesByID({school: obj.school})
    // }
    
  }, []);


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
                placeholder="Enter name..." 
                value={obj.student_id}
                onChange={(e)=>{setObj({...obj, ["student_id"]: e.target.value})}}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Please provide a valid ID.</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="">
                <Form.Label as="h5">Parent</Form.Label>
                <Form.Select size="sm" value={obj.guardian} onChange={setParent}>
                <option value={""}>{"-----"}</option>:
                {props.users!==null && props.users!==undefined && props.users.length!==0?props.users.map((u,i)=>{
                    return <option value={u.id} key={i}>{u.email}</option>
                }):null}
                </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="">
                <Form.Label as="h5">School</Form.Label>
                <Form.Select size="sm" value={obj.school} onChange={changeSchool}>
                  <option value={"null"} >{"-----"}</option>
                    {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                        return <option value={u.id} key={i}>{u.name}</option>
                    }):null}
                </Form.Select>
            </Form.Group>

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
    updateStudent: PropTypes.func.isRequired
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

export default connect(mapStateToProps, {getSchools, getUsers, getStudent, getRoutesByID, getUser, addStudent, updateStudent})(GeneralManageStudentPage)

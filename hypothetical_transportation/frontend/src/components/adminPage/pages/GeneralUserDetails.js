import React, {Fragment,useEffect, useState} from 'react';
import Header from '../../header/AdminHeader';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUser, deleteUser } from '../../../actions/users';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import isAdmin from '../../../utils/user';
import { Container, Card, Button, Row, Col, Alert } from 'react-bootstrap'
import getType from '../../../utils/user2'
import { getSchools } from '../../../actions/schools';
import {getRunByDriver} from '../../../actions/drive';

function AdminUserDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    props.deleteUser(parseInt(param.id))
    navigate(`/${getType(props.curUser)}/users/`)
  }


  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.guardian = param.id;
      props.getStudents(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
    
  }, [searchParams]);

  useEffect(() => {
    props.getSchools({ordering:"name"});
    props.getUser(param.id);
  }, []);

  const [managed_school, setManagedSchool] = useState([])
  useEffect(() => {
    if(props.user.groups[0].id==3){
      const schoolList = props.user.managed_schools.map((sch)=>{
        return props.schools.filter(i => {
          return i.id===sch
        })
      }).map((item)=>{
        return item[0]
      })
      // console.log(schoolList)
      setManagedSchool(schoolList)
    }
  }, [props.user,props.schools]);

  useEffect(() => {
    props.getRunByDriver(props.user.id)
  }, [props.user]);


  return (
    <div>        
      <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
      <Header></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        {isAdmin(props.curUser)?
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/${getType(props.curUser)}/edit/user/${props.user.id}`}>
                        <Button variant="yellowLong" size="lg">Edit User</Button>
                    </Link>
                </Col>

                <Col>
                    <Button variant="yellowLong" size="lg" onClick={() => {
                      setOpenModal(true);
                    }}>Delete User</Button>
                </Col>
            </Row>
        </Container>:<></>}


        {(props.currentRun!==undefined && props.currentRun!==null  && props.currentRun.id!==undefined && props.currentRun.id!==null ) ?
          <Alert variant="success">
              <Alert.Heading>Driver is currently in transit!</Alert.Heading>
              <p>
                  Bus Number: {props.currentRun.bus_number}
              </p>
                  
              <Link to={`/${getType(props.curUser)}/route/${props.currentRun.route.id}/`}>
                  Route: {props.currentRun.route.name}
              </Link>
          </Alert>:<></>
      }


        <Row  style={{gap: "10px"}}> 
          <Card  as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Name</Card.Header>
              <Card.Body>
                  <Card.Text>{props.user.full_name}</Card.Text>
              </Card.Body>
          </Card>
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">User Type </Card.Header>
              <Card.Body>
                  <Card.Text>{props.user.groups[0].name}</Card.Text>
              </Card.Body>
          </Card>
          
        </Row>
        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Phone Number </Card.Header>
              <Card.Body>
                  <Card.Text>{props.user.phone_number}</Card.Text>
              </Card.Body>
          </Card>
          <Card  as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Email </Card.Header>
              <Card.Body>
                  <Card.Text>{props.user.email}</Card.Text>
              </Card.Body>
          </Card>
        </Row>
        <Row  style={{gap: "10px"}}> 
          <Card as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">Address </Card.Header>
              <Card.Body>
                  <Card.Text>{props.user.address}</Card.Text>
              </Card.Body>
          </Card>
          {props.user.groups[0].id==3 ? 
            <Card  as={Col} style={{padding: "0px"}}>
                <Card.Header as="h5">Managed Schools </Card.Header>
                <Card.Body>
                    <Card.Text>{managed_school.map((sch, i)=>{
                      return <Fragment key={i}>{sch!==undefined? sch.name: null}<br></br></Fragment>
                    })}</Card.Text>
                </Card.Body>
            </Card> 
            : <></>}
        </Row>
        <Row  style={{gap: "10px"}}> 
          <Card  as={Col} style={{padding: "0px"}}>
              <Card.Header as="h5">List of Students</Card.Header>
              <Card.Body>
                  <GeneralAdminTableView values={props.students} tableType='student' title='Students' search={null} totalCount={props.studentCount} />
              </Card.Body>
          </Card>
        </Row>
      </Container>

      <br></br>
    </div>
  );
}

AdminUserDetails.propTypes = {
    getUser: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    getSchools: PropTypes.func.isRequired,
    getRunByDriver: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  curUser: state.auth.user,
  user: state.users.viewedUser,
  token: state.auth.token,
  students: state.students.students.results,
  studentCount: state.students.students.count,
  schools: state.schools.schools.results,
  currentRun: state.drive.currentRun,
});

export default connect(mapStateToProps, {getSchools,getUser, getStudents, deleteUser, getRunByDriver})(AdminUserDetails)

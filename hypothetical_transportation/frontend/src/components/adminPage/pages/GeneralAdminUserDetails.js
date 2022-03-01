import React, {useEffect, useState} from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../adminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUser, deleteUser } from '../../../actions/users';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import isAdmin from '../../../utils/user';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

function AdminUserDetails(props) {
  const navigate = useNavigate();
  const param = useParams();

  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    props.deleteUser(parseInt(param.id))
    navigate(`/admin/users/`)
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
    props.getUser(param.id);
  }, []);

  return (
    <div>        
      <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
      <Header></Header>
      <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        {isAdmin(props.curUser)?
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={`/admin/edit/user/${props.user.id}`}>
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
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.user.full_name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Email </Card.Header>
            <Card.Body>
                <Card.Text>{props.user.email}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Address </Card.Header>
            <Card.Body>
                <Card.Text>{props.user.address}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Admin </Card.Header>
            <Card.Body>
                <Card.Text>{isAdmin(props.user) ? "true":"false"}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">List of Students</Card.Header>
            <Card.Body>
                <GeneralAdminTableView values={props.students} tableType='student' title='Students' search={null} totalCount={props.studentCount} />
            </Card.Body>
        </Card>
      </Container>

      <br></br>
    </div>
  );
}

AdminUserDetails.propTypes = {
    getUser: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  curUser: state.auth.user,
  user: state.users.viewedUser,
  token: state.auth.token,
  students: state.students.students.results,
  studentCount: state.students.students.count
});

export default connect(mapStateToProps, {getUser, getStudents, deleteUser})(AdminUserDetails)

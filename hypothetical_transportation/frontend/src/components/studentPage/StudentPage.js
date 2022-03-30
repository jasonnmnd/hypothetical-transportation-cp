import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { getStudentInfo } from '../../actions/students';
import ParentHeader from '../header/ParentHeader';
import { Row, Card, Container, Col } from 'react-bootstrap';



function StudentPage(props) {


  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    props.getStudentInfo(param.id);
  }, []);

  return (
    <div>
        <ParentHeader></ParentHeader>

        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <Row  style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Name</Card.Header>
                    <Card.Body>
                        <Card.Text>{student.full_name}</Card.Text>
                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">StudentID </Card.Header>
                    <Card.Body>
                        <Card.Text>{student.student_id}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    </div>
  )
}

StudentPage.propTypes = {

}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    
});


export default connect(mapStateToProps, {logout} )(StudentPage)
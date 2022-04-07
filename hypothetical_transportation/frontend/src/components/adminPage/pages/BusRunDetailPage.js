import React, { useEffect, useState } from 'react';
import Header from '../../header/AdminHeader';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "../NEWadminPage.css";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card, Button, Row, Col, Alert, ButtonGroup } from 'react-bootstrap';
import isAdmin from '../../../utils/user';
import getType from '../../../utils/user2';
import { getRunByRunId } from '../../../actions/drive';

function BusRunDetailPage(props) {
  const param = useParams();

  useEffect(() => {
    props.getRunByRunId(param.run_id)
  }, []);

  if(props.currentRun == null || props.currentRun.bus_number == null){
      return <Header></Header>
  }

  return (
    <div>  
        <Header></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <Row  style={{gap: "10px"}}>

                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Driver </Card.Header>
                    <Card.Body>
                        <Link to={`/${getType(props.user)}/user/${props.currentRun.driver.id}?pageNum=1`}>
                            <h5>{props.currentRun.driver.full_name}</h5>
                        </Link>
                        
                        <Card.Text><strong>Email: </strong> {props.currentRun.driver.email}</Card.Text>
                        <Card.Text><strong>Phone: </strong> {props.currentRun.driver.phone_number}</Card.Text>


                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Bus Number </Card.Header>
                    <Card.Body>
                        <Card.Text>{props.currentRun.bus_number}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            <Row  style={{gap: "10px"}}>


                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">School </Card.Header>
                    <Card.Body>
                        <Link to={`/${getType(props.user)}/school/${props.currentRun.school.id}?stupageNum=1&roupageNum=1`}>
                            <h5>{props.currentRun.school.name}</h5>
                        </Link>
                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Route </Card.Header>
                    <Card.Body>
                        <Link to={`/${getType(props.user)}/route/${props.currentRun.route.id}?pageNum=1`}>
                            <h5>{props.currentRun.route.name}</h5>
                        </Link>
                    </Card.Body>
                </Card>
            </Row>
            <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Direction</Card.Header>
                    <Card.Body>
                        <Card.Text>{props.currentRun.going_towards_school ? "Toward School" : "Away From School"}</Card.Text>
                    </Card.Body>
                </Card>
                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Timing Details </Card.Header>
                    <Card.Body>
                        <Card.Text>{props.currentRun.start_time}</Card.Text>
                        <Card.Text>{props.currentRun.duration}</Card.Text>
                    </Card.Body>
                </Card>
                

            </Row>
        </Container>

        <br></br>
    </div>
  );
}

BusRunDetailPage.propTypes = {
    getRunByRunId: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
  currentRun: state.drive.currentRun
});

export default connect(mapStateToProps, {getRunByRunId})(BusRunDetailPage)

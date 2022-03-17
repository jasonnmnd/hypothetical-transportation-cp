import React, { useState, useEffect } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRouteInfo } from '../../../actions/routes';
import { getStopInfo, deleteStop } from '../../../actions/stops';
import { getStudents } from '../../../actions/students';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import isAdmin from '../../../utils/user'
import getType from '../../../utils/user2'

function GeneralAdminStopDetails(props) {


  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const param = useParams();
  let [searchParams, setSearchParams] = useSearchParams();


  const handleConfirmDelete = () => {
    props.deleteStop(parseInt(param.stop_id));
    navigate(`/${getType(props.user)}/route/${props.stop.route}`);
  }
  
  //things that need to be on the map: this stop, students in the route (and complete or not)
  useEffect(() => {
    props.getStopInfo(param.stop_id);
  }, []);

  useEffect(()=>{
    props.getRouteInfo(props.stop.route);
    let paramsToSend = Object.fromEntries([...searchParams]);
    paramsToSend.routes = props.stop.route;
    props.getStudents(paramsToSend);
  },[props.stop]);


  //info fields: name, location, which route it belongs to?
  //a map showing the students in the corresponding route and this stop only?
  //delete stop button
  return (
    <div>  
      <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
      <Header></Header>      
      <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
      {isAdmin(props.user)?
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                  <Link to={`/${getType(props.user)}/route/plan/${props.viewedRoute.school.id}?route=${props.viewedRoute.id}&view=1`}>
                    <Button variant="yellowLong" size="lg">Edit Stop</Button>
                  </Link>
                </Col>
                <Col>
                    <Button variant="yellowLong" size="lg" onClick={() => {
                    setOpenModal(true);
                    }}>Delete Stop</Button>
                </Col>
            </Row>
        </Container>:<></>}
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.stop!==null && props.stop!==undefined && props.stop.name!==null && props.stop.name!==undefined  ? props.stop.name:"Falling Star"}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Location </Card.Header>
            <Card.Body>
                <Card.Text>{props.stop!==null && props.stop!==undefined && props.stop.name!==null && props.stop.name!==undefined ? props.stop.location : "On the Other Side of Moon"}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Pickup Time </Card.Header>
            <Card.Body>
                <Card.Text>{props.stop!==null && props.stop!==undefined && props.stop.pickup_time!==null && props.stop.pickup_time!==undefined  ? props.stop.pickup_time : "Crack of Dawn"}</Card.Text>
            </Card.Body>
        </Card>


        <Card>
            <Card.Header as="h5">Dropoff Time </Card.Header>
            <Card.Body>
                <Card.Text>{props.stop!==null && props.stop!==undefined && props.stop.dropoff_time!==null && props.stop.dropoff_time!==undefined ? props.stop.dropoff_time : "The End of World"}</Card.Text>
            </Card.Body>
        </Card>


        <Card>
            <Card.Header as="h5">Associated Route </Card.Header>
            <Card.Body>
                <Link to={`/${getType(props.user)}/route/${props.stop.route}`}>
                  <Button variant='yellow'><h5>{props.viewedRoute!==null && props.viewedRoute!==undefined && props.viewedRoute.name!==null && props.viewedRoute.name!==undefined&& props.viewedRoute.name!=="" ? props.viewedRoute.name: "The Hogwarts Express"}</h5></Button>
                </Link>
            </Card.Body>
        </Card>

        {/* <Card>
            <Card.Header as="h5">Map Of Stop and All Students In The Route Related To The Stop </Card.Header>
            <Card.Body>
            </Card.Body>
        </Card> */}
      </Container>

      <br></br>
  </div>

  )
}

GeneralAdminStopDetails.propTypes = {
    getStudents: PropTypes.func.isRequired,
    getStopInfo: PropTypes.func.isRequired,
    getRouteInfo: PropTypes.func.isRequired,
    deleteStop: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  stop: state.stop.viewedStop,
  viewedRoute: state.routes.viewedRoute,
  students: state.students.students.results
});

export default connect(mapStateToProps, {getStopInfo,deleteStop,getStudents,getRouteInfo})(GeneralAdminStopDetails)


import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';
import { getRouteInfo, deleteRoute } from '../../../actions/routes';
import { getStopInfo, deleteStop } from '../../../actions/stops';
import { getStudents } from '../../../actions/students';
import MapContainer from '../../maps/MapContainer';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'


function GeneralAdminStopDetails(props) {


  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const param = useParams();
  let [searchParams, setSearchParams] = useSearchParams();


  const handleConfirmDelete = () => {
    props.deleteStop(parseInt(param.stop_id));
    navigate(`/admin/route/${param.route_id}`);
  }
  
  //things that need to be on the map: this stop, students in the route (and complete or not)
  useEffect(() => {
    props.getStopInfo(param.stop_id);
    let paramsToSend = Object.fromEntries([...searchParams]);
    paramsToSend.routes = param.route_id;
    props.getStudents(paramsToSend);

  }, []);


  //info fields: name, location, which route it belongs to?
  //a map showing the students in the corresponding route and this stop only?
  //delete stop button
  return (
    <div>  
      <Header></Header>
      <div>{openModal && <DeleteModal closeModal={setOpenModal} handleConfirmDelete={handleConfirmDelete}/>}</div>
      <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
      <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
          <Row>
              <Col>
                  <Button variant="yellowLong" size="lg" onClick={() => {
                  setOpenModal(true);
                  }}>Delete Stop</Button>
              </Col>
          </Row>
      </Container>
      
      <Card>
          <Card.Header as="h5">Name</Card.Header>
          <Card.Body>
              <Card.Text>{props.stop.name}</Card.Text>
          </Card.Body>
      </Card>

      <Card>
          <Card.Header as="h5">Location </Card.Header>
          <Card.Body>
              <Card.Text>{props.stop.location}</Card.Text>
          </Card.Body>
      </Card>

      <Card>
          <Card.Header as="h5">Associated Route </Card.Header>
          <Card.Body>
              <Link to={`/admin/user/${props.stop.route.id}`}>
                <Button variant='yellow'><h3>{props.stop.route.name}</h3></Button>
              </Link>
          </Card.Body>
      </Card>

      <Card>
          <Card.Header as="h5">Map View </Card.Header>
          <Card.Body>
          </Card.Body>
      </Card>

      </Container>
  </div>

  )
}

GeneralAdminStopDetails.propTypes = {
    getStudents: PropTypes.func.isRequired,
    getStopInfo: PropTypes.func.isRequired,
    deleteStop: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  stop: state.stops.viewedStop,
  students: state.students.students.results
});

export default connect(mapStateToProps, {getStopInfo,deleteStop,getStudents})(GeneralAdminStopDetails)


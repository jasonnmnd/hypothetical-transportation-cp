import React, { useState, useEffect } from 'react';
import Header from '../../header/Header';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import DeleteModal from '../components/modals/DeleteModal';
import AdminTable from '../components/table/AdminTable';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';
import { getRouteInfo, deleteRoute } from '../../../actions/routes';
import { getStopInfo, deleteStop } from '../../../actions/stops';
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import MapContainer from '../../maps/MapContainer';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'

//url will be admin/stop/:route_id/:stop_id
function NEWGeneralAdminStopDetails(props) {


  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const param = useParams();

  const handleConfirmDelete = () => {
    props.deleteStop(parseInt(param.stop_id));
    navigate(`/admin/route/${param.route_id}`);
  }
  

  useEffect(() => {
    props.getStopInfo(param.id);
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
          <Card.Header as="h5">Map View </Card.Header>
          <Card.Body>
          </Card.Body>
      </Card>

      </Container>
  </div>

  )
}

NEWGeneralAdminStopDetails.propTypes = {
    getStopInfo: PropTypes.func.isRequired,
    deleteStop: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  stop: state.stops.stop
});

export default connect(mapStateToProps, {getStopInfo,deleteStop})(NEWGeneralAdminStopDetails)


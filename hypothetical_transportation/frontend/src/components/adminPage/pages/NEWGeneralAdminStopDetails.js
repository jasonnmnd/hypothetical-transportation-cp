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
import { getStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import MapContainer from '../../maps/MapContainer';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'


function NEWGeneralAdminStopDetails(props) {


  const [openModal, setOpenModal] = useState(false);

  const handleConfirmDelete = () => {
    //Replace with API call to delete school and all its associated routes/students
    //Route back to students page
    props.deleteRoute(parseInt(param.id));
    navigate(`/admin/routes/`);
  }
  
  const navigate = useNavigate();
  const param = useParams();

  useEffect(() => {
    props.getStopInfo(param.id);
  }, []);


  //info fields: name, location, which route it belongs to?
  //a map showing the students in the corresponding route and this stop only?
  //delete stop button
  return (
      <div></div>
  )
}

NEWGeneralAdminStopDetails.propTypes = {
    getStopInfo: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(NEWGeneralAdminStopDetails)


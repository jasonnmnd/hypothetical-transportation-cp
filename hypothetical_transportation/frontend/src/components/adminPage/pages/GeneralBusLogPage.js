import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import Select from 'react-select';
import ActiveRunsTable from '../components/driver_bus_run/ActiveRunsTable';
import CompletedRunsTable from '../components/driver_bus_run/CompletedRunsTable';



function GeneralBusLogPage(props) {
  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <ActiveRunsTable />
            <CompletedRunsTable />
            
        </Container>
    </div>
    );
}

GeneralBusLogPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(GeneralBusLogPage)


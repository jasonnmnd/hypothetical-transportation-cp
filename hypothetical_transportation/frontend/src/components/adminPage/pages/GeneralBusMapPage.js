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
import BusRunsMap from '../components/driver_bus_run/BusRunsMap';
import { getBusLocation } from '../../../actions/drive';


function GeneralBusMapPage(props) {

    useEffect(() => {
        props.busNumbers.forEach(busNum => {
            props.getBusLocation(busNum)
        })
    }, [props.busNumbers]);
  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <BusRunsMap />

        </Container>
    </div>
    );
}

GeneralBusMapPage.propTypes = {
    busNumbers: PropTypes.array,
    getBusLocation: PropTypes.func.isRequired
}

GeneralBusMapPage.defaultProps = {
    busNumbers: [8019, 8002, 8055],
    
}


const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, {getBusLocation})(GeneralBusMapPage)


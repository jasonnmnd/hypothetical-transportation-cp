import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import Select from 'react-select';
import ActiveRunsTable from '../components/driver_bus_run/ActiveRunsTable';
import CompletedRunsTable from '../components/driver_bus_run/CompletedRunsTable';
import { EXAMPLE_ACTIVE_RUNS } from '../../../utils/drive';
import { getLog } from '../../../actions/drive';



function GeneralBusLogPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        let paramsToSend = Object.fromEntries([...searchParams]);
        if(paramsToSend.pageNum == null){
            paramsToSend.pageNum = "1";
        }

        props.getLog(paramsToSend);
    }, [searchParams]);

  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Bus Log</h1>
            </div>
            <ActiveRunsTable data={props.activeBusesData} count={props.activeBusesCount}/> 
        </Container>
    </div>
    );
}

GeneralBusLogPage.propTypes = {
    activeBusesData: PropTypes.array,
    activeBusesCount: PropTypes.number,
    completedBusesData: PropTypes.array,
    completedBusesCount: PropTypes.number,
    getLog: PropTypes.func.isRequired
}

GeneralBusLogPage.defaultProps = {
    activeBusesData: EXAMPLE_ACTIVE_RUNS.results,
    activeBusesCount: EXAMPLE_ACTIVE_RUNS.count,
    completedBusesData: [],
    completedBusesCount: 0,
}

const mapStateToProps = (state) => ({
    activeBusesData: state.drive.log.results,
    activeBusesCount: state.drive.log.count,

});

export default connect(mapStateToProps, {getLog})(GeneralBusLogPage)


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
import { getRouteInfo } from '../../../actions/routes';
import { getSchool } from '../../../actions/schools';
import getType from '../../../utils/user2';



function GeneralBusLogPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();
    const nav = useNavigate();
    const param = useParams();

    const paramFilterExists = () => {
        return param.filter != undefined && param.id != undefined;
    }

    useEffect(() => {
        let paramsToSend = Object.fromEntries([...searchParams]);
        if(paramsToSend.pageNum == null){
            paramsToSend.pageNum = "1";
        }
        if(paramFilterExists()){
            paramsToSend[param.filter] = param.id
        }

        props.getLog(paramsToSend);
    }, [searchParams]);

    useEffect(() => {
        if(paramFilterExists()){
            if(param.filter == 'school'){
                props.getSchool(param.id)
            } else if(param.filter == 'route'){
                props.getRouteInfo(param.id)
            }
        }
    }, [param]);

    const getTitlePrefix = () => {
        if(paramFilterExists()){
            if(param.filter == 'school'){
                return props.currentSchool.name
            } else if(param.filter == 'route'){
                return props.currentRoute.name
            }
        }
        return ""
    }

    const handleViewClick = (d) => {
        nav(`/bus/run/${d.id}`);
    }

  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>{getTitlePrefix()} Bus Log</h1>
            </div>
            <ActiveRunsTable data={props.activeBusesData} count={props.activeBusesCount} handleViewClick={handleViewClick}/> 
        </Container>
    </div>
    );
}

GeneralBusLogPage.propTypes = {
    activeBusesData: PropTypes.array,
    activeBusesCount: PropTypes.number,
    getLog: PropTypes.func.isRequired,
    getRouteInfo: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired
}

GeneralBusLogPage.defaultProps = {
    activeBusesData: EXAMPLE_ACTIVE_RUNS.results,
    activeBusesCount: EXAMPLE_ACTIVE_RUNS.count,
}

const mapStateToProps = (state) => ({
    activeBusesData: state.drive.log.results,
    activeBusesCount: state.drive.log.count,
    currentRoute: state.routes.viewedRoute,
    currentSchool: state.schools.viewedSchool,
    user: state.auth.user
});

export default connect(mapStateToProps, {getLog, getRouteInfo, getSchool})(GeneralBusLogPage)


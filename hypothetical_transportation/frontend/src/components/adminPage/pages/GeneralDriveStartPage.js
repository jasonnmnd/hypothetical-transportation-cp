import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import { getRunByDriver } from '../../../actions/drive';
import Select from 'react-select';
import StartDriveSection from '../components/driver_bus_run/StartDriveSection';
import CurrentDriveSection from '../components/driver_bus_run/CurrentDriveSection';
import { EXAMPLE_ACTIVE_RUNS, EXAMPLE_ACTIVE_RUN_1 } from '../../../utils/drive';

const NULL_OPTION = {value: null, label: "-----------------------"}


function GeneralDriveStartPage(props) {


    useEffect(() => {
        props.getRoutes();
        props.getRunByDriver(props.driverId)
    }, []);


    
    
    const startRun = () => {
        console.log("STARTING")
    }
    const endRun = () => {
        console.log("ENDING")
    }
    const arrivedAtStop = () => {
        console.log("NEXT STOP")
    }

    const driverInRun = () => {
        return props.currentRun.driver?.id == props.driverId;
    }

  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            {driverInRun() ? 
               <CurrentDriveSection busRun={props.currentRun} endRun={endRun} arriveAtStop={arrivedAtStop} /> : 
                null
            }
            {driverInRun() ? 
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Start New Run</Card.Header>
                    <Card.Body>
                        <StartDriveSection routes={props.routes}/>
                    </Card.Body>
                </Card> :
                <StartDriveSection routes={props.routes} startRun={startRun}/>
            }
            
        </Container>
    </div>
    );
}

GeneralDriveStartPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
    getRunByDriver: PropTypes.func.isRequired,
    routes: PropTypes.array,
    currentRun: PropTypes.object,
    driverId: PropTypes.number
}

// GeneralDriveStartPage.defaultProps = {
//     currentRun: EXAMPLE_ACTIVE_RUN_1,
// }

const mapStateToProps = (state) => ({
    routes: state.routes.routes.results,
    currentRun: state.drive.currentRun,
    driverId: state.auth.user.id
});

export default connect(mapStateToProps, {getRoutes, getRunByDriver})(GeneralDriveStartPage)


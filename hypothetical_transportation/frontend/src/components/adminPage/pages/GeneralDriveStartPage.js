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
import StartDriveSection from '../components/driver_bus_run/StartDriveSection';
import CurrentDriveSection from '../components/driver_bus_run/CurrentDriveSection';

const NULL_OPTION = {value: null, label: "-----------------------"}


function GeneralDriveStartPage(props) {

    // const [routeId, setRouteId] = useState(NULL_OPTION);
    // const [busNum, setBusNum] = useState(null);
    // const [isTowardSchool, setIsTowardSchool] = useState({value: true, label: "Toward School"});

    useEffect(() => {
        props.getRoutes();
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
        return true;
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
    getRoutes: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    routes: state.routes.routes.results,
    currentRun: state.drive.currentRun
});

export default connect(mapStateToProps, {getRoutes})(GeneralDriveStartPage)


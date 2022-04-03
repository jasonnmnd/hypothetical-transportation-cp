import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import { getRunByDriver, startRun, endRun, reachStop, resetError } from '../../../actions/drive';
import Select from 'react-select';
import StartDriveSection from '../components/driver_bus_run/StartDriveSection';
import CurrentDriveSection from '../components/driver_bus_run/CurrentDriveSection';
import { EXAMPLE_ACTIVE_RUNS, EXAMPLE_ACTIVE_RUN_1 } from '../../../utils/drive';
import BusRunStartConfirmModal from '../components/driver_bus_run/BusRunStartConfirmModal';


const NULL_OPTION = {value: null, label: "-----------------------"}

function GeneralDriveStartPage(props) {
    const [routeId, setRouteId] = useState(NULL_OPTION);
    const [busNum, setBusNum] = useState(null);
    const [isTowardSchool, setIsTowardSchool] = useState({value: true, label: "Toward School"});

    const [showConfirmModal, setShowConfirmModal] = useState(false)

    useEffect(() => {
        props.getRoutes();
        props.getRunByDriver(props.driverId)
        props.resetError();
    }, []);

    useEffect(() => {
        if(props.errorMessage != ""){
            setShowConfirmModal(true);
        }
    }, [props.errorMessage]);


    const startRun = (force = false) => {
        props.startRun({
            route: routeId.value ? routeId.value : props.routes[0].id,
            bus_number: busNum,
            going_towards_school: isTowardSchool.value,
            driver: props.driverId,
            force: force
        })
    }

    const endRun = () => {
        console.log("ENDING")
        props.endRun(props.currentRun.route.id)
        
    }
    const arrivedAtStop = () => {
        console.log("NEXT STOP")
        props.reachStop(props.currentRun.route.id)
    }

    const driverInRun = () => {
        return props.currentRun.driver?.id == props.driverId;
    }

    const getStartDriveSection = () => {
        return (
            <StartDriveSection 
                routes={props.routes}
                startRun={startRun}
                routeId={routeId}
                setRouteId={setRouteId}
                busNum={busNum}
                setBusNum={setBusNum}
                isTowardSchool={isTowardSchool}
                setIsTowardSchool={setIsTowardSchool}
            />
        )
    }

  
  return (
    <div>          
        <AdminHeader/>
        <BusRunStartConfirmModal show={showConfirmModal} saveModal={() => startRun(true)} errorMessage={props.errorMessage} closeModal={() => setShowConfirmModal(false)}/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            {driverInRun() ? 
               <CurrentDriveSection busRun={props.currentRun} endRun={endRun} arriveAtStop={arrivedAtStop} /> : 
                null
            }
            {driverInRun() ? 
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Start New Run</Card.Header>
                    <Card.Body>
                        {getStartDriveSection()}
                    </Card.Body>
                </Card> :
                getStartDriveSection()
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
    driverId: PropTypes.number,
    startRun: PropTypes.func.isRequired,
    endRun: PropTypes.func.isRequired,
    reachStop: PropTypes.func.isRequired,
    resetError: PropTypes.func.isRequired,
}

// GeneralDriveStartPage.defaultProps = {
//     currentRun: EXAMPLE_ACTIVE_RUN_1,
// }

const mapStateToProps = (state) => ({
    routes: state.routes.routes.results,
    currentRun: state.drive.currentRun,
    driverId: state.auth.user.id,
    errorMessage: state.drive.error
});

export default connect(mapStateToProps, {getRoutes, getRunByDriver, startRun, endRun, reachStop, resetError})(GeneralDriveStartPage)


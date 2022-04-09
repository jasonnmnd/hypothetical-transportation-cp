import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import { getRunByDriver, startRun, endRun, reachStop, resetError, getNextStop } from '../../../actions/drive';
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

    useEffect(() => {
        if(props.currentRun.route != null){
            props.getNextStop(props.currentRun.route.id)
        }
        setRouteId(NULL_OPTION);
        setBusNum(null);
        setIsTowardSchool({value: true, label: "Toward School"})
    }, [props.currentRun]);


    const startRun = (force = false) => {
        props.startRun({
            route: routeId.value ? routeId.value : props.routes[0].id,
            bus_number: parseInt(busNum),
            going_towards_school: isTowardSchool.value,
            driver: props.driverId,
            force: force
        });
    }

    const endRun = () => {
        props.endRun(props.currentRun.route.id)
        
    }
    const arrivedAtStop = () => {
        props.reachStop(props.currentRun.route.id)
    }

    const driverInRun = () => {
        return props.currentRun.driver?.id == props.driverId;
    }

    const getStartDriveSection = () => {
        return (
            <StartDriveSection 
                routes={props.routes}
                startRun={() => startRun(false)}
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
        {getType(props.user)=="driver"  ?
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            {driverInRun() ? 
               <CurrentDriveSection busRun={props.currentRun} endRun={endRun} arriveAtStop={arrivedAtStop} nextStop={props.nextStop} /> : 
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
            
        </Container>:
        <Container className="container-main">
            <Alert variant="danger">
                <Alert.Heading>Access Denied</Alert.Heading>
                <p>
                    You do not have access to this page. If you believe this is an error, contact an administrator.          
                </p>
            </Alert>
        </Container>}
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
    nextStop: PropTypes.object,
    getNextStop: PropTypes.func.isRequired
}

// GeneralDriveStartPage.defaultProps = {
//     currentRun: EXAMPLE_ACTIVE_RUN_1,
// }

const mapStateToProps = (state) => ({
    routes: state.routes.routes.results,
    currentRun: state.drive.currentRun,
    driverId: state.auth.user.id,
    errorMessage: state.drive.error,
    nextStop: state.drive.nextStop

});

export default connect(mapStateToProps, {getRoutes, getRunByDriver, startRun, endRun, reachStop, resetError, getNextStop})(GeneralDriveStartPage)


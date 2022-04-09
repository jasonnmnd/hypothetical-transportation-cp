import React, { useState, useEffect, Fragment } from 'react';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import BusRunsMap from '../components/driver_bus_run/BusRunsMap';
import { getActiveRuns, getBusLocations, resetBusLocations } from '../../../actions/drive';
import { EXAMPLE_ACTIVE_RUNS } from '../../../utils/drive';
import MapComponent from '../../maps/MapComponent';
import { InfoWindow } from '@react-google-maps/api';
import getType from '../../../utils/user2';
import { runCallEveryPeriod } from '../../../utils/live_updating';


function GeneralBusMapPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();

    const [extraComponents, setExtraComponents] = useState(null);

    const [extraComponentsPosition, setExtraComponentsPosition] = useState(null);
    const [extraComponentsBus, setExtraComponentsBus] = useState(null);
    
    


    useEffect(() => {
        props.resetBusLocations();
        let params = null;
        if(searchParams.get('school') != null && searchParams.get('school') != undefined){
            params = {
                school: searchParams.get('school')
            }
        }
        // const interval = setInterval(() => {
        //     console.log('This will run every 5 seconds!');
        //     props.getActiveRuns(params);
        //   }, 10000);
        // return () => clearInterval(interval);
        return runCallEveryPeriod(() => props.getActiveRuns(params))
        
    }, []);

    useEffect(() => {
        if(extraComponentsBus != null){
            let busChanged = props.activeRuns.find(run => run.route.id == extraComponentsBus.route.id);
            if(busChanged == undefined){
                removeExtraComponents();
            } else {
                console.log(busChanged);
                console.log(extraComponentsPosition);
                setExtraComponentsPosition({
                    lat: busChanged.location.latitude,
                    lng: busChanged.location.longitude
                })
            }
        }
        
    }, [props.activeRuns]);

    const getBusInfoForWindow = (pinStuff) => {
        return (
            <>
                <h4>Bus {pinStuff.bus_number}</h4>
                <h5>Driver: 
                    <Link to={`/${getType(props.user)}/user/${pinStuff.driver.id}?pageNum=1`}>
                        {pinStuff.driver.full_name}
                    </Link>
                </h5>
                <h5>Route: 
                    <Link to={`/${getType(props.user)}/route/${pinStuff.route.id}?pageNum=1`}>
                        {pinStuff.route.name}
                    </Link>
                </h5>
            </>
            
        )
    }

    const removeExtraComponents = () => {
        setExtraComponentsBus(null); 
        setExtraComponentsPosition(null);
    }

    const getExtraComponents = () => {
        if(extraComponentsBus == null){
            return null;
        }
        return <InfoWindow position={extraComponentsPosition} onCloseClick={removeExtraComponents} >{getBusInfoForWindow(extraComponentsBus)}</InfoWindow>
    }

    const onBusClick = (pinStuff, position) => {
        setExtraComponentsPosition(position);
        setExtraComponentsBus(pinStuff);
    }


    const getRunPin = (run) => {

        return {
            ...run,
            latitude: run.location.latitude, 
            longitude: run.location.longitude, 
        }
    }

    const getRunsWithLocation = (runs) => {
        return runs.filter(run => run.location != null)
    }

    const getPinData = () => {
        return [
            {
                iconColor: "black",
                iconType: "bus",
                markerProps: {
                    onClick: onBusClick,
                },
                pins: getRunsWithLocation(props.activeRuns).map(run => getRunPin(run))
            },
        ]
    }

    const average = (array) => array.reduce((a, b) => a + b) / array.length;

    const getCenter = () => {
        const latAverage = average(getRunsWithLocation(props.activeRuns).map(run => run.location.latitude));
        const lngAverage = average(getRunsWithLocation(props.activeRuns).map(run => run.location.longitude));
        return {lat: latAverage, lng: lngAverage}
    }

    
  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Bus Map</h1>
            </div>
            {getRunsWithLocation(props.activeRuns).length == 0 ? <h4>There are no active runs with valid locations to display.</h4> : <MapComponent pinData={getPinData()} otherMapComponents={getExtraComponents()} center={getCenter()}/>}
        </Container>
    </div>
    );
}

GeneralBusMapPage.propTypes = {
    activeRuns: PropTypes.array,
    getBusLocations: PropTypes.func.isRequired,
    getActiveRuns: PropTypes.func.isRequired,
    busLocations: PropTypes.object,
    resetBusLocations: PropTypes.func.isRequired
}

// GeneralBusMapPage.defaultProps = {
//     activeRuns: EXAMPLE_ACTIVE_RUNS.results,
    
// }


const mapStateToProps = (state) => ({
    busLocations: state.drive.busLocations,
    activeRuns: state.drive.manyRuns.results,
    user: state.auth.user
});

export default connect(mapStateToProps, {getBusLocations, getActiveRuns, resetBusLocations})(GeneralBusMapPage)


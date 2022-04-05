import React, { useState, useEffect, Fragment } from 'react';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import BusRunsMap from '../components/driver_bus_run/BusRunsMap';
import { getActiveRuns, getBusLocations } from '../../../actions/drive';
import { EXAMPLE_ACTIVE_RUNS } from '../../../utils/drive';
import MapComponent from '../../maps/MapComponent';
import { InfoWindow } from '@react-google-maps/api';


function GeneralBusMapPage(props) {

    const [extraComponents, setExtraComponents] = useState(null);


    useEffect(() => {
        props.getActiveRuns();
    }, []);

    useEffect(() => {
        
        props.getBusLocations(props.activeRuns.map(run => run.bus_number))
    }, [props.activeRuns]);

    

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
    }

    const getBusInfoForWindow = (pinStuff) => {
        return (
            <>
                <h4>Bus {pinStuff.bus_number}</h4>
                <h4>Driver: {pinStuff.driver.full_name}</h4>
                <h4>Route: {pinStuff.route.name}</h4> {/* make link */}
            </>
            
        )
    }

    const onBusClick = (pinStuff, position) => {
        createInfoWindow(position, getBusInfoForWindow(pinStuff))
    }

    const getRunPin = (busNum) => {

        return {
            ...props.activeRuns.find(run => run.bus_number == busNum), 
            latitude: props.busLocations[busNum].latitude, 
            longitude: props.busLocations[busNum].longitude, 
        }
    }

    const getPinData = () => {
        return [
            {
                iconColor: "green",
                iconType: "stop",
                markerProps: {
                    onClick: onBusClick,
                },
                pins: Object.keys(props.busLocations).map(busNum => {return getRunPin(busNum)})
            },
        ]
    }
  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <MapComponent pinData={getPinData()} otherMapComponents={extraComponents}/>
        </Container>
    </div>
    );
}

GeneralBusMapPage.propTypes = {
    activeRuns: PropTypes.array,
    getBusLocations: PropTypes.func.isRequired,
    getActiveRuns: PropTypes.func.isRequired,
    busLocations: PropTypes.object
}

GeneralBusMapPage.defaultProps = {
    activeRuns: EXAMPLE_ACTIVE_RUNS.results,
    
}


const mapStateToProps = (state) => ({
    busLocations: state.drive.busLocations,
    //activeRuns: state.drive.manyRuns.results
});

export default connect(mapStateToProps, {getBusLocations, getActiveRuns})(GeneralBusMapPage)


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
import getType from '../../../utils/user2';


function GeneralBusMapPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();

    const [extraComponents, setExtraComponents] = useState(null);


    useEffect(() => {
        let params = null;
        if(searchParams.get('school') != null && searchParams.get('school') != undefined){
            params = {
                school: searchParams.get('school')
            }
        }
        props.getActiveRuns(params);
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
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Bus Map</h1>
            </div>
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

// GeneralBusMapPage.defaultProps = {
//     activeRuns: EXAMPLE_ACTIVE_RUNS.results,
    
// }


const mapStateToProps = (state) => ({
    busLocations: state.drive.busLocations,
    activeRuns: state.drive.manyRuns.results,
    user: state.auth.user
});

export default connect(mapStateToProps, {getBusLocations, getActiveRuns})(GeneralBusMapPage)

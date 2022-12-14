import React, {useEffect, useState} from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MapComponent from '../maps/MapComponent';
import { InfoWindow } from '@react-google-maps/api';
import { TIME_TO_STRING } from '../../utils/drive';

function StudentViewMap(props) {
  const [pinData, setPinData] = useState([]);
  const [extraComponents, setExtraComponents] = useState(null);
  const [extraComponentBus, setExtraComponentBus] = useState(null);



    useEffect(()=>{
        setPinData(getPinData());
    },[props.stops, props.student, props.activeRun])

    useEffect(() => {
        if(extraComponentBus != null){
            if(props.activeRun.location == null){
                setExtraComponentBus(null)
                setExtraComponents(null);
            } else {
                const newPosition = {
                    lat: props.activeRun.location.latitude,
                    lng: props.activeRun.location.longitude
                }
                createInfoWindow(newPosition, getBusInfoForWindow(props.activeRun))
            }
        } 
        
    }, [props.activeRun]);

    const getPinData = () => {
        let pinData = getStopPinData();
        addStudentPin(pinData, onStudentClick);
        addBusPin(pinData)
        return pinData;
    }

    const getStudentPin = (s) => {
        return {
            ...s, 
            address: s.guardian.address, 
            latitude: s.guardian.latitude, 
            longitude: s.guardian.longitude
        }
    }
    const getStopPin = (stop) => {
        return {
            ...stop, 
        }
    }

    const getRunPin = () => {
        return {
            ...props.activeRun, 
            latitude: props.activeRun.location.latitude, 
            longitude: props.activeRun.location.longitude, 
        }
    }

    const addBusPin = (pinData) => {
        if(props.activeRun.location == null){
            return
        }
        pinData.push({
            iconColor: "black",
            iconType: "bus",
            markerProps: {
                onClick: onBusClick,
            },
            pins: [
                getRunPin()
            ]
        })
    }

    const getBusInfoForWindow = (pinStuff) => {
        return (
            <>
                <h4>Bus {pinStuff.bus_number}</h4>
                <h5>Driver: {pinStuff.driver.full_name}</h5>
                <h5>Route: {pinStuff.route.name}</h5>
            </>
            
        )
    }

    const onBusClick = (pinStuff, position) => {
        setExtraComponentBus(pinStuff);
        createInfoWindow(position, getBusInfoForWindow(pinStuff))
    }

    const addStudentPin = (pinData, onclick) => {
        pinData.push({
            iconColor: "green",
            iconType: "studentCheck",
            markerProps: {
                onClick: onclick
            },
            pins: [
                getStudentPin(props.student)
            ]
        })
    }

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={() => {setExtraComponents(null); setExtraComponentBus(null);}}>{windowComponents}</InfoWindow>)
    }


    const getStopPinData = () => {
        return [
            {
                iconColor: "blue",
                iconType: "stop",
                markerProps: {
                    onClick: onStopClick,
                    draggable: false,
                    onRightClick: ""
                },
                pins: props.stops.map(stop => getStopPin(stop))
            },
        ]
    }

    const getStopInfoForWindow = (pinStuff) => {
        return (
            <div>
                <h5>Name:{pinStuff.name}</h5>
                <h5>Pick Up: {pinStuff.pickup_time}</h5>
                <h5>Drop Off: {pinStuff.dropoff_time}</h5>
                <h5>ETA: {pinStuff.eta==null ? "Not Currently Available" : TIME_TO_STRING(pinStuff.eta)}</h5>
            </div>
        )
    }

    const onStopClick = (pinStuff, position) => {
        createInfoWindow(position, getStopInfoForWindow(pinStuff))
    }

    const onStudentClick = (pinStuff, position) => {
        createInfoWindow(position, 
            <><h4>{pinStuff.full_name}</h4></>
        )
    }

  return (

    <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.student.guardian.longitude),lat: Number(props.student.guardian.latitude)}}></MapComponent>

  )
}

StudentViewMap.propTypes = {
    student: PropTypes.object,
    stops: PropTypes.array,
    activeRun: PropTypes.object,
    school: PropTypes.object

}

const mapStateToProps = (state) => ({
    
});


export default connect(mapStateToProps, {} )(StudentViewMap)
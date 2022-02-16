import React, {useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import { SCHOOL_MARKER, STOP_MARKER, STUDENT_MARKER } from './static/markers';

const CLICK_FUNCTIONS = ["onClick", "onRightClick"]

function MapComponent(props) {
    const mapStyles = {        
        height: "60vh",
        width: "100%"};  
    //Geocode for location decoding
    //https://www.npmjs.com/package/react-geocode
    Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    const getSVGWithAnchor = (svg) => {
        const ret = {
            ...svg,
            anchor: new window.google.maps.Point(svg.anchor[0], svg.anchor[1])
        }
        return ret
    }

    const ICONS = {
        school: getSVGWithAnchor(SCHOOL_MARKER),
        student: getSVGWithAnchor(STUDENT_MARKER),
        stop: getSVGWithAnchor(STOP_MARKER)
    }

    const [pins, setPins] = useState([]);
    let pinInfo = [];

    const getColoredIcon = (color, icon) => {
        let iconData = {...ICONS[icon]};
        iconData.fillColor = color;
        return iconData;
    }




    useEffect(() => {
        //console.log(props.pinData)
        initializePins(props.pinData)
      }, [props.pinData]);



    
    const setClickFunc = (pinObj, position, markerInfo, propName) => {
        if(markerInfo[propName]){
            const tempFunc = markerInfo[propName];
            markerInfo[propName] = () => {tempFunc(pinObj, position)}
        }
    }

    
    const setPinClickFunctions = (pinObj, position, markerInfo) => {
        CLICK_FUNCTIONS.forEach(funcName => {
            setClickFunc(pinObj, position, markerInfo, funcName)
        })
    }

    const addMarkerFromPin = (lat, lng, pinGroup, pin) => {
        const temp = {
            position: {
                lat: lat,
                lng: lng
            },
            icon: getColoredIcon(pinGroup.iconColor, pinGroup.iconType),
            id: pin.id,
            ...pinGroup.markerProps
        }
        setPinClickFunctions(pin, {lat: lat, lng: lng}, temp)
        pinInfo = pinInfo.concat(temp);
        setPins(pinInfo)
    }
    
    const initializePins = (inPinData) => {
        inPinData.forEach((pinGroup) => {
            pinGroup.pins.forEach((pin) => {
                if(pin.latitude == null || pin.longitude == null){
                    Geocode.fromAddress(pin.address)
                    .then((response) => {  
                        
                        const { lat, lng } = response.results[0].geometry.location;
                        addMarkerFromPin(lat, lng, pinGroup, pin)
                        
                    })
                    .catch(err => console.log(err));
                }
                else {
                    addMarkerFromPin(parseFloat(pin.latitude), parseFloat(pin.longitude), pinGroup, pin)
                }
                
            })
        });
        
    }


    const getMarkers = (inPins) => {
        return inPins.map((pin, pinInd) => {
            //console.log(pin)
                return <Marker {...pin} key={pinInd} />
        })
    }


    return (
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={props.zoom}
            center={props.center}
        >
            {getMarkers(pins)}
            {props.otherMapComponents}
        </GoogleMap>
        )

}

MapComponent.propTypes = {
    pinData: PropTypes.arrayOf(
        PropTypes.shape({
            markerProps: PropTypes.object,
            pins: PropTypes.arrayOf(
                PropTypes.shape({
                    position: PropTypes.shape({
                        lng: PropTypes.number,
                        lat: PropTypes.number
                    })
                })
            )
        })
    ),
    onMapChange: PropTypes.func,
    zoom: PropTypes.number,
    center: PropTypes.shape({
        lng: PropTypes.number,
        lat: PropTypes.number
    }),
    otherMapComponents: PropTypes.element
}

MapComponent.defaultProps = {
    pinData: [],
    center: {
        lat: 40.586744, lng: -74.596304
    },
    zoom: 13,
    otherMapComponents: null
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapComponent)

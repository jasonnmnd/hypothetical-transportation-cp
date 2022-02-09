import React, {useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import { SCHOOL_MARKER, STOP_MARKER, STUDENT_MARKER } from './static/markers';

function MapComponent(props) {
    const mapStyles = {        
        height: "50vh",
        width: "50%"};  
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
        let iconData = ICONS[icon];
        iconData.fillColor = color
        return iconData;
    }




    useEffect(() => {
        initializePins(props.pinData)
      }, []);



    const initializePins = (inPinData) => {
        inPinData.forEach((pinGroup) => {
            pinGroup.pins.forEach((pin) => {
                Geocode.fromAddress(pin.address)
                .then((response) => {  
                      
                    const { lat, lng } = response.results[0].geometry.location;
                    const temp = {
                        position: {
                            lat: lat,
                            lng: lng
                        },
                        icon: getColoredIcon(pinGroup.iconColor, pinGroup.iconType),
                        ...pinGroup.markerProps
                    }
                    pinInfo = pinInfo.concat(temp);
                    setPins(pinInfo)
                    
                })
                .catch(err => console.log(err));
            })
        });
        
    }


    const getMarkers = (inPins) => {
        return inPins.map((pin) => {
                return <Marker {...pin} />
        })
    }


    return (
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={props.zoom}
            center={props.center}
        >
            {getMarkers(pins)}
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
    })
}

MapComponent.defaultProps = {
    pinData: [],
    center: {
        lat: 36.0016944, lng: -78.9480547
    },
    zoom: 13
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapComponent)

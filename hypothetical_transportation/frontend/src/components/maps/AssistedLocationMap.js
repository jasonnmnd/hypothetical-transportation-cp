import React, {useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";

const mapStyles = {        
    height: "50vh",
    width: "100%"
};

//Center at school
const defaultCenter = {
    lat: 36.0016944, lng: -78.9480547
}

function TestMap(props) {

    //Geocode for location decoding
    //https://www.npmjs.com/package/react-geocode
    Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    const [location, setLocation] = useState(defaultCenter);

    const getLongLatFromAddress = (address) => {
      console.log("Called");
      Geocode.fromAddress(address).then(
          (response) => {
              // console.log(response.results[0].geometry.location);
              const { lat, lng } = response.results[0].geometry.location;
              setLocation({lat, lng});
          },
          (error) => {
              console.log(error);
      });
    }

    const getAddressFromLongLat = (coord) => {
        Geocode.fromLatLng(coord.lat, coord.lng).then(
            (response) => {
              const address = response.results[0].formatted_address;
              props.setAddress(address);
            },
            (error) => {
              console.error(error);
            }
          );
    }

    const onMarkerDragEnd = (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLocation({ lat, lng});
        getAddressFromLongLat({lat, lng});
    };

    useEffect(() => {
        getLongLatFromAddress(props.address);
    }, [props]);

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
       <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={location}>
       {
            location.lat ? 
            <Marker key={"address"} position={location} onDragEnd={(e) => onMarkerDragEnd(e)}
                draggable={true} /> :
                null
       }
       </GoogleMap>
    </LoadScript>
 );
}

TestMap.propTypes = {
    address: PropTypes.string,
    setAddress: PropTypes.func
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(TestMap)

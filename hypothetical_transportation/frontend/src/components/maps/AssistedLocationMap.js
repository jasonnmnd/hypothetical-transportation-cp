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
    Geocode.setApiKey("AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    const [location, setLocation] = useState(defaultCenter);

    const getLongLatFromAddress = (address) => {
      Geocode.fromAddress(address).then(
          (response) => {
              // console.log(response.results[0].geometry.location);
              const { lat, lng } = response.results[0].geometry.location;
              setLocation({lat, lng});
          },
          (error) => {
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
        // console.log({lat,lng});
        props.setCoord({ lat:lat, lng:lng});
        getAddressFromLongLat({lat, lng});
    };

    useEffect(() => {
        // getLongLatFromAddress(props.address);
        setLocation(props.coord)
        console.log(props.coord)
    }, [props]);

  return (
       <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={location}>
       {
            location.lat ? 
            <Marker key={"address"} position={location} onDragEnd={(e) => onMarkerDragEnd(e)}
                draggable={props.draggable} /> :
                null
       }
       </GoogleMap>
 );
}

TestMap.propTypes = {
    address: PropTypes.string,
    coord: PropTypes.object,
    draggable: PropTypes.bool,
    setAddress: PropTypes.func,
    setCoord: PropTypes.func,
}
TestMap.defaultProps = {
  draggable: true,
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(TestMap)

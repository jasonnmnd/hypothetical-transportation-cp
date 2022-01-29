import React, {useState} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";

function MapContainer(props) {
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

    const getCoordsFromAddress = (addressString) => {
      Geocode.fromAddress(props.address).then(
          (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              console.log(lat, lng);
              return {lat, lng}
          },
          (error) => {
              console.log(error);
      });
    }

    const [userLocation, setUserLocation] = useState(defaultCenter);

    //Center at school
    const defaultCenter = {
      lat: 36.0016944, lng: -78.9480547
    }

    //Different Student Routes
    const locations = [
      {
        name: "Bryan Center",
        location: { 
          lat: 36.0010592,
          lng: -78.943267
        },
      },
      {
        name: "Wilson Gym",
        location: { 
          lat: 35.9979684,
          lng: -78.9429693
        },
      },
      {
        name: "Wilkinson Building",
        location: { 
          lat: 36.0034684,
          lng: -78.9403573
        },
      },
      {
        name: "Harris Teeter",
        location: { 
          lat: 36.0097832,
          lng: -78.9265046
        },
      },
      {
        name: "Dram & Draught",
        location: { 
          lat: 35.8898579,
          lng: -78.91806
        },
      }
    ];

  const [selected, setSelected] = useState({});

  const onSelect = loc => {
    setSelected(loc)
    // console.log(props.studentData);
    // console.log(props.schoolData);
  }

  const testClick = () => {
    console.log(props.studentData);
    console.log(props.schoolData);
  }

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
       <GoogleMap
         mapContainerStyle={mapStyles}
         zoom={13}
         center={defaultCenter}>

         {
          locations.map(item => {
            return (
            // <Marker key={item.name} position={item.location} onClick={() => onSelect(item)}/>
            <Marker key={item.name} position={item.location} onClick={() => testClick()}/>
            )
          })
         }
         <Marker key={props.schoolData.name} position={defaultCenter} onClick={() => onSelect(this)}></Marker>

         {
           selected.location && 
           (
             <InfoWindow
             position={selected.location}
             clickable={true}
             onCloseClick={()=>setSelected({})}
             >
               <p>{selected.name}</p>
             </InfoWindow>
           )
         }

       </GoogleMap>
    </LoadScript>
 );
}

MapContainer.propTypes = {
    studentData: PropTypes.arrayOf(PropTypes.string),
    // schoolData: PropTypes.shape({
    //   name: PropTypes.string,
    //   address: PropTypes.string
    // }),
    schoolData: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapContainer)

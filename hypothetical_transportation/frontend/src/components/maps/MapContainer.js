import React, {useState} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function MapContainer(props) {
    const mapStyles = {        
        height: "50vh",
        width: "50%"};
        
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
            <Marker key={item.name} position={item.location} onClick={() => onSelect(item)}/>
            )
          })
         }
         <Marker key={"Duke"} position={defaultCenter} onClick={() => onSelect(this)}></Marker>

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
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapContainer)

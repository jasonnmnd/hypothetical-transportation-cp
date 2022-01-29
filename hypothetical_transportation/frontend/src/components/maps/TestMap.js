import React from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';


const mapContainerStyle = {
    width: "50%",
    height: "50vh"
}

const center = {
    lat: 36.0016944, lng: -78.9480547
}

function TestMap() {

    const { loadError, isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58"
    })


    if (loadError) return "Error loading maps";
    if (!isLoaded) return "Loading Maps";

  return (
    <div>
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center}>

        </GoogleMap>
    </div>
  )
  
  
}

export default TestMap;

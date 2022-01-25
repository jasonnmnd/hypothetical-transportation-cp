import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

function MapContainer() {
    const mapStyles = {        
        height: "50vh",
        width: "50%"};
        
        const defaultCenter = {
        lat: 36.0016944, lng: -78.9480547
        }

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
       <GoogleMap
         mapContainerStyle={mapStyles}
         zoom={13}
         center={defaultCenter}
       />
    </LoadScript>
 );
}

export default MapContainer;

import React, { useEffect, useState } from 'react';
import "./modal.css";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Geocode from "react-geocode";

function AssistedLocationModal( {closeModal, handleConfirmAddress, address} ) {

    //Geocode for location decoding
    //https://www.npmjs.com/package/react-geocode
    Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();
    
    const getCoordsFromAddress = () => {
        Geocode.fromAddress(address).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                console.log(lat, lng);
                setUserLocation({lat: lat, lng: lng})
            },
            (error) => {
                console.log(error);
        });
    }
    
    const center = { //Defaults to WF until address is entered
        lat: 35.9592086, lng:-78.5818128
    }

    const [userLocation, setUserLocation] = useState(center);

    const mapStyles = {        
        height: "75vh",
        width: "75%"};

    useEffect(() => {
        getCoordsFromAddress();
    }, []);

  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <div className='titleCloseBtn'>
                    <button onClick={
                        () => closeModal(false)
                    }> X </button>
            </div>
            <div className='title>'></div>
                <h1>Are you sure your address is correct?</h1>

                <LoadScript googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
                    <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={userLocation}>

                    <Marker key={"Your Location"} position={userLocation}></Marker> 
                    
                    </GoogleMap>
                </LoadScript>

            <div className='footer'></div>
                <button onClick={
                    () => closeModal(false)
                } id="cancelBtn">Cancel</button>
                <button onClick={
                    () => {
                        handleConfirmAddress();
                        closeModal(false);
                    }
                } id="confirmBtn">Confirm Address</button>
        </div>
    </div>
  );
}

export default AssistedLocationModal;

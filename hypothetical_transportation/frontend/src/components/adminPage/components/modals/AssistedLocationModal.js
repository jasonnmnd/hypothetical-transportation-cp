import React from 'react';
import "./modal.css";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function AssistedLocationModal( {closeModal, handleConfirmAddress} ) {


    const mapStyles = {        
        height: "75vh",
        width: "75%"};
      
    const defaultCenter = {
        lat: 36.0016944, lng: -78.9480547
    }

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
                    center={defaultCenter}>

                    <Marker key={"Your Location"} position={defaultCenter}></Marker> 
                    
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

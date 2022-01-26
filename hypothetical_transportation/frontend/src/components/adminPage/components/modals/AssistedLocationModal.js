import React from 'react';
import "./modal.css";
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

/*
Majority of code from this tutorial to make a pop-up modal: https://www.youtube.com/watch?v=ZCvemsUfwPQ
Edited slightly for our own purposes of a confirmation screen and extra functionality
*/

function AssistedLocationModal( {closeModal, handleConfirmAddress} ) {


    const mapStyles = {        
        height: "50vh",
        width: "50%"};
      
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
            <div className='body'></div>


            <LoadScript googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
                <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={13}
                center={defaultCenter}
                />
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

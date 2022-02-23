import React, { Component, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './forms.css';
import Geocode from "react-geocode";
import { createMessageDispatch } from '../../../../actions/messages';

const NAME = "name";
const LOCATION = "location";

function ModifyStopTable(props) {
    Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();
    
    const [inputFieldStop, setInputFieldStop] = useState(null);

    const [inputField, setInputField] = useState(null);
    
    const [inputFieldValue, setInputFieldValue] = useState(null);

    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(props.stops);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        // tempData.forEach((stop, index) => stop.stop_number = index+1)
        props.setStops(tempData);
    };

    const setInput = (stop, field, value) => {
        setInputFieldStop(stop);
        setInputField(field);
        setInputFieldValue(value);
    }

    const onInputChange = (e) => {
        setInputFieldValue(e.target.value)
    }

    const changeNameOfStop = (stopToChange, newName) => {
        let tempData = Array.from(props.stops);
        let changingElement = tempData.find(stop => stop.id == stopToChange.id);
        changingElement.name = newName
        props.setStopsWithProperInds(tempData);
    }

    const changeLocationOfStop = (stopToChange, newLocation, newLat, newLng) => {
        let tempData = Array.from(props.stops);
        let changingElement = tempData.find(stop => stop.id == stopToChange.id);
        changingElement.location = newLocation;
        changingElement.latitude = newLat;
        changingElement.longitude = newLng;
        props.setStopsWithProperInds(tempData);
    }

    const handleKeyDownName = (e) => {
        if (e.key === 'Enter') {
            changeNameOfStop(inputFieldStop, inputFieldValue);
          setInput(null, null, null);
        }
    }

    const handleKeyDownLocation = (e) => {
        if (e.key === 'Enter') {
            Geocode.fromAddress(inputFieldValue).then(
                (response) => {
                    const { lat, lng } = response.results[0].geometry.location;
                    changeLocationOfStop(inputFieldStop, inputFieldValue, lat, lng);
                    setInput(null, null, null);
                },
                (error) => {
                    props.createMessageDispatch({ student: 'Please enter a valid location' });
            });
          
        }
    }

    const getNameInputComponent = (stop) => {
        if(inputFieldStop?.id == stop.id && inputField == NAME){
            return <td>
                        <input 
                            className='inputFieldInTable'
                            type="text"
                            name="stopEdit"
                            onChange={onInputChange}
                            value={inputFieldValue}
                            id={stop.id}
                            onKeyDown={handleKeyDownName}
                         />
                    </td>
        }
        return <td className='clickable' onClick={() => setInput(stop, NAME, stop.name)}>{`✏️ ${stop.name}`}</td>
    }

    const getLocationInputComponent = (stop) => {
        if(inputFieldStop?.id == stop.id && inputField == LOCATION){
            return <td>
                        <input 
                            className='inputFieldInTable'
                            type="text"
                            name="stopEdit"
                            onChange={onInputChange}
                            value={inputFieldValue}
                            id={stop.id}
                            onKeyDown={handleKeyDownLocation}
                         />
                    </td>
        }
        return <td className='clickable' onClick={() => setInput(stop, LOCATION, stop.location)}>{`✏️ ${stop.location}`}</td>
    }

    const getStopsInMapTableBody = () => {
        let tempData = Array.from(props.stops);
        tempData.sort((a, b) => a.stop_number - b.stop_number);
        return tempData.map((stop, index) => (
            <Draggable
                key={stop.id}
                draggableId={stop.id.toString()}
                index={index}
            >
                {(provider) => (
                <tr {...provider.draggableProps} ref={provider.innerRef} >
                    <td {...provider.dragHandleProps}> = </td>
                    <td>{stop.stop_number}</td>
                    {getNameInputComponent(stop, NAME)}
                    {getLocationInputComponent(stop, LOCATION)}
                    {/* <td>{stop.pickup_time}</td>
                    <td>{stop.dropoff_time}</td> */}
                </tr>
                )}
            </Draggable>
        ))
    }

    const getStopsDeletedTableBody = () => {
        return props.deletedStops.map((stop) => (
            <tr className='grayed-out-tr'> 
                <td>
                    <Button variant="delete_add" onClick={() => props.readdStop(stop)}>+</Button>
                </td>
                <td className='delete_td'>{stop.name}</td>
                <td className='delete_td'>{stop.location}</td>
            </tr>
            ))
    }

    const getDeletedTable = () => {
        return (<table className="table borderd">
        <thead>
            <tr className='tr-header-delete'>
                <th colSpan="3">Deleted Stops</th>
            </tr>
            <tr className='tr-column_names-delete'>
                <th />
                <th>Name</th>
                <th>Location</th>
            </tr>
        </thead>
            <tbody>
                {getStopsDeletedTableBody()}  
            </tbody>
    </table>)
    }
    

    



    return (
        <div className="App mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table borderd">
            <thead>
                <tr className='tr-header'>
                    <th colSpan="4">Stops in Route</th>
                </tr>
                <tr>
                <th />
                <th>Stop Number</th>
                <th>Name</th>
                <th>Location</th>
                {/* <th>Pickup Time</th>
                <th>Dropoff Time</th> */}
                </tr>
            </thead>
                
                <Droppable droppableId="droppable-1">
                    {(provider) => (
                    <tbody
                        className="text-capitalize"
                        ref={provider.innerRef}
                        {...provider.droppableProps}
                    >
                        {getStopsInMapTableBody()}
                        {provider.placeholder}
                    </tbody>
                    )}
                </Droppable>
            </table>
        </DragDropContext>
        {props.deletedStops == null || props.deletedStops.length ==0 ? null : getDeletedTable()}
        </div>
    );
}

ModifyStopTable.propTypes = {
    stops: PropTypes.array,
    title: PropTypes.string,
    setStops: PropTypes.func,
    deletedStops: PropTypes.array,
    readdStop: PropTypes.func, 
    setStopsWithProperInds: PropTypes.func,
    createMessageDispatch: PropTypes.func.isRequired
}

ModifyStopTable.defaultProps = {
    title: "Stop Table",
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps, {createMessageDispatch})(ModifyStopTable);
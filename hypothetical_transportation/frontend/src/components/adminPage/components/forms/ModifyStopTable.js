import React, { Component, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './forms.css';

const NAME = "name"

function ModifyStopTable(props) {

    
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

    const setInputOnClick = (stop) => {
        setInputFieldStop(stop);
        setInputField(NAME);
        setInputFieldValue(stop.name);
    }

    const onInputChange = (e) => {
        setInputFieldValue(e.target.value)
    }

    const changeNameOfStop = (stopToChange, newName) => {
        let tempData = Array.from(props.stops);
        let changingElementIndex = tempData.findIndex(stop => stop.id == stopToChange.id);
        tempData[changingElementIndex].name = newName
        props.setStopsWithProperInds(tempData);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            changeNameOfStop(inputFieldStop, inputFieldValue);
          setInputFieldStop(null);
          setInputFieldValue(null);
          setInputField(null);
        }
    }

    const getInputComponent = (stop) => {
        return <input 
                    type="text"
                    name="stopName"
                    onChange={onInputChange}
                    value={inputFieldValue}
                    id={stop.id}
                    onKeyDown={handleKeyDown}
        ></input>
    }
    const getStopsInMapTableBody = () => {
        let tempData = Array.from(props.stops);
        tempData.sort((a, b) => a.stop_num - b.stop_num);
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
                    <td onClick={() => setInputOnClick(stop)}>
                        {inputFieldStop?.id == stop.id ? getInputComponent(stop) : stop.name}
                    </td>
                    <td>{stop.location}</td>
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
            <tr>
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
    setStopsWithProperInds: PropTypes.func
}

ModifyStopTable.defaultProps = {
    title: "Stop Table",
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps)(ModifyStopTable);
import React, { Component, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSearchParams } from 'react-router-dom';



function ModifyStopTable(props) {

    
    const [inputField, setInputField] = useState(null);

    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(props.stops);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        // tempData.forEach((stop, index) => stop.stop_number = index+1)
        props.setStops(tempData);
    };

    const setInputOnClick = (stop) => {
        setInputField(stop.id);
    }

    const onNameInputChange = (e) => {
        let tempData = Array.from(props.stops);
        let changingElementIndex = tempData.findIndex(stop => stop.id == e.target.id);
        tempData[changingElementIndex].name = e.target.value
        props.setStopsWithProperInds(tempData);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          setInputField(null);
        }
    }

    const getInputComponent = (stop) => {
        return <input 
                    type="text"
                    name="stopName"
                    onChange={onNameInputChange}
                    value={stop.name}
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
                        {inputField == stop.id ? getInputComponent(stop) : stop.name}
                    </td>
                    <td>{stop.location}</td>
                    <td>{stop.latitude}</td>
                    <td>{stop.longitude}</td>
                </tr>
                )}
            </Draggable>
        ))
    }

    const getStopsDeletedTableBody = () => {
        return props.deletedStops.map((stop) => (
            <tr>
                <td onClick={() => props.readdStop(stop)} >+</td>
                <td>{stop.name}</td>
                <td>{stop.location}</td>
                <td>{stop.latitude}</td>
                <td>{stop.longitude}</td>
            </tr>
            ))
    }
    

    



    return (
        <div className="App mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table borderd">
            <thead>
                <tr>
                    <th colSpan="5">Stops in Route</th>
                </tr>
                <tr>
                <th />
                <th>Stop Number</th>
                <th>Name</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
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
        <table className="table borderd">
            <thead>
                <tr>
                    <th colSpan="5">Deleted Stops</th>
                </tr>
                <tr>
                <th />
                <th>Name</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                </tr>
            </thead>
                <tbody>
                    {getStopsDeletedTableBody()}  
                </tbody>
        </table>
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
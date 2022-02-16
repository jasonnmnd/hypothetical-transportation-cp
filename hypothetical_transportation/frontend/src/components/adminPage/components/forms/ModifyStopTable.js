import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";



function ModifyStopTable(props) {

    const COLUMNS = [
        {
            key: "name",
            dataKey: "name",
            width: 250,
            title: "Stop Name"
        },
        {
            key: "address",
            dataKey: "address",
            width: 500,
            title: "Address"
        },
    ]


    const handleDragEnd = (e) => {
        if (!e.destination) return;
        let tempData = Array.from(props.stops);
        let [source_data] = tempData.splice(e.source.index, 1);
        tempData.splice(e.destination.index, 0, source_data);
        console.log(tempData)
        props.setStops(tempData);
    };

    return (
        <div className="App mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
            <table className="table borderd">
            <thead>
                <tr>
                <th />
                <th>Name</th>
                <th>Address</th>
                <th>ID</th>
                </tr>
            </thead>
            <Droppable droppableId="droppable-1">
                {(provider) => (
                <tbody
                    className="text-capitalize"
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                >
                    {props.stops?.map((stop, index) => (
                    <Draggable
                        key={stop.id}
                        draggableId={stop.id.toString()}
                        index={index}
                    >
                        {(provider) => (
                        <tr {...provider.draggableProps} ref={provider.innerRef}  >
                            <td {...provider.dragHandleProps}> = </td>
                            <td>{stop.name}</td>
                            <td>{stop.address}</td>
                            <td>{stop.id}</td>
                        </tr>
                        )}
                    </Draggable>
                    ))}
                    {provider.placeholder}
                </tbody>
                )}
            </Droppable>
            </table>
        </DragDropContext>
        </div>
    );
}

ModifyStopTable.propTypes = {
    stops: PropTypes.array,
    title: PropTypes.string,
    setStops: PropTypes.func
}

ModifyStopTable.defaultProps = {
    title: "Stop Table",
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps)(ModifyStopTable);
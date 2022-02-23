import React, { useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import '../../NEWadminPage.css';

import { Container, ButtonGroup, ToggleButton, Card, Button, Form, Collapse } from 'react-bootstrap';


function RoutePlannerInstructions(props) {
  
    const [openInstruc, setOpenInstruc] = useState(false);

    return (
        <>
            <div className='d-flex flex-row justify-content-center'>
            <Button
            onClick={() => setOpenInstruc(!openInstruc)}
            aria-controls="example-collapse-text"
            aria-expanded={openInstruc}
            variant="instrucToggle"
            >
                Route Planner Instructions {openInstruc ? "▲" : "▼"}
            </Button>
            </div>
            
            <Collapse in={openInstruc}>
            <Card>
                <Card.Body>
                <div id="example-collapse-text">
                    <div className='d-flex flex-row justify-content-center'>
                    <strong>Welcome to the route planner interface.</strong>
                    </div>
                    <p>Within this interface, you can interactively modify and create routes.</p>
                    <ul>
                        <li>Select "Add New Route" to make a new route with name and description.</li>
                        <li>Select "Add/Remove Students" to add or remove any student to the currently selected route from the dropdown. Right click to see the student's info. Left click to add/remove a student.</li>
                        <li>Select "Stop Planner" to plan stops for the selected route.</li>
                    </ul>

                    <br></br>

                    <p>Additionally you can interface with the stop planner to modify and create stops.</p>
                    <ul>
                        <li>Drag and drop stops to reposition. Right click to remove stop. Left click to view info.</li>
                        <li>You can edit stop names, stop descriptions, and reorder stops with the table.</li>
                    </ul>
                </div>
                </Card.Body>
            </Card>
            </Collapse>
        </>
  )
}

RoutePlannerInstructions.propTypes = {
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(RoutePlannerInstructions)

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
                    <p>Within this interface, you can interactively modify and create routes. Students are shown with the student pin, and the school is shown with the school pin.</p>
                    <ul>
                        <li>Select "Create New Route" to make a new route with name. When creating a new route, first give it a name and route description. After submission you will have the ability to add students to this route.  </li>
                        <li>Select "Edit Existing Route" to add any student to the currently selected route from the dropdown. Left click to see information on the school or student. Right click to assign the student to this route. If a student is in another route, they will be removed and put in this route. </li>
                        <li>Select "Remove Students from Routes" to remove any student from their existing route. Right click to remove any student from their current route.</li>
                    </ul>
                    <p>In edit mode, you can update a route's name and description and click "Save" to finalize those changes. To finalize any edits for students on the map, click "Save Changes". To clear current edits, click "Reset Changes".</p>
                    <p>Changes you make to student's route will be retained across the interface. For example, if you remove student A from route 10 in the Remove Student From Routes interface, when you go back to edit any existing routes in the dropdown list, you will see student A marked as red (without route). When "Save Change" is pressed, all student changes across all routes will be updated at the same time. This is for the purpose of convenience and allowing user to bulk edit routes and students to their desire; however, note that without clicking "Save Changes", none of the changes will be saved to the database. They will also not retain after navigating away from the interface or refreshing. </p>
                    <p>Note!: clicking "Save Changes" does not save the changes you made to the name/description field! Navigating away from a route will also wipe any changes you made to the name/description field if it was not saved! Click the specific "Save" button for saving name/description information</p>
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

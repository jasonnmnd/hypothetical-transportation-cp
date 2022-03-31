import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';

const NULL_OPTION = {value: null, label: "-----------------------"}

function CurrentDriveSection(props) {

  return (
    <>
        <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Current Run</Card.Header>
            <Card.Body>
                <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
                    <Card.Text><strong>Route: </strong> route name</Card.Text>
                    <Card.Text><strong>Bus Number: </strong> bus number</Card.Text>
                    <Card.Text><strong>Direction: </strong> direc</Card.Text>
                    <Card.Text><strong>Last Seen Stop: </strong> last stop</Card.Text>
                </Container>
            </Card.Body>
        </Card>
        <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Current Run Actions</Card.Header>
            <Card.Body>
                <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
                    <Button variant="yellowsubmit" onClick={props.arriveAtStop} >Arrived at Next Stop</Button>
                    <Button onClick={props.endRun}>End Bus Run</Button>
                </Container>
            </Card.Body>
        </Card>
    </>
    );
}

CurrentDriveSection.propTypes = {
    busRun: PropTypes.object,
    arriveAtStop: PropTypes.func,
    endRun: PropTypes.func

}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(CurrentDriveSection)


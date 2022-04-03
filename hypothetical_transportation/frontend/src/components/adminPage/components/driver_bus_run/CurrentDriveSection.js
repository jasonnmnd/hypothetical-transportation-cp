import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import NextStopConfirmModal from './NextStopConfirmModal';

const NULL_OPTION = {value: null, label: "-----------------------"}

function CurrentDriveSection(props) {

    const [showConfirm, setShowConfirm] = useState(false)

    const onArriveAtStop = () => {
        setShowConfirm(true);
    }

  return (
    <>
        <NextStopConfirmModal closeModal={() => setShowConfirm(false)} saveModal={props.arriveAtStop} stopAddress={props.nextStop?.location} show={showConfirm} />
        <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Current Run</Card.Header>
            <Card.Body>
                <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
                    <Card.Text><strong>Route: </strong> {props.busRun?.route?.name}</Card.Text>
                    <Card.Text><strong>Bus Number: </strong> {props.busRun?.bus_number}</Card.Text>
                    <Card.Text><strong>Direction: </strong> {props.busRun?.is_towards_school ? "Toward School" : "Away From School"}</Card.Text>
                </Container>
            </Card.Body>
        </Card>
        <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Current Run Actions</Card.Header>
            <Card.Body>
                <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
                    <Button variant="yellowsubmit" onClick={onArriveAtStop} >Arrived at {props.nextStop?.name}</Button>
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
    endRun: PropTypes.func,
    nextStop: PropTypes.object
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(CurrentDriveSection)


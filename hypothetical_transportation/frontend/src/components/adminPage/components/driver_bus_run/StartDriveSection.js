import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';

const NULL_OPTION = {value: null, label: "-----------------------"}

function StartDriveSection(props) {

    const [routeId, setRouteId] = useState(NULL_OPTION);
    const [busNum, setBusNum] = useState(null);
    const [isTowardSchool, setIsTowardSchool] = useState({value: true, label: "Toward School"});


    const startRun = () => {
        props.startRun(routeId.value, busNum, isTowardSchool.value)
    }

    
    const getRouteOptions = () => {
        return props.routes.map((item)=> {
            return ({value:item.id, label:item.name})
        })    
    }

    const getDirectionOptions = () => {
        return [
            {value: true, label: "Toward School"},
            {value: false, label: "Away from School"},
        ]
    }

    const getRouteSelectValue = () => {
        if(routeId.value == null){
            return {value: props.routes[0].id, label: props.routes[0].name}
        }
        return routeId;
    }


    if(props.routes.length == 0) {
        return (
                <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
                    Please ask your adminstrator to create some routes for this school system.
                </Container>
        )
    }
  
  return (
                <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                    <Form.Group as={Col} controlId="routeselect">
                        <Form.Label as="h5">Route</Form.Label>
                        <Select  options={getRouteOptions()} value={getRouteSelectValue()} onChange={setRouteId}/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridID">
                        <Form.Label as="h5">Bus Number</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Enter A Bus Number Between 8000-8999 ..." 
                            value={busNum == null ? "" : busNum}
                            onChange={(e)=> setBusNum(e.target.value == "" ? null : e.target.value) }
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid ID.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridAddress4">
                        <Form.Label as="h5">Direction</Form.Label>
                        <Select  options={getDirectionOptions()} value={isTowardSchool} onChange={setIsTowardSchool}/>
                    </Form.Group>
                    <Button variant="yellowsubmit" onClick={startRun}>
                                Start Drive
                    </Button>
                </Form>
    );
}

StartDriveSection.propTypes = {
    routes: PropTypes.array,
    startRun: PropTypes.func
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(StartDriveSection)


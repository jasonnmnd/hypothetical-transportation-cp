import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';


function StartDriveSection(props) {

    
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
        if(props.routeId.value == null){
            return {value: props.routes[0].id, label: props.routes[0].name}
        }
        return props.routeId;
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
                        <Select  options={getRouteOptions()} value={getRouteSelectValue()} onChange={props.setRouteId}/>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridID">
                        <Form.Label as="h5">Bus Number</Form.Label>
                        <Form.Control 
                            type="text"
                            placeholder="Enter A Bus Number Between 8000-8999 ..." 
                            value={props.busNum == null ? "" : props.busNum}
                            onChange={(e)=> props.setBusNum(e.target.value == "" ? null : e.target.value) }
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">Please provide a valid ID.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridAddress4">
                        <Form.Label as="h5">Direction</Form.Label>
                        <Select  options={getDirectionOptions()} value={props.isTowardSchool} onChange={props.setIsTowardSchool}/>
                    </Form.Group>
                    <Button variant="yellowsubmit" onClick={props.startRun}>
                                Start Drive
                    </Button>
                </Form>
    );
}

StartDriveSection.propTypes = {
    routes: PropTypes.array,
    startRun: PropTypes.func,
    routeId: PropTypes.object,
    setRouteId: PropTypes.func,
    busNum: PropTypes.string,
    setBusNum: PropTypes.func,
    isTowardSchool: PropTypes.object,
    setIsTowardSchool: PropTypes.func
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(StartDriveSection)


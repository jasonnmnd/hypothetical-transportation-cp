import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../../NEWadminPage.css";
import {Card, Form, Button, Container} from 'react-bootstrap';

function ModifyRouteInfo(props) {

    const [fieldValues, setFieldValues] = useState({
        routeName: props.routeName,
        routeDescription: props.routeDescription
    });

    useEffect(() => {
        setFieldValues({
            routeName: props.routeName,
            routeDescription: props.routeDescription
        });
    }, [props.routeName, props.routeDescription])
    

    const onChange = (e) => {
        setFieldValues({ 
            ...fieldValues,
            [e.target.name]: e.target.value 
        });
    }
    
    const onSubmit = (e) => {
        e.preventDefault();
        props.onSubmitFunc(fieldValues);
    }
  
    return (
      <>
      {/* <div className="card card-body mt-4 mb-4">
        <h2>{props.title}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Route Name</label>
            <input
              className="form-control"
              type="text"
              name="routeName"
              onChange={onChange}
              value={fieldValues.routeName}
            />
          </div>
          <div className="form-group">
            <label>Route Description</label>
            <input
              className="form-control"
              type="text"
              name="routeDescription"
              onChange={onChange}
              value={fieldValues.routeDescription}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Save Name and Description Information
            </button>
          </div>
        </form>
      </div> */}

      <Container>
        <Card style={{height: "400px"}}>
          {props.title ? <Card.Header as="h5">{props.title}</Card.Header> : null}
          <Card.Body>
            <Form className="shadow-none p-3 mb-5 bg-white rounded" onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="formGridName">
                <Form.Label as="h5">Route Name</Form.Label>
                <Form.Control 
                  required
                  type="text"
                  placeholder="Enter route name..." 
                  value={fieldValues.routeName}
                  onChange={(e) => setFieldValues({
                    ...fieldValues, routeName : e.target.value
                })}
                  />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridDescription">
                <Form.Label as="h5">Route Description</Form.Label>
                <Form.Control 
                  type="text"
                  as="textarea"
                  placeholder="Enter route description..." 
                  style={{ height: '100px', maxHeight: "300px" }}
                  value={fieldValues.routeDescription}
                  onChange={(e) => setFieldValues({
                      ...fieldValues, routeDescription : e.target.value
                  })}
                  />
              </Form.Group>

              <Button variant="yellowLong" type="submit">
                Save Route Name and Description
              </Button>

            </Form>
          </Card.Body>
        </Card>
      </Container>
      
      </>
    );
}

ModifyRouteInfo.propTypes = {
    title: PropTypes.string,
    routeName: PropTypes.string,
    routeDescription: PropTypes.string,
    onSubmitFunc: PropTypes.func
}

ModifyRouteInfo.defaultProps = {
    routeName: "",
    routeDescription: "",
    onSubmitFunc: (fieldValues)=>{},
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps)(ModifyRouteInfo);
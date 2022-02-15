import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function ModifyStopTable(props) {

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
      <div className="card card-body mt-4 mb-4">
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
              Save
            </button>
          </div>
        </form>
      </div>
    );
}

ModifyStopTable.propTypes = {
    title: PropTypes.string,
    routeName: PropTypes.string,
    routeDescription: PropTypes.string,
    onSubmitFunc: PropTypes.func
}

ModifyStopTable.defaultProps = {
    title: "Route Modify",
    routeName: "",
    routeDescription: "",
    onSubmitFunc: (fieldValues)=>{},
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps)(ModifyStopTable);
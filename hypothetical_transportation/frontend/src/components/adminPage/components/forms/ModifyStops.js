import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ModifyStopTable from './ModifyStopTable';
import ModifyStopInfo from './ModifyStopInfo';
import { Container, Card, Button, Form } from 'react-bootstrap';



function ModifyStops(props) {

    const showInfo = () => {
      return false;
    }

    const showTable = () => {
      return true;
    }
  
    return (
      <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        {showTable() ? <ModifyStopTable stops={props.stops} setStops={props.setStops}/> : null}
        {showInfo() ? <ModifyStopInfo/> : null}
      </Container>
    );
}

ModifyStops.propTypes = {
    title: PropTypes.string,
    stops: PropTypes.array,
    setStops: PropTypes.func
}

ModifyStops.defaultProps = {
    
}

const mapStateToProps = (state) => ({
 
});

export default connect(mapStateToProps)(ModifyStops);
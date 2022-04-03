import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';



function BusRunsMap(props) {
  
  return (
    <div>          
        Bus Map
    </div>
    );
}

BusRunsMap.propTypes = {
    activeRuns: PropTypes.array
}

const mapStateToProps = (state) => ({
  activeRuns: state.drive.manyRuns
});

export default connect(mapStateToProps, {})(BusRunsMap)


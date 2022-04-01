import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';



function ActiveRunsTable(props) {
  
  return (
    <div>          
        active runs
    </div>
    );
}

ActiveRunsTable.propTypes = {
    
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(ActiveRunsTable)


import React, { useState, useEffect, Fragment } from 'react';
import "../../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Col, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import { EXAMPLE_ACTIVE_RUN, EXAMPLE_ACTIVE_RUNS, EXAMPLE_ACTIVE_RUN_2 } from '../../../../utils/drive';
import GeneralAdminTableView from '../views/GeneralAdminTableView';



function ActiveRunsTable(props) {

    
  
  return (
    
    <>
        <GeneralAdminTableView 
            title='Bus Log'
            tableType='activeDrive'
            values={props.data}
            totalCount={props.count}
            action={props.handleViewClick}
        />
    </>
    );
}

ActiveRunsTable.propTypes = {
    data: PropTypes.array,
    count: PropTypes.number,
    handleViewClick: PropTypes.func
}

ActiveRunsTable.defaultProps = {
    data: EXAMPLE_ACTIVE_RUNS.results,
    count: EXAMPLE_ACTIVE_RUNS.count
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(ActiveRunsTable)


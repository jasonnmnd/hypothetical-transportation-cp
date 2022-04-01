import React, { useState, useEffect, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import "../adminPage.css";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AdminHeader from '../../header/AdminHeader';
import { Container, Form, Col, Button, Card, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { getRoutes } from '../../../actions/routes';
import Select from 'react-select';
import ActiveRunsTable from '../components/driver_bus_run/ActiveRunsTable';
import CompletedRunsTable from '../components/driver_bus_run/CompletedRunsTable';



function GeneralBusLogPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();

    const activityIsActive = () => {
        return searchParams.get("activity") == null || searchParams.get("activity") == "active"
    }

  
  return (
    <div>          
        <AdminHeader/>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
            <ButtonGroup>
                <ToggleButton
                    key={"active"}
                    id={`radio-active`}
                    type="radio"
                    variant={'outline-warning'}
                    name="active"
                    value={"active"}
                    checked={activityIsActive()}
                    onChange={(e)=>{
                        console.log(e)
                        setSearchParams({
                            ...Object.fromEntries([...searchParams]),
                            activity: "active"
                        })
                    }}
                >
                    Active runs
                </ToggleButton>
                <ToggleButton
                    key={"completed"}
                    id={`radio-completed`}
                    type="radio"
                    variant={'outline-warning'}
                    name="completed"
                    value={"completed"}
                    checked={!activityIsActive()}
                    onChange={(e)=>{
                        setSearchParams({
                            ...Object.fromEntries([...searchParams]),
                            activity: "completed"
                        })
                    }}
                >
                    Completed runs
                </ToggleButton>
            </ButtonGroup>
            {activityIsActive() ? <ActiveRunsTable /> : <CompletedRunsTable />}
            
            
        </Container>
    </div>
    );
}

GeneralBusLogPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(GeneralBusLogPage)


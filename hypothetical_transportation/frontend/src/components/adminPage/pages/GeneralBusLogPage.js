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
import { EXAMPLE_ACTIVE_RUNS } from '../../../utils/drive';



function GeneralBusLogPage(props) {

    let [searchParams, setSearchParams] = useSearchParams();

    const activityIsActive = () => {
        return searchParams.get("activity") == null || searchParams.get("activity") == "active"
    }

    useEffect(() => {
        let paramsToSend = Object.fromEntries([...searchParams]);
        if(paramsToSend.pageNum == null){
            paramsToSend.pageNum = "1";
        }

        //props.getRoutes(paramsToSend);
    }, [searchParams]);

  
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
            {activityIsActive() ? <ActiveRunsTable data={props.activeBusesData} count={props.activeBusesCount}/> : <ActiveRunsTable data={props.completedBusesData} count={props.completedBusesCount}/>}
            
            
        </Container>
    </div>
    );
}

GeneralBusLogPage.propTypes = {
    activeBusesData: PropTypes.array,
    activeBusesCount: PropTypes.number,
    completedBusesData: PropTypes.array,
    completedBusesCount: PropTypes.number,
}

GeneralBusLogPage.defaultProps = {
    activeBusesData: EXAMPLE_ACTIVE_RUNS.results,
    activeBusesCount: EXAMPLE_ACTIVE_RUNS.count,
    completedBusesData: [],
    completedBusesCount: 0,
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {})(GeneralBusLogPage)


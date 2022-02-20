import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../NEWadminPage.css";
import { Container, Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'; 
import { connect } from 'react-redux';
import { getSchools } from '../../../actions/schools';
import { getRoutes } from '../../../actions/routes';
import PropTypes from 'prop-types';
import { filterObjectForKeySubstring } from '../../../utils/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';



function GeneralAdminEmailPage(props) {
    const nagivate = useNavigate();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [currSchool, setCurrSchool] = useState("");
    const [currRoute, setCurrRoute] = useState("");
    const [emailSelection, setEmailSelection] = useState(1);
    const [thisIsRouteAnnouncement, setThisIsRouteAnnouncement] = React.useState(false);

    const ROUTE_PREFIX = "rou";
    let [searchParams, setSearchParams] = useSearchParams();
    const allSearchParams = Object.fromEntries([...searchParams]);
    let routeSearchParams = filterObjectForKeySubstring(allSearchParams, ROUTE_PREFIX);

    const handleThisIsRouteAnnouncement = () => {
        setThisIsRouteAnnouncement(!thisIsRouteAnnouncement);
      };

    const param = useParams();

    const handleEmailSelection = (e) => {
        setEmailSelection(e.target.value);
        if (e.target.value == 1) {
            setCurrSchool("");
            setCurrRoute("");
        } 
        else if (e.target.value == 2) {
            setCurrRoute("");
        }
    }

    const setSchool = (e) => {
        setCurrSchool(e.target.value);
        routeSearchParams.school = e.target.value
        props.getRoutes(routeSearchParams);
    }
    
    const setRoute = (e) => {
        setCurrRoute(e.target.value);
    }

    const getIdType = (buttonVal) => {
        if (buttonVal == 1) {
            return "ALL"
        } else if (buttonVal == 2) {
            return "SCHOOL"
        } else if (buttonVal == 3) {
            return "ROUTE"
        }
    }

    const submit = (e) => {
        e.preventDefault();
        // if(!props.schoollist.some(v => ((''+v.id) === currSchool))){
        //     alert("Something is wrong with the school you entered. The selection has been cleared; please select from the dropdown list instead.")
        //     setCurrSchool("")
        //     setCurrRoute("")
        // }
        // if(!props.routes.some(v => ((''+v.id) === currRoute))){
        //     alert("Something is wrong with the route you entered. The selection has been cleared; please select from the dropdown list instead.")
        //     setCurrSchool("")
        //     setCurrRoute("")
        // }

        //Make bakend call here
        console.log("Submit button pressed with school " + currSchool + " and route " + currRoute);
        
        const payload = {
            object_id: currSchool == "" ? currRoute : currSchool,
            id_type: getIdType(emailSelection),
            subject: subject,
            body: body
        }
        
        axios.post('/api/send-announcement', payload)
          .then((res) => {
            nagivate(`/admin`);
            alert('Email Successfully Sent!');
          })
          .catch((err) => {
            alert('Email was not sent. Please try again.')
        });
    }

    const emailTypes = [
        {name: "All Parents", value: 1},
        {name: "School", value: 2},
        {name: "Route", value: 3},
    ]

    useEffect(() => {
        props.getSchools();
        if(param.school_id!==null && param.school_id!==undefined){
            setCurrSchool(param.school_id);
            routeSearchParams.school = param.school_id;
            props.getRoutes(routeSearchParams);
            setEmailSelection(2);
        }
        if(param.route_id!==null && param.route_id!==undefined){
            setCurrRoute(param.route_id);
            setEmailSelection(3);
        }
    }, []);


    useEffect(() => {
        props.getSchools();
        if(param.school_id!==null && param.school_id!==undefined){
            setCurrSchool(param.school_id);
            routeSearchParams.school = param.school_id;
            props.getRoutes(routeSearchParams);
            setEmailSelection(2);
            if(param.route_id!==null && param.route_id!==undefined){
                setCurrRoute(param.route_id);
                setEmailSelection(3);
            }
        }else{
            setCurrSchool("");
            setCurrRoute("");
            setEmailSelection(1);
        }
    }, [param]);


    // useEffect(() => {            
    //     console.log(props.schoollist[0])
    //     if(props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0){
    //         routeSearchParams.school = props.schoollist[0].id
    //         props.getRoutes(routeSearchParams);
    //         setCurrSchool(props.schoollist[0].id);
    //     }
    // },[props.schoollist]);

    // useEffect(() => {
    //     if(props.routes!==null && props.routes!==undefined && props.routes.length!==0){
    //         setCurrRoute(props.routes[0].id);
    //     }
    // },[props.routes]);
    
  return (
    <>
        <Header></Header>
        <Container className="container-main">
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Send Email</h1>
            </div>
            <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                <Container className='d-flex justify-content-center'>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                        <ButtonGroup>
                        {emailTypes.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={'outline-success'}
                                name="radio"
                                value={radio.value}
                                checked={emailSelection == radio.value}
                                onChange={(e)=>{
                                    handleEmailSelection(e);
                                }}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                        </ButtonGroup>
                    </Form.Group>
                </Container>

                <Container className='d-flex flex-row justify-content-center'>
                    <label>
                        <input type="checkbox" checked={thisIsRouteAnnouncement} onChange={handleThisIsRouteAnnouncement} />
                        <strong>{"  Include Route Announcement Information"}</strong>
                    </label>
                </Container>
                
                {emailSelection == 1 ? 
                    <></>
                    :
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "20px"}}>
                        <Form.Select size="sm" style={{width: "300px"}} value={currSchool} onChange={setSchool}>
                                <option value={"null"} >{"-----"}</option>
                                {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                                    return <option value={u.id} key={i}>{u.name}</option>
                                }):null}
                        </Form.Select>
                        {
                            emailSelection == 2 ? 
                            <></>
                            :
                            <Form.Select size="sm" style={{width: "300px"}} value={currRoute} onChange={setRoute}>
                                <option value={"null"} >{"-----"}</option>
                                {props.routes!==null && props.routes!==undefined && props.routes.length!==0?props.routes.map((u,i)=>{
                                    return <option value={u.id} key={i}>{u.name}</option>
                                }):null}
                            </Form.Select>  
                            
                            
                        }
                    </Container>
                }

                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label as="h5">Subject Title</Form.Label>
                    <Form.Control 
                    required type="text"
                    placeholder="Enter Title..." 
                    value={subject}
                    onChange={(e)=>{
                        setSubject(e.target.value)
                    }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">Email Body</Form.Label>
                    <Form.Control 
                    as="textarea"
                    required type="text"
                    style={{ height: '300px' }}
                    placeholder="Enter Email Body..." 
                    value={body}
                    onChange={(e)=>{
                        setBody(e.target.value)
                        }}                    
                        />
                </Form.Group>

                <Button variant="yellowsubmit" type="submit" onClick={submit}>
                    Submit
                </Button>

            </Form>
        </Container>

    </>
  );
}

GeneralAdminEmailPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    schoollist: state.schools.schools.results,
    routes: state.routes.routes.results,
})

export default connect(mapStateToProps, {getSchools, getRoutes}) (GeneralAdminEmailPage);
